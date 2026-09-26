const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { authenticate, authorizeOrganizer } = require('../middleware/authMiddleware');

router.post('/', authenticate, registrationController.registerForEvent);
router.get('/my', authenticate, registrationController.getMyRegistrations);
router.get('/event/:eventId', authenticate, authorizeOrganizer, registrationController.getEventParticipants);
router.get('/check/:eventId', authenticate, registrationController.checkRegistration);
router.delete('/:id', authenticate, registrationController.cancelRegistration);

module.exports = router;
