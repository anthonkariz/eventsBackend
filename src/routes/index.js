const express = require('express');

const authRoutes = require('./auth.routes');
const eventsRoutes = require('./events.routes');
const userRoutes = require('./user.routes');
const userController = require('../controllers/user.controller');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.get('/', catchAsync(userController.getEvents));
router.get('/health', userController.getHealth);
router.use('/auth', authRoutes);
router.use('/events', eventsRoutes);
router.use('/users', userRoutes);

module.exports = router;