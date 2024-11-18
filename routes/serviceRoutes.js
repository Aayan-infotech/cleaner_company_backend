const express = require('express');
const { getServices,createService} = require('../controllers/serviceController');

const router = express.Router();

router.get('/services', getServices);
router.post('/services', createService);
module.exports = router;
