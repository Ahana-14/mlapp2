// src/components/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  const MIN_PASSWORD_LENGTH = 8;

  const clientValidate = () => {
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return 'Please provide a valid email address.';
    }
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // client-side validation for register and login
    const clientErr = clientValidate();
    if (clientErr) {
      setError(clientErr);
      return;
    }

    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login(email.trim(), password);
      } else {
        // registration payload
        const payload = {
          email: email.trim(),
          password,
          hobby_top1,
          club_top1,
          reads_books: Boolean(reads_books),
        };
        response = await authAPI.register(payload);
      }

      // expected: response.data.token and response.data.userId/email
      const token = response?.data?.token;
      const userId = response?.data?.userId ?? response?.data?.id;
      const userEmail = response?.data?.email ?? email.trim();

      if (!token) {
        throw new Error('Authentication failed: no token received.');
      }

      onLogin(token, { userId, email: userEmail });
    } catch (err) {
      // Prefer server-provided message, else fallback
      const serverMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message;
      setError(
        serverMsg ||
          'Cannot connect to server. Make sure the backend is running and reachable.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" aria-live="polite">
      <div className="login-header">
        <div className="app-icon" aria-hidden>
          ⚡
        </div>
        <h1>
          <span className="title-main">Coding Hours</span>{' '}
          <span className="title-accent">Forecaster</span>
        </h1>
        <p className="tagline">Track your coding time and forecast your progress</p>
      </div>

      <div className="login-card" role="region" aria-label={isLogin ? 'Login form' : 'Registration form'}>
        <div className="tabs" role="tablist" aria-label="Authentication tabs">
          <button
            role="tab"
            aria-selected={isLogin}
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setError('');
              setIsLogin(true);
            }}
            type="button"
          >
            Login
          </button>
          <button
            role="tab"
            aria-selected={!isLogin}
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setError('');
              setIsLogin(false);
            }}
            type="button"
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="error-message" role="alert">
              <span aria-hidden>✕</span> <span>{error}</span>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          {!isLogin && (
            <>
              <div className="input-group">
                <label htmlFor="hobby_top1">Top Hobby</label>
                <select
                  id="hobby_top1"
                  value={hobby_top1}
                  onChange={(e) => setHobby_top1(e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="coding">Coding</option>
                  <option value="programming">Programming</option>
                  <option value="gaming">Gaming</option>
                  <option value="reading">Reading</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="club_top1">Top Club</label>
                <select
                  id="club_top1"
                  value={club_top1}
                  onChange={(e) => setClub_top1(e.target.value)}
                >
                  <option value="general">General</option>
                  <option value="coding">Coding Club</option>
                  <option value="tech">Tech Club</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label className="checkbox-label">
                  <input
                    id="reads_books"
                    name="reads_books"
                    type="checkbox"
                    checked={reads_books}
                    onChange={(e) => setReads_books(e.target.checked)}
                  />
                  <span>Reads Books</span>
                </label>
              </div>
            </>
          )}

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password">Password</label>
              {isLogin ? (
                // use a Link routed to a "forgot password" page if your app has one
                <Link to="/forgot" className="forgot-link">
                  Forgot Password?
                </Link>
              ) : null}
            </div>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={MIN_PASSWORD_LENGTH}
              aria-required="true"
            />

            {!isLogin && (
              <small role="note" style={{ color: '#f5576c', marginTop: '0.25rem', display: 'block' }}>
                Minimum {MIN_PASSWORD_LENGTH} characters required
              </small>
            )}
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? (
              <span className="btn-loading" aria-hidden>
                Loading…
              </span>
            ) : isLogin ? (
              <>
                <span className="btn-icon" aria-hidden>→</span> Sign In
              </>
            ) : (
              <>
                <span className="btn-icon" aria-hidden>+</span> Create Account
              </>
            )}
          </button>
        </form>

        <div className="switch-link">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setError('');
                  setIsLogin(false);
                }}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => {
                  setError('');
                  setIsLogin(true);
                }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
