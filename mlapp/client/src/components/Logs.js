import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logsAPI } from '../api';
import './Logs.css';

function Logs({ user, onLogout }) {
  const [logs, setLogs] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('1');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const response = await logsAPI.getLogs();
      setLogs(response.data);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await logsAPI.addLog(date, duration, category);
      setSuccess('Log added successfully!');
      setDate(new Date().toISOString().split('T')[0]);
      setDuration('1');
      setCategory('General');
      loadLogs();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add log');
    }
  };

  const handleExport = async () => {
    try {
      const response = await logsAPI.exportCSV();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'logs.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to export CSV');
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        await logsAPI.importCSV(event.target.result);
        setSuccess('CSV imported successfully!');
        loadLogs();
      } catch (error) {
        setError('Failed to import CSV');
      }
    };
    reader.readAsText(file);
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr;
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return dateStr;
    }
  };


  const getCategoryColor = (cat) => {
    const colors = {
      'General': '#666',
      'Web Dev': '#4facfe',
      'Mobile': '#f5576c',
      'Data Science': '#00f2fe',
      'Other': '#999'
    };
    return colors[cat] || '#666';
  };

  return (
    <div className="logs-page">
      <div className="gradient-header">
        <h1>Coding Hours Forecaster</h1>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/forecast">Forecast</Link>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </nav>
      </div>

      <div className="logs-content">
        <div className="logs-card">
          <h2>Logs</h2>

          <form onSubmit={handleAdd} className="log-form">
            <div className="form-row">
              <div className="input-group date-input">
                <label>Date</label>
                <div className="input-wrapper">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  <span className="calendar-icon">📅</span>
                </div>
              </div>

              <div className="input-group duration-input">
                <label>Duration (hours)</label>
                <input
                  type="number"
                  step="0.25"
                  min="0.25"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>

              <div className="input-group category-input">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="General">General</option>
                  <option value="Web Dev">Web Dev</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary">Add</button>
            </div>
          </form>

          <div className="action-buttons">
            <button onClick={loadLogs} className="btn btn-blue">Refresh</button>
            <button onClick={handleExport} className="btn btn-green">Export CSV</button>
            <label className="btn btn-orange">
              Import CSV
              <input type="file" accept=".csv" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="logs-list">
            {logs.length === 0 ? (
              <div className="no-logs">No logs yet. Add your first coding session!</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="log-entry">
                  <div className="log-info">
                    <span className="log-date">{formatDate(log.date)}</span>
                    <span className="log-duration">— {log.duration}h</span>
                    <span 
                      className="log-category" 
                      style={{ backgroundColor: getCategoryColor(log.category) + '20', color: getCategoryColor(log.category) }}
                    >
                      {log.category}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logs;


