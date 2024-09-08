require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger');
const { cookie_auth } = require('./config');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const userPerformanceRoutes = require('./routes/userPerformanceRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const vacationRoutes = require('./routes/vacationRoutes');
const seedRoutes = require('./routes/seedRoutes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: cookie_auth
}));
app.use(express.json());
cookie_auth && app.use(cookieParser());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    user: req.user ? req.user._id : 'unauthenticated'
  });
  next();
});

mongoose.connect(process.env.MONGODB_URI);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-performance', userPerformanceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/seed', seedRoutes);

app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).send('An unexpected error occurred');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
