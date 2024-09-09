require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./utils/logger');
const { cookie_auth } = require('./config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const userPerformanceRoutes = require('./routes/userPerformanceRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const vacationRoutes = require('./routes/vacationRoutes');
const seedRoutes = require('./routes/seedRoutes');

const app = express();

morgan.token('user', (req) => req.user ? req.user._id : 'unauthenticated');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :user', {
  stream: {
    // write: (message) => logger.http(message.trim())
    write: (message) => {
      const logObject = {
        method: message.split(' ')[0],
        url: message.split(' ')[1],
        status: message.split(' ')[2],
        responseTime: message.split(' ')[3],
        user: message.split(' ')[4]
      }
      logger.info(JSON.stringify(logObject));
    }
  }
}));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: cookie_auth
}));
app.use(express.json());
cookie_auth && app.use(cookieParser());

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
