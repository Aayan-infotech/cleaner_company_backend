
const express = require('express');
const router = express.Router();
const dryCleaningController = require('../controllers/dryCleaningController');

router.get('/', dryCleaningController.getDryCleanings);
router.post('/', dryCleaningController.createDryCleaning);

module.exports = router;
