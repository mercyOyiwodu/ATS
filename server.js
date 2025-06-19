require('dotenv').config();
const express = require("express");
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();

// Connect to database
connectDB();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const protectedRoutes = require('./routes/protected');
app.use('/api/protected', protectedRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
