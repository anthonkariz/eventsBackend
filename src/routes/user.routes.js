const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.get('/', authMiddleware, catchAsync(userController.getUsers));

module.exports = router;