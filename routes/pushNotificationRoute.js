const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/pushNotificationController');

router.post('/send-notification', notificationController.sendPushNotification);

router.get('/get-notification/:employeeId', notificationController.getNotificationsByEmployeeId);

router.delete("/delete/:id", notificationController.deleteNotificationById);

module.exports = router;
