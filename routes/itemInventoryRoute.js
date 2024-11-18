const express = require('express');
const { addItem, getAllItems, getItem, updateItem, deleteItem, getAllItemForWarehouse, getAllItemForVan, getAllItemsWithVanName, transferItem, transferItemToVan } = require('../controllers/itemInventoryController')
const router = express.Router();


router.post('/addItem',addItem );
router.get('/getAllItems',getAllItems );
router.get('/get/:id',getItem );
router.put('/update/:id', updateItem);
router.delete('/delete/:id',deleteItem);

router.get('/allWarehouseItems', getAllItemForWarehouse);
router.get('/allVanItems', getAllItemForVan); 
router.get('/allVanName', getAllItemsWithVanName); 

router.post('/transferItem', transferItem); 
router.post('/transferItemToVan', transferItemToVan);



module.exports = router;