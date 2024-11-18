const express = require('express');
const router = express.Router();
const methodController = require('../controllers/methodController');

router.get('/', methodController.getMethods);
router.post('/', methodController.createMethod);

module.exports = router;
