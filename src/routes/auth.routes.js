const express = require('express');

const authController = require('../controllers/auth.controller');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.post('/register', catchAsync(authController.register));
router.post('/login', catchAsync(authController.login));

module.exports = router;