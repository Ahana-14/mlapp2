import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { forecastAPI } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import './Forecast.css';

function Forecast({ user, onLogout }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await forecastAPI.getForecast();
      setForecast(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load forecast');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getBarColor = (hours, index) => {
    const colors = [
      '#667eea', // purple
      '#f5576c', // pink
      '#f093fb', // light pink
      '#f5576c', // orange
      '#ffd700', // gold/yellow
      '#38ef7d', // green
      '#4facfe'  // blue
    ];
    return colors[index % colors.length];
  };

  const chartData = forecast?.forecast.map((f, index) => ({
    date: formatDate(f.date),
    fullDate: f.date,
    hours: f.hours,
    min: f.range.min,
    max: f.range.max,
    color: getBarColor(f.hours, index)
  })) || [];

  const totalWeekly = forecast?.forecast.reduce((sum, f) => sum + f.hours, 0) || 0;

  return (
    <div className="forecast-page">
      <div className="gradient-header">
        <h1>Coding Hours Forecaster</h1>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/logs">Logs</Link>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </nav>
      </div>

      <div className="forecast-content">
        <div className="forecast-header">
          <button onClick={loadForecast} className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Run Forecast'}
          </button>
          {forecast && (
            <div className="forecast-info">
              <span>{forecast.historyPoints} history points - {forecast.predictions} predictions</span>
              <span className="total-weekly">Total Weekly: {totalWeekly.toFixed(2)}h</span>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {forecast && (
          <div className="forecast-card">
            <h2>Prediction Chart</h2>
            
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value, name) => [value + 'h', name]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="hours" 
                    radius={[8, 8, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="legend">
              <div className="legend-item">
                <span className="legend-color high"></span>
                <span>High (≥1.3h avg)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color low"></span>
                <span>Low (&lt;1.3h avg)</span>
              </div>
            </div>

            <div className="forecast-list">
              {forecast.forecast.map((f, index) => (
                <div key={index} className="forecast-item">
                  <div className="forecast-date">{f.date}</div>
                  <div className="forecast-hours">
                    Hours: <strong>{f.hours}</strong> ({f.range.min} - {f.range.max})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!forecast && !loading && (
          <div className="no-forecast">
            Click "Run Forecast" to generate predictions for the next 7 days.
          </div>
        )}
      </div>
    </div>
  );
}

export default Forecast;


