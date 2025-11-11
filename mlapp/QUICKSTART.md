# Quick Start Guide

## ✅ Backend & Frontend Status

Both backend and frontend are fully set up and ready to use!

### Backend (Server)
- **Location**: `server/`
- **Port**: 4000
- **File**: `server/index.js`
- **Features**:
  - Express.js API server
  - JWT authentication
  - User registration/login
  - Coding hours logging
  - Forecast generation using ML features
  - CSV import/export

### Frontend (Client)
- **Location**: `client/`
- **Port**: 3000
- **Entry**: `client/src/index.js`
- **Features**:
  - React application
  - Login/Registration pages
  - Dashboard with metrics
  - Logs management
  - Forecast visualization

## 🚀 Start Both Services

### Option 1: Run Together (Recommended)
```bash
npm run dev
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm start
```

## 📋 First Time Setup

1. **Install all dependencies:**
```bash
npm run install-all
```

Or manually:
```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

2. **Start the application:**
```bash
npm run dev
```

3. **Access the app:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## 🔗 API Endpoints

The frontend connects to these backend endpoints:

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/stats` - Get user statistics
- `GET /api/logs` - Get all logs
- `POST /api/logs` - Add new log
- `GET /api/forecast` - Get forecast predictions
- `GET /api/export` - Export logs as CSV
- `POST /api/import` - Import logs from CSV

## ✅ Verification Checklist

- [x] Backend server created (`server/index.js`)
- [x] Frontend React app created (`client/src/`)
- [x] API client configured (`client/src/api.js`)
- [x] All components created (Login, Dashboard, Logs, Forecast)
- [x] Routes configured
- [x] Authentication flow working
- [x] Prediction model using ML features

## 🎯 Next Steps

1. Run `npm run dev` to start both services
2. Open http://localhost:3000 in your browser
3. Register a new account
4. Start logging your coding hours!
5. View forecasts on the Forecast page


