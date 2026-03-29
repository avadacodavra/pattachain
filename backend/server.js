require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes safely
const landRoutes = require('./routes/landRoutes.js');
const transferRoutes = require('./routes/transferRoutes.js');
const ipfsRoutes = require('./routes/ipfsRoutes.js');

const app = express();

// Connect to MongoDB
connectDB();




// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api/land', landRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/ipfs', ipfsRoutes);


// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PattaChain Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});