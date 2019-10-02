const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Connect to DB

mongoose.connect('mongodb://127.0.0.1:27017/authAPI', () =>
  console.log('Connected to DB')
);

// Middlewares

app.use(express.json());

// Import Routes

const authRoute = require('./routes/auth');

// Routes Middlewares

app.use('/api/user', authRoute);

app.listen(3000, console.log('Server up and running'));
