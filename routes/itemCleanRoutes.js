const express = require('express');
const router = express.Router();
const itemCleanController = require('../controllers/itemCleanController');

router.get('/', itemCleanController.getItemCleans);
router.post('/', itemCleanController.createItemClean);

module.exports = router;
