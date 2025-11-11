import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (email, password, hobby_top1, club_top1, reads_books) => 
    api.post('/register', { email, password, hobby_top1, club_top1, reads_books }),
};

export const logsAPI = {
  getLogs: () => api.get('/logs'),
  addLog: (date, duration, category) => api.post('/logs', { date, duration, category }),
  exportCSV: () => api.get('/export', { responseType: 'blob' }),
  importCSV: (csv) => api.post('/import', { csv }),
};

export const statsAPI = {
  getStats: () => api.get('/stats'),
};

export const forecastAPI = {
  getForecast: () => api.get('/forecast'),
};

export default api;


