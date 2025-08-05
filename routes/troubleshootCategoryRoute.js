const express = require('express');
const { addCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategory } = require('../controllers/troubleshootCategoryController')
const router = express.Router();

router.post('/addTroubleCategory', addCategory);
router.get('/get-all-trouble-categories', getAllCategories); 
router.get('/:categoryId', getCategoryById);
router.put('/:categoryId', updateCategoryById);
router.delete('/:categoryId', deleteCategory); 


module.exports = router;