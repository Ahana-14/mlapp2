// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statsAPI, forecastAPI, logsAPI } from '../api';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState({ totalHours: 0, avgPerDay: 0, entries: 0 });
  const [forecast, setForecast] = useState(null); // used below in forecast summary
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, forecastRes, logsRes] = await Promise.all([
        statsAPI.getStats(),
        forecastAPI.getForecast(),
        logsAPI.getLogs()
      ]);

      // Defensive: ensure data shapes exist
      setStats(statsRes?.data ?? { totalHours: 0, avgPerDay: 0, entries: 0 });
      setForecast(forecastRes?.data ?? null);

      // Prepare history data from logs
      const historyData = (logsRes?.data ?? []).map((log) => ({
        date: log.date,
        hours: Number(log.duration) || 0,
        min: Number(log.duration) || 0,
        max: Number(log.duration) || 0,
        type: 'history'
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      // Prepare forecast data (if present)
      const forecastPoints = (forecastRes?.data?.forecast ?? []).map((f) => ({
        date: f.date,
        hours: Number(f.hours) || 0,
        min: Number(f.range?.min) || Number(f.hours) || 0,
        max: Number(f.range?.max) || Number(f.hours) || 0,
        type: 'forecast'
      }));

      // Combine for chart (history first, then forecast); sort by date
      const chartData = [...historyData, ...forecastPoints].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setLogs(chartData);
    } catch (error) {
      // keep console.error for debugging on CI logs
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Small helper for nicer numeric display
  const fmtNum = (v, digits = 0) => {
    if (v === null || v === undefined) return '-';
    if (typeof v === 'number') return v.toLocaleString(undefined, { maximumFractionDigits: digits });
    const n = Number(v);
    return Number.isNaN(n) ? v : n.toLocaleString(undefined, { maximumFractionDigits: digits });
  };

  // Get next forecast item (first forecast point by date)
  const nextForecast = (() => {
    const fcArr = forecast?.forecast ?? [];
    if (!Array.isArray(fcArr) || fcArr.length === 0) return null;
    // sort by date to be safe
    const sorted = [...fcArr].sort((a, b) => new Date(a.date) - new Date(b.date));
    return sorted[0];
  })();

  return (
    <div className="dashboard">
      <div className="gradient-header">
        <div className="header-left">
          <h1>Coding Hours Forecaster</h1>
          <div className="subtitle-small">Plan your practice, track progress</div>
        </div>

        <nav className="header-nav">
          <Link to="/logs">Logs</Link>
          <Link to="/forecast">Forecast</Link>
          {user?.name ? (
            <span className="user-greeting">Hi, {user.name}</span>
          ) : null}
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </nav>
      </div>

      <div className="dashboard-content">
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Total hours</h3>
            <div className="value">{fmtNum(stats.totalHours)}</div>
            <div className="subtitle">All time coding hours</div>
          </div>

          <div className="metric-card blue">
            <h3>Average / day</h3>
            <div className="value">{fmtNum(stats.avgPerDay, 1)}</div>
            <div className="subtitle">Daily average hours</div>
          </div>

          <div className="metric-card orange">
            <h3>Entries</h3>
            <div className="value">{fmtNum(stats.entries)}</div>
            <div className="subtitle">Total log entries</div>
          </div>

          {/* Forecast summary card (uses `forecast` state so it's not unused) */}
          <div className="metric-card purple">
            <h3>Next forecast</h3>
            {nextForecast ? (
              <>
                <div className="value">{fmtNum(nextForecast.hours, 1)}h</div>
                <div className="subtitle">
                  {formatDate(nextForecast.date)} • {fmtNum(nextForecast.range?.min ?? nextForecast.hours, 1)}h – {fmtNum(nextForecast.range?.max ?? nextForecast.hours, 1)}h
                </div>
                <div className="tiny-note">Model confidence: {forecast?.confidence ? `${Math.round(forecast.confidence * 100)}%` : '—'}</div>
              </>
            ) : (
              <div className="no-forecast">No forecast available</div>
            )}
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
                    <stop offset="5%" stopColor="#b794f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#b794f6" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
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

                {/* Forecast shaded min/max area (only if forecast points exist) */}
                {logs.some((log) => log.type === 'forecast') && (
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
                      isAnimationActive={false}
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
                      isAnimationActive={false}
                    />
                  </>
                )}

                {/* Main hours line (history + forecast combined) */}
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
