const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 4000;
const JWT_SECRET = 'your-secret-key-change-in-production';

app.use(cors());
app.use(bodyParser.json());

// In-memory storage (replace with database in production)
let users = [];
let logs = [];
let userProfiles = [];

// Simple prediction model
function predictCodingHours(hobby_top1, club_top1, reads_books) {
  // Simple linear model based on features
  // These weights can be trained with actual data
  const baseHours = 1.0;
  const hobbyWeight = hobby_top1 === 'coding' || hobby_top1 === 'programming' ? 0.5 : 0.2;
  const clubWeight = club_top1 === 'coding' || club_top1 === 'tech' ? 0.3 : 0.1;
  const booksWeight = reads_books ? 0.2 : 0.0;
  
  return baseHours + hobbyWeight + clubWeight + booksWeight;
}

// Generate forecast for next 7 days
function generateForecast(userId, historyPoints) {
  const userProfile = userProfiles.find(p => p.userId === userId);
  if (!userProfile) return null;

  const { hobby_top1, club_top1, reads_books } = userProfile;
  const basePrediction = predictCodingHours(hobby_top1, club_top1, reads_books);
  
  // Use historical average if available
  const userLogs = logs.filter(l => l.userId === userId);
  const avgHours = userLogs.length > 0 
    ? userLogs.reduce((sum, log) => sum + log.duration, 0) / userLogs.length 
    : basePrediction;

  const forecast = [];
  const today = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Add some variation based on day of week
    const dayOfWeek = date.getDay();
    const variation = dayOfWeek === 0 || dayOfWeek === 6 ? -0.1 : 0.1;
    
    const predicted = Math.max(0.5, avgHours + variation + (i * 0.05));
    const range = predicted * 0.2;
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      hours: Math.round(predicted * 100) / 100,
      range: {
        min: Math.round((predicted - range) * 100) / 100,
        max: Math.round((predicted + range) * 100) / 100
      }
    });
  }
  
  return forecast;
}

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, hobby_top1, club_top1, reads_books } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = users.length + 1;

    users.push({
      id: userId,
      email,
      password: hashedPassword
    });

    userProfiles.push({
      userId,
      hobby_top1: hobby_top1 || 'general',
      club_top1: club_top1 || 'general',
      reads_books: reads_books || false
    });

    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, userId, email });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, userId: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user stats
app.get('/api/stats', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const userLogs = logs.filter(l => l.userId === userId);

  const totalHours = userLogs.reduce((sum, log) => sum + log.duration, 0);
  const avgPerDay = userLogs.length > 0 ? totalHours / userLogs.length : 0;
  const entries = userLogs.length;

  res.json({
    totalHours: Math.round(totalHours * 100) / 100,
    avgPerDay: Math.round(avgPerDay * 100) / 100,
    entries
  });
});

// Get logs
app.get('/api/logs', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const userLogs = logs.filter(l => l.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(userLogs);
});

// Add log
app.post('/api/logs', authenticateToken, (req, res) => {
  try {
    const { date, duration, category } = req.body;
    const userId = req.user.userId;

    if (!date || !duration) {
      return res.status(400).json({ error: 'Date and duration required' });
    }

    const log = {
      id: logs.length + 1,
      userId,
      date,
      duration: parseFloat(duration),
      category: category || 'General'
    };

    logs.push(log);
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get forecast
app.get('/api/forecast', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const userLogs = logs.filter(l => l.userId === userId);
  const historyPoints = userLogs.length;

  const forecast = generateForecast(userId, historyPoints);
  if (!forecast) {
    return res.status(400).json({ error: 'User profile not found' });
  }

  res.json({
    forecast,
    historyPoints,
    predictions: forecast.length
  });
});

// Export CSV
app.get('/api/export', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const userLogs = logs.filter(l => l.userId === userId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const csv = [
    'Date,Duration,Category',
    ...userLogs.map(log => `${log.date},${log.duration},${log.category}`)
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=logs.csv');
  res.send(csv);
});

// Import CSV
app.post('/api/import', authenticateToken, (req, res) => {
  try {
    const { csv } = req.body;
    const userId = req.user.userId;

    const lines = csv.split('\n').slice(1); // Skip header
    const imported = [];

    lines.forEach((line, index) => {
      const [date, duration, category] = line.split(',');
      if (date && duration) {
        const log = {
          id: logs.length + 1 + index,
          userId,
          date: date.trim(),
          duration: parseFloat(duration.trim()),
          category: (category || 'General').trim()
        };
        logs.push(log);
        imported.push(log);
      }
    });

    res.json({ imported: imported.length, logs: imported });
  } catch (error) {
    res.status(500).json({ error: 'Invalid CSV format' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


