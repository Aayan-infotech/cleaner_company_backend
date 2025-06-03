const express = require('express');
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent, getEventsByEmployeeName,getAllCurrentEvents,getAllPastEvents,getJobIdsWhoseEventTypeIsJob} = require('../controllers/eventsController');
const router = express.Router();

router.post('/add', createEvent);
router.get('/jobId', getJobIdsWhoseEventTypeIsJob);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/events/employee/:employeeName', getEventsByEmployeeName);
router.get('/events/current', getAllCurrentEvents);
router.get('/events/past', getAllPastEvents);
 // Assuming this function is defined in the controller
module.exports = router;