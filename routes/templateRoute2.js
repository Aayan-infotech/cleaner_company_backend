const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController2');

router.post('/add', templateController.createTemplate);
router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplateById);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;
