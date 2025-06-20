require('dotenv').config();
const express = require("express");
require('./config/database');
const userRoutes = require('./routes/user');
const jobRoutes =require('./routes/job')
const port = process.env.PORT || 3000;

const app = express();


app.use(express.json());
app.use('/api/v1', userRoutes);
app.use('/api/v1', jobRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
