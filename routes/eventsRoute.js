const express = require('express');
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent, getEventsByEmployeeName,getAllCurrentEvents} = require('../controllers/eventsController');
const router = express.Router();

router.post('/add', createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/events/employee/:employeeName', getEventsByEmployeeName);
router.get('/events/current', getAllCurrentEvents);

module.exports = router;