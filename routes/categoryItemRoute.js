const express = require('express');
const categoryItemController = require('../controllers/categoryItemController');
const router = express.Router();
const upload = require('../middleware/upload');

// Define routes here
router.post('/:categoryId/item', upload.fields([{ name: 'images', maxCount: 9 }, { name: 'pdfs', maxCount: 10 }, { name: 'videos', maxCount: 10 }]), categoryItemController.createItem );
router.get('/:categoryId/getAll', categoryItemController.getAllItems);
router.get('/:categoryId/get/:id', categoryItemController.getItemById); 
router.put('/:categoryId/update/:id', upload.fields([{ name: 'images', maxCount: 9 }, { name: 'pdfs', maxCount: 10 }, { name: 'videos', maxCount: 10 }]), categoryItemController.updateItemById);
router.delete('/:categoryId/delete/:id', categoryItemController.deleteItemById);

router.get('/files/:filename', categoryItemController.getFile);

module.exports = router;