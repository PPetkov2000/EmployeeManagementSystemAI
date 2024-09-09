require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const { errorHandler } = require('./utils/error');
const { customMongoSanitize, customXss, customHpp } = require('./utils/security');
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
app.use(helmet());
// app.use(customMongoSanitize); // investigate error when logging in
app.use(customXss);
app.use(customHpp);
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: cookie_auth,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
cookie_auth && app.use(cookieParser());

app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

mongoose.connect(process.env.MONGODB_URI);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user-performance', userPerformanceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/vacations', vacationRoutes);
app.use('/api/seed', seedRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
