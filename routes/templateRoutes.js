const template = require('../controllers/templateController');
const express = require('express');
const router = express.Router();
const { createTemplate,getAllTemplates,deleteTemplate,getTemplateById,viewTemplate } = template;

router.post('/createTemplate', createTemplate);
router.get('/view/:id', viewTemplate); 
router.get('/getAllTemplates', getAllTemplates);
router.delete('/deleteTemplate/:id', deleteTemplate);
// router.put('/updateTemplate/:id', updateTemplate);
router.get('/getTemplateById/:id', getTemplateById);

module.exports = router;