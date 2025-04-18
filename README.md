# JetSet App

A modern full-stack application built with React, Node.js, and SQLite.

## Features

- User authentication with JWT
- User profile management
- RESTful API with Express
- SQLite database with Sequelize ORM
- React frontend with Vite

## Project Structure

```
├── backend/             # Backend Node.js code
│   ├── config/          # Database configuration
│   ├── controllers/     # API controllers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Sequelize models
│   └── routes/          # API routes
├── database/            # SQLite database files
├── public/              # Static assets
├── resources/           # Frontend React code
│   ├── css/             # Stylesheets
│   └── js/              # React components
└── server.js            # Express server entry point
```

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/Crazycoders283/jetset.git
   cd jetset
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`

4. Start the development server:
   ```
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:9999/api

## Available Scripts

- `npm run dev`: Starts both backend and frontend in development mode
- `npm run server`: Runs just the Node.js backend
- `npm run client`: Runs just the React frontend
- `npm run build`: Builds the frontend for production
- `npm start`: Starts the production server

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user
- `GET /api/auth/me`: Get current user profile

### Users
- `GET /api/users`: Get all users (admin only)
- `GET /api/users/:id`: Get user by ID
- `PUT /api/users/:id`: Update user
- `DELETE /api/users/:id`: Delete user

## Technologies Used

- **Frontend**: React, React Router, Axios, Vite, Tailwind CSS
- **Backend**: Node.js, Express, Sequelize
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)

## Development

The project uses a concurrently package to run both frontend and backend servers simultaneously during development.

## Testing the API

A test script is included to verify API functionality:
```
node backend/test-api.js
```

## License

MIT
