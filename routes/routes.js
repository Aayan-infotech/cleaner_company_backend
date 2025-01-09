// const express = require('express');
// const multer = require('multer');
// const fileController = require('../controllers/fileController');

// const router = express.Router();

// const storage = multer.memoryStorage();
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only images are allowed'), false);
//     }
// };
// const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// router.post('/upload', upload.single('file'), fileController.uploadFile);
// router.get('/', fileController.getAllFiles);
// router.get('/:id', fileController.getFileById);
// module.exports = router;
