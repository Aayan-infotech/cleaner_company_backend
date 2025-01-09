const express = require('express');
const timeRecordController = require('../controllers/timeTrackController');
const router = express.Router();

router.post('/time', timeRecordController.createTimeRecord);
router.put('/:timeRecordId', timeRecordController.updateTimeRecord);
router.get('/:date', timeRecordController.getAllEmployeeTimeLogs);
router.get('/time-logs/:employeeId/:date', timeRecordController.getAllTimeLogs);
router.delete('/:employeeId/:date', timeRecordController.deleteEmployeeLogsByDate);

module.exports = router;
