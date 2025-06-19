require('dotenv').config();
const express = require("express");
require('./config/database');
const authRoutes = require('./routes/auth');
const port = process.env.PORT || 3000;

const app = express();


app.use(express.json());
app.use('/api/auth', authRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
