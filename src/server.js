const express = require('express');
const path = require('path');
const carRoutes = require('./routes/carRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/cars', carRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});