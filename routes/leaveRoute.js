// routes/leaveRoutes.js
const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

router.post('/apply', leaveController.applyLeave);

router.delete('/delete/:leaveId', leaveController.deleteLeave);

module.exports = router;
