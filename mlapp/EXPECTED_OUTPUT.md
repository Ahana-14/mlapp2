# Expected Output When Running the Project

## Current Status
**Node.js is not installed or not in PATH.** 

To run this project, you need to:
1. Install Node.js from https://nodejs.org/
2. Restart your terminal/command prompt
3. Then run the commands below

---

## Expected Output When Running

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install
```

**Expected Output:**
```
npm WARN deprecated ... (various warnings)
added 50 packages in 5s
```

```bash
# Install server dependencies
cd server
npm install
```

**Expected Output:**
```
npm WARN deprecated ... (various warnings)
added 20 packages in 3s
```

```bash
# Install client dependencies
cd ../client
npm install
```

**Expected Output:**
```
npm WARN deprecated ... (various warnings)
added 500+ packages in 30s
```

---

### Step 2: Run the Project

#### Option A: Run Both Together
```bash
npm run dev
```

**Expected Output:**
```
[0] Server running on http://localhost:4000
[1] 
[1] > coding-hours-forecaster-client@1.0.0 start
[1] > react-scripts start
[1] 
[1] Compiled successfully!
[1] 
[1] You can now view coding-hours-forecaster-client in the browser.
[1] 
[1]   Local:            http://localhost:3000
[1]   On Your Network:  http://192.168.x.x:3000
[1] 
[1] Note that the development build is not optimized.
[1] To create a production build, use npm run build.
```

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Expected Output:**
```
Server running on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view coding-hours-forecaster-client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

---

## What You'll See in the Browser

### 1. Login Page (http://localhost:3000)
- Gradient background (purple to orange)
- "Coding Hours Forecaster" title
- Login/Register tabs
- Email and password fields
- Error message if backend is not running: "Cannot connect to server. Make sure the backend is running on http://localhost:4000"

### 2. Dashboard (after login)
- Header with navigation (Logs, Forecast, Logout)
- Three metric cards:
  - Total hours: 0 (initially)
  - Average / day: 0 (initially)
  - Entries: 0 (initially)
- History & Forecast chart (empty initially)

### 3. Logs Page
- Form to add logs (Date, Duration, Category)
- Buttons: Add, Refresh, Export CSV, Import CSV
- Empty logs list initially

### 4. Forecast Page
- "Run Forecast" button
- Prediction chart (after clicking button)
- List of 7-day predictions

---

## API Endpoints (Backend Output)

When the backend is running, you can test endpoints:

```bash
# Test server is running
curl http://localhost:4000/api/stats
```

**Expected Output (without auth):**
```json
{"error":"Access token required"}
```

---

## Common Errors and Solutions

### Error: "Cannot connect to server"
- **Cause**: Backend not running
- **Solution**: Start backend with `npm run server` or `cd server && npm start`

### Error: "npm is not recognized"
- **Cause**: Node.js not installed or not in PATH
- **Solution**: Install Node.js from https://nodejs.org/ and restart terminal

### Error: "Port 3000 already in use"
- **Cause**: Another app using port 3000
- **Solution**: Kill the process or change port in `client/package.json`

### Error: "Port 4000 already in use"
- **Cause**: Another app using port 4000
- **Solution**: Change PORT in `server/index.js` or kill the process

---

## Success Indicators

✅ **Backend Running Successfully:**
- Console shows: "Server running on http://localhost:4000"
- No error messages

✅ **Frontend Running Successfully:**
- Browser opens automatically to http://localhost:3000
- Login page displays correctly
- No console errors in browser

✅ **Full Stack Working:**
- Can register new user
- Can login
- Can add logs
- Can view forecast
- No connection errors


