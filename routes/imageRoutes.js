// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../middleware/upload');

router.post('/upload', upload.array('images', 3), imageController.uploadProduct); // Maximum of 10 files
router.get('/products', imageController.getProducts);
router.get('/images/:filename', imageController.getImage); // Serve image by filename

module.exports = router;
