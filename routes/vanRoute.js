const express = require('express');
const vanController = require('../controllers/vanController');
const router = express.Router();

router.post('/addNewVan', vanController.createVan);
router.get('/', vanController.getAllVans);
router.get('/:id', vanController.getVanById);

module.exports = router;