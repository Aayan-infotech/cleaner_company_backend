const express = require('express');
const InventoryCategoryController = require('../controllers/inventoryCategoryController')
const router = express.Router();

router.post('/addInventoryCategory', InventoryCategoryController.addInventoryCategory);
router.get('/', InventoryCategoryController.getAllInventoryCategories); 
router.get('/:id', InventoryCategoryController.getInventoryCategoryById);
router.put('/:id', InventoryCategoryController.updateInventoryCategoryById);
router.delete('/:id', InventoryCategoryController.deleteInventoryCategoryById); 


module.exports = router;