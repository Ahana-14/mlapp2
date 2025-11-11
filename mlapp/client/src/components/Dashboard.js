import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI, forecastAPI, logsAPI } from '../api';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState({ totalHours: 0, avgPerDay: 0, entries: 0 });
  const [forecast, setForecast] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, forecastRes, logsRes] = await Promise.all([
        statsAPI.getStats(),
        forecastAPI.getForecast(),
        logsAPI.getLogs()
      ]);

      setStats(statsRes.data);
      setForecast(forecastRes.data);
      
      // Prepare chart data - separate history and forecast
      const historyData = logsRes.data.map(log => ({
        date: log.date,
        hours: log.duration,
        min: log.duration,
        max: log.duration,
        type: 'history'
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      const forecastData = forecastRes.data.forecast.map(f => ({
        date: f.date,
        hours: f.hours,
        min: f.range.min,
        max: f.range.max,
        type: 'forecast'
      }));

      // Combine for display
      const chartData = [...historyData, ...forecastData].sort((a, b) => new Date(a.date) - new Date(b.date));

      setLogs(chartData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="dashboard">
      <div className="gradient-header">
        <h1>Coding Hours Forecaster</h1>
        <nav>
          <Link to="/logs">Logs</Link>
          <Link to="/forecast">Forecast</Link>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </nav>
      </div>

      <div className="dashboard-content">
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Total hours</h3>
            <div className="value">{stats.totalHours}</div>
            <div className="subtitle">All time coding hours</div>
          </div>
          <div className="metric-card blue">
            <h3>Average / day</h3>
            <div className="value">{stats.avgPerDay}</div>
            <div className="subtitle">Daily average hours</div>
          </div>
          <div className="metric-card orange">
            <h3>Entries</h3>
            <div className="value">{stats.entries}</div>
            <div className="subtitle">Total log entries</div>
          </div>
        </div>

        <div className="chart-card">
          <h2>History & Forecast</h2>
          {loading ? (
            <div className="loading">Loading chart...</div>
          ) : logs.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={logs}>
                <defs>
                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b794f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#b794f6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => {
                    try {
                      return new Date(value).toLocaleDateString();
                    } catch {
                      return value;
                    }
                  }}
                  formatter={(value, name) => {
                    if (name === 'hours') return [`${value}h`, 'Hours'];
                    if (name === 'max') return [`${value}h (max)`, 'Max'];
                    if (name === 'min') return [`${value}h (min)`, 'Min'];
                    return value;
                  }}
                />
                {/* Forecast range - show shaded area between min and max for forecast points */}
                {logs.some(log => log.type === 'forecast') && (
                  <>
                    <Area 
                      type="monotone" 
                      dataKey="max" 
                      stroke="#b794f6" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      fill="url(#forecastGradient)" 
                      connectNulls
                      name="max"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="min" 
                      stroke="#b794f6" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      fill="#fff" 
                      connectNulls
                      name="min"
                    />
                  </>
                )}
                {/* Main line */}
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#667eea" 
                  strokeWidth={2}
                  fill="url(#historyGradient)"
                  dot={{ fill: '#667eea', r: 4 }}
                  activeDot={{ r: 6 }}
                  connectNulls
                  name="hours"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No data available. Start logging your coding hours!</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


