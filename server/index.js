require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const botRoutes = require('./routes/bots');
const callRoutes = require('./routes/calls');
const webhookRoutes = require('./routes/webhooks');

const app = express();

// Connect to Database
connectDB();


app.use((req, res, next) => {
  console.log(`Incoming Request: [${req.method}] ${req.url}`);
  next();
});

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    "http://localhost:5173"
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'VoxAI API is running',
    timestamp: new Date().toISOString()
  });
});

// Debug Route to check if server is reachable
app.get('/api/debug', (req, res) => {
  res.json({ 
    message: 'Server is reachable!',
    url: req.url,
    method: req.method
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use(errorHandler);
// ---------------------------------------------------------
// 🟢 CORRECTED STARTUP LOGIC
// Only listen to the port if we are NOT in production (Vercel)
// Vercel handles the server startup automatically via the export.
// ---------------------------------------------------------
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 VoxAI API running locally on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export the app for Vercel Serverless
module.exports = app;