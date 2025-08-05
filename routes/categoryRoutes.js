const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

router.post('/createCategory', categoryController.createCategory);
router.get('/getAllCategories', categoryController.getAllCategories);
router.delete('/deleteCategory/:id', categoryController.deleteCategory);
router.put('/updateCategory/:id', categoryController.updateCategory);
router.get('/getCategoryById/:id', categoryController.getCategoryById);
router.get('/getAll', categoryController.getAllCategories2); // This route is for testing purposes

module.exports = router;
