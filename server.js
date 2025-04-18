import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './backend/routes/auth.routes.js';
import userRoutes from './backend/routes/user.routes.js';
import sequelize from './backend/config/database.js';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Changed from 8080 to avoid conflicts

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection helper
const connectDatabase = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('SQLite database connection has been established successfully.');
    
    // Sync database models - using force:false to prevent dropping tables
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized');
    return true;
  } catch (err) {
    console.error('Database initialization error:', err);
    return false;
  }
};

// Initialize database connection on startup
connectDatabase();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Serve static assets from the Vite build output - ensure proper order
const distPath = path.join(__dirname, 'dist');

// Serve assets from dist directory first (production build)
app.use(express.static(distPath));

// Then serve from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Also serve static files from the root directory (for development)
app.use(express.static(__dirname));

// Handle SPA routing - send all requests to index.html except for API and static files
app.get('*', (req, res, next) => {
  // Skip API routes and static files
  if (req.path.startsWith('/api') || req.path.includes('.')) {
    return next();
  }
  
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) {
      console.error('Error sending index.html:', err);
      next(err);
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// For local development
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === undefined) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// For Vercel serverless deployment
export default app;
