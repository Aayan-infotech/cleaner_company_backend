const express = require('express');
const marketingCategoriesController = require('../controllers/marketingCategoriesController');
const router = express.Router();

router.post('/create-marketing-category', marketingCategoriesController.createMarketingCategory);
router.get('/get-all-marketing-categories', marketingCategoriesController.getAllMarketingCategories);
router.get('/get-all-marketingCategories', marketingCategoriesController.getAllMarketingCategoriesNoPagination);
router.get('/get-marketing-category/:id', marketingCategoriesController.getMarketingCategoryById);
router.put('/update-marketing-category/:id', marketingCategoriesController.updateMarketingCategoryDetailsById);
router.delete('/delete-marketing-category/:id', marketingCategoriesController.deleteMarketingCategoryById);

module.exports = router; 