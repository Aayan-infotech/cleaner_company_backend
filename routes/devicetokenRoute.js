
const express = require('express');
const { createDeviceToken, getAllDeviceTokens } = require('../controllers/devicetokenController');

const router = express.Router();

router.post('/device-token', createDeviceToken);

router.get('/getAllTokens', getAllDeviceTokens);

module.exports = router;
