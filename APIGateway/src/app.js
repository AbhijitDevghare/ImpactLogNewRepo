const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
  origin: true,
  credentials: true,
}));

// Logger
app.use(morgan('dev'));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}));

app.set('trust proxy', 1);

// Rate Limiter – 100 requests per IP per minute
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests. Try again later."
});
app.use(limiter);

// Import all routes
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const engagementRoutes = require('./routes/engagement');
const eventRoutes = require('./routes/event');
const notificationRoutes = require('./routes/notification');
const registrationRoutes = require('./routes/registration');
const rewardsBadgesRoutes  = require('./routes/rewards-badges');
const userPostRoutes = require('./routes/user-post');
const verificationRoutes = require('./routes/verification');

// Attach service routes
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/engagement', engagementRoutes);
app.use('/events', eventRoutes);
app.use('/notifications', notificationRoutes);
app.use('/registration', registrationRoutes);
app.use('/rewards-badges', rewardsBadgesRoutes);
app.use('/user-post', userPostRoutes);
app.use('/verification', verificationRoutes);

app.get('/ping', (req, res) => res.send("PONG"));

const errorMiddleware = require('./middleware/error.middleware');
app.use(errorMiddleware);

module.exports = app;
