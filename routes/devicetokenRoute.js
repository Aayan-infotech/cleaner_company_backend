
const express = require('express');
const { createDeviceToken, getAllDeviceTokens,getTokenByEmployeeId } = require('../controllers/devicetokenController');

const router = express.Router();

router.post('/device-token', createDeviceToken);

router.get('/getAllTokens', getAllDeviceTokens);
router.get('/getToken/:EmployeeId', getTokenByEmployeeId);
module.exports = router;
