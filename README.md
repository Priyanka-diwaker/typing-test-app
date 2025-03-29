# Typing Test Application

A full-stack MERN application for typing tests with performance analytics and psychological insights.

## Features

- Real-time typing test with 15s/30s timer
- WPM and accuracy tracking
- User authentication
- Session history and analytics
- Psychological insights based on typing patterns

## Project Structure

```
typing-test/
├── frontend/          # React.js frontend
├── backend/           # Node.js/Express backend
└── README.md
```

## Setup Instructions

### Backend Setup
1. Navigate to backend directory
2. Install dependencies: `npm install`
3. Create .env file with required environment variables
4. Start server: `npm run dev`

### Frontend Setup
1. Navigate to frontend directory
2. Install dependencies: `npm install`
3. Start development server: `npm start`

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

## API Endpoints

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - User login
- GET /api/auth/user - Get user details

### Typing Sessions
- POST /api/sessions - Store typing session
- GET /api/sessions/:userId - Get user sessions
- GET /api/analysis/:sessionId - Get session analysis 