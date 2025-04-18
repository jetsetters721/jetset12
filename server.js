import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './backend/routes/auth.routes.js';
import userRoutes from './backend/routes/user.routes.js';
import emailRoutes from './backend/routes/email.routes.js';
import supabase from './backend/config/supabase.js';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Global request debugging middleware
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log(`📥 Headers: ${JSON.stringify(req.headers['content-type'])}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📥 Body: ${JSON.stringify(req.body)}`);
  }
  next();
});

// Test Supabase connection
const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').single();
    if (error) throw error;
    console.log('✅ Supabase connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to Supabase:', error.message);
    return false;
  }
};

// Initialize Supabase connection on startup
testSupabaseConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', emailRoutes);

// Direct test email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    console.log('📧 Direct email endpoint hit with data:', req.body);
    
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error('📧 ERROR: Missing Resend API key in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Missing email API key'
      });
    }
    
    // Import and initialize Resend with a try-catch to handle any errors
    let resend;
    try {
      const { Resend } = await import('resend');
      resend = new Resend(process.env.RESEND_API_KEY);
    } catch (importError) {
      console.error('📧 ERROR: Failed to initialize Resend:', importError);
      return res.status(500).json({
        success: false,
        error: 'Failed to initialize email service'
      });
    }
    
    const { name, email, phone, type = 'callback', details = {} } = req.body;
    
    // Simple formatted email with dynamic content based on type
    let html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0066b2; padding: 20px; text-align: center; color: white;">
          <h1>${type.toUpperCase()} Request Confirmation</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Dear ${name},</p>
          <p>Thank you for your ${type} request. We have received your information and will contact you shortly.</p>
          
          <div style="background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <h3>Your Request Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
    `;
    
    // Add type-specific content
    if (type === 'package' && details) {
      html += `
            <h3>Package Information:</h3>
            <p><strong>Package Name:</strong> ${details.packageName || 'Not specified'}</p>
            <p><strong>Travel Date:</strong> ${details.travelDate || 'Not specified'}</p>
            <p><strong>Number of Guests:</strong> ${details.guests || 'Not specified'}</p>
            <p><strong>Budget:</strong> ${details.budget || 'Not specified'}</p>
            <p><strong>Special Requests:</strong> ${details.request || 'None'}</p>
      `;
    } else if (type === 'rental' && details) {
      html += `
            <h3>Hotel Booking Information:</h3>
            <p><strong>Hotel Name:</strong> ${details.hotelName || 'Not specified'}</p>
            <p><strong>Check-in Date:</strong> ${details.checkIn || 'Not specified'}</p>
            <p><strong>Check-out Date:</strong> ${details.checkOut || 'Not specified'}</p>
            <p><strong>Number of Guests:</strong> ${details.guests || 'Not specified'}</p>
            <p><strong>Room Type:</strong> ${details.roomType || 'Not specified'}</p>
            <p><strong>Total Price:</strong> $${details.totalPrice || 'Not specified'}</p>
      `;
    } else if (type === 'cruise' && details) {
      html += `
            <h3>Cruise Information:</h3>
            <p><strong>Preferred Time:</strong> ${details.preferredTime || 'Not specified'}</p>
            <p><strong>Message:</strong> ${details.message || 'None'}</p>
      `;
    }
    
    // Close the HTML structure
    html += `
          </div>
          
          <p>Best regards,<br>The JetSetGo Team</p>
        </div>
        <div style="padding: 20px; text-align: center; font-size: 12px; color: #666; background-color: #f1f1f1;">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; 2025 JetSetGo. All rights reserved.</p>
        </div>
      </div>
    `;
    
    const text = html.replace(/<[^>]*>?/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    try {
      // Always use a verified sender email with Resend
      const result = await resend.emails.send({
        from: 'JetSetGo <onboarding@resend.dev>',
        to: ['jetsetters721@gmail.com'], // Always send to the registered email
        subject: `JetSetGo ${type.toUpperCase()} Request Confirmation`,
        html,
        text
      });
      
      console.log('📧 Email sent successfully:', result);
      
      return res.status(200).json({
        success: true,
        message: 'Email sent successfully',
        data: result
      });
    } catch (sendError) {
      console.error('📧 Error sending email via Resend:', sendError);
      
      // Return a more specific error message based on the error type
      if (sendError.statusCode === 403 && sendError.message.includes('domain is not verified')) {
        return res.status(200).json({
          success: true,
          message: 'Callback data saved, but email sending limited due to domain verification',
          error: 'Domain not verified',
          note: 'The callback request was saved successfully, but email sending requires domain verification. Your data is safely stored.'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Callback data saved, but email could not be sent',
        error: sendError.message || 'An error occurred sending email',
        data: null
      });
    }
    
  } catch (error) {
    console.error('📧 Error in send-email endpoint:', error);
    
    // Still return a 200 response to prevent blocking the callback flow
    return res.status(200).json({
      success: true,
      message: 'Callback data saved, but email service encountered an error',
      error: error.message || 'An error occurred processing the email request',
      data: null
    });
  }
});

// Debug middleware for email routes
app.use('/api/email/*', (req, res, next) => {
  console.log(`🔍 Email route accessed: ${req.method} ${req.originalUrl}`);
  console.log('🔍 Request headers:', req.headers);
  console.log('🔍 Request body:', req.body);
  next();
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// For local development
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === undefined) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// For Vercel serverless deployment
export default app;
