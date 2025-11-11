import React, { useState } from 'react';
import { authAPI } from '../api';
import './Login.css';

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hobby_top1, setHobby_top1] = useState('general');
  const [club_top1, setClub_top1] = useState('general');
  const [reads_books, setReads_books] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(email, password);
      } else {
        response = await authAPI.register(email, password, hobby_top1, club_top1, reads_books);
      }

      onLogin(response.data.token, {
        userId: response.data.userId,
        email: response.data.email
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Cannot connect to server. Make sure the backend is running on http://localhost:4000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="app-icon">⚡</div>
        <h1>
          <span className="title-main">Coding Hours</span>{' '}
          <span className="title-accent">Forecaster</span>
        </h1>
        <p className="tagline">Track your coding time and forecast your progress</p>
      </div>

      <div className="login-card">
        <div className="tabs">
          <button
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span>✕</span> {error}
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="input-group">
                <label>Top Hobby</label>
                <select value={hobby_top1} onChange={(e) => setHobby_top1(e.target.value)}>
                  <option value="general">General</option>
                  <option value="coding">Coding</option>
                  <option value="programming">Programming</option>
                  <option value="gaming">Gaming</option>
                  <option value="reading">Reading</option>
                </select>
              </div>

              <div className="input-group">
                <label>Top Club</label>
                <select value={club_top1} onChange={(e) => setClub_top1(e.target.value)}>
                  <option value="general">General</option>
                  <option value="coding">Coding Club</option>
                  <option value="tech">Tech Club</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label>
                  <input
                    type="checkbox"
                    checked={reads_books}
                    onChange={(e) => setReads_books(e.target.checked)}
                  />
                  {' '}Reads Books
                </label>
              </div>
            </>
          )}

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Password</label>
              {isLogin && (
                <a href="#" className="forgot-link">Forgot Password?</a>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            {!isLogin && (
              <small style={{ color: '#f5576c', marginTop: '0.25rem', display: 'block' }}>
                Minimum 8 characters required
              </small>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {isLogin ? (
              <>
                <span className="btn-icon">→</span> Sign In
              </>
            ) : (
              <>
                <span className="btn-icon">+</span> Create Account
              </>
            )}
          </button>
        </form>

        <div className="switch-link">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }}>
                Register
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }}>
                Sign in
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;


