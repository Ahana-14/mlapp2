# Coding Hours Forecaster for SNU Hackathons

A simple web application to track coding hours and forecast future coding activity to help balance hackathon teams.

## Features

- **User Authentication**: Login and registration with user profiles
- **Coding Hours Logging**: Track daily coding hours with categories
- **Forecasting**: Predict future coding hours based on:
  - `hobby_top1`: Top hobby (coding/programming weighted higher)
  - `club_top1`: Top club (coding/tech clubs weighted higher)
  - `reads_books`: Reading habit indicator
- **Dashboard**: View total hours, daily averages, and visualizations
- **CSV Import/Export**: Manage logs via CSV files

## Tech Stack

- **Frontend**: React, React Router, Recharts
- **Backend**: Node.js, Express
- **Authentication**: JWT tokens
- **Storage**: In-memory (replace with database for production)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install server dependencies:
```bash
cd server
npm install
cd ..
```

3. Install client dependencies:
```bash
cd client
npm install
cd ..
```

### Running the Application

**Option 1: Run both server and client together**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Usage

1. **Register/Login**: Create an account or login with existing credentials
   - During registration, provide:
     - Top hobby (coding/programming preferred for better predictions)
     - Top club (coding/tech clubs preferred)
     - Whether you read books

2. **Log Coding Hours**: 
   - Go to "Logs" page
   - Add date, duration (hours), and category
   - View all your logged entries

3. **View Dashboard**:
   - See total hours, daily average, and entry count
   - View history and forecast chart

4. **Generate Forecast**:
   - Go to "Forecast" page
   - Click "Run Forecast" to see predictions for next 7 days
   - Forecast uses your profile features and historical data

## Prediction Model

The simple prediction model uses:
- Base hours: 1.0h
- Hobby weight: +0.5h if coding/programming, +0.2h otherwise
- Club weight: +0.3h if coding/tech, +0.1h otherwise
- Books weight: +0.2h if reads books, 0h otherwise
- Historical average adjustment
- Day-of-week variation

## Project Structure

```
mlapp/
├── server/
│   ├── index.js          # Express server and API routes
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.js        # Main app component
│   │   └── api.js        # API client
│   └── package.json
├── package.json
└── README.md
```

## Notes

- This is a simple implementation for hackathon use
- Data is stored in-memory (resets on server restart)
- For production, replace with a proper database
- The prediction model can be improved with actual training data

## License

MIT


