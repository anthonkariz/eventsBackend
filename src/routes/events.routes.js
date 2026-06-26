const express = require('express');
const multer = require('multer');

const authMiddleware = require('../middlewares/auth.middleware');
const eventsController = require('../controllers/events.controller');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();
const upload = multer();

router.get('/', catchAsync(eventsController.getEvents));
router.get('/:id', catchAsync(eventsController.getEventById));

router.post('/', authMiddleware, upload.none(), catchAsync(eventsController.createEvent));
router.put('/:id', authMiddleware, catchAsync(eventsController.updateEvent));
router.delete('/:id', authMiddleware, catchAsync(eventsController.deleteEvent));

module.exports = router;
