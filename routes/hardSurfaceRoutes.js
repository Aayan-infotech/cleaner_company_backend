const express = require('express');
const router = express.Router();
const hardSurfaceController = require('../controllers/hardSurfaceController');

router.get('/', hardSurfaceController.getHardSurfaces);
router.post('/', hardSurfaceController.createHardSurface);

module.exports = router;
