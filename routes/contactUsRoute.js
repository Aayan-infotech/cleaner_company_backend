const express = require('express');
const contactController = require('../controllers/contactUsController');
const router = express.Router();

router.post('/add', contactController.createContact);
router.get('/', contactController.getAllContacts);
router.delete('/:id', contactController.deleteContact);

module.exports = router;