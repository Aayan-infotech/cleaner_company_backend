const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController2');
const upload = require('../middleware/upload');

router.post('/add-template', upload.array('logo'), templateController.createTemplate);
router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplateById);
router.put('/update/:id', upload.array('logo'), templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

router.post('/:templateId/share-to-clients', templateController.shareTemplateToClients);
router.post('/:templateId/share-to-groups', templateController.shareTemplateToGroups);



module.exports = router;
