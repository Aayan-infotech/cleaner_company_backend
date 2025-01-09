const express = require('express');
const { getMaterials,createMaterial } = require('../controllers/materialController');

const router = express.Router();

router.get('/materials', getMaterials);
router.post('/materials', createMaterial);
module.exports = router;
