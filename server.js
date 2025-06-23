require('dotenv').config();
const express = require("express");
require('./config/database');
const userRoutes = require('./routes/user');
const jobRoutes =require('./routes/job')
const applicationRoutes = require('./routes/application')
const cors = require('cors')  
const port = process.env.PORT || 3000;
const morgan =require('morgan')
const multer = require('multer');
const app = express();

app.use(cors())
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', userRoutes);
app.use('/api/v1', jobRoutes);
app.use('/api/v1', applicationRoutes);
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ error: err.message });
//   }
//   res.status(500).json({ error: err.message });
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
