import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Environment variable for JWT secret (should be in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'jetset-app-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    console.log('Registration request received:', {
      ...req.body,
      password: req.body.password ? '***' : undefined
    });
    
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      console.error('Missing required fields');
      return res.status(400).json({
        message: 'All fields are required',
        details: {
          firstName: !firstName ? 'First name is required' : null,
          lastName: !lastName ? 'Last name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long'
      });
    }

    try {
      const user = await User.create({
        firstName,
        lastName,
        email,
        password
      });

      const token = jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      console.log('User registered successfully:', {
        id: user.id,
        email: user.email
      });

      res.status(201).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token
      });
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({
          message: 'User with this email already exists'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in register controller:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.error('Missing login credentials');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      console.error('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await User.matchPassword(password, user.password);
    if (!isMatch) {
      console.error('Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    console.log('User logged in successfully:', { id: user.id, email: user.email });

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    console.log('GetMe request received for user:', req.user.id);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error('User not found in getMe:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('GetMe successful for user:', { id: user.id, email: user.email });

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  } catch (error) {
    console.error('Error in getMe controller:', error);
    res.status(500).json({ message: 'Server error while fetching user data', error: error.message });
  }
};
