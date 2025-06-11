const express = require('express');
const { createCategory, getAllCategories, deleteCategory, updateCategory,getCategoryById } = require('../controllers/categoryController');
const router = express.Router();

router.post('/createCategory', createCategory);
router.get('/getAllCategories', getAllCategories);
router.delete('/deleteCategory/:id', deleteCategory);
router.put('/updateCategory/:id', updateCategory);
router.get('/getCategoryById/:id', getCategoryById);

module.exports = router;
