const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/pushNotificationController');

router.post('/send-notification', notificationController.sendPushNotification);

module.exports = router;
