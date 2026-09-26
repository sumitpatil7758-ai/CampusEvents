const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, authorizeOrganizer } = require('../middleware/authMiddleware');

router.get('/stats/overview', eventController.getStats);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authenticate, authorizeOrganizer, eventController.createEvent);
router.put('/:id', authenticate, authorizeOrganizer, eventController.updateEvent);
router.delete('/:id', authenticate, authorizeOrganizer, eventController.deleteEvent);

module.exports = router;
