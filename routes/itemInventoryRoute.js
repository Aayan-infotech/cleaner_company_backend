const express = require('express');
const itemInventoryController = require('../controllers/itemInventoryController')
const router = express.Router();
const upload = require('../middleware/upload');


router.post('/add-item', upload.fields(
    [
        { name: 'Images', maxCount: 10 },
        { name: 'pdfs', maxCount: 5 },
        { name: 'videos', maxCount: 5 }
    ]
), itemInventoryController.addItem);

router.get('/get-all-items', itemInventoryController.getAllItems);
router.get('/get-all-items-with-pagination', itemInventoryController.getAllItemsWithPagination);
router.get('/get-item/:id', itemInventoryController.getItem);
router.put('/update-item/:id', upload.fields(
    [
        { name: 'Images', maxCount: 10 },
        { name: 'pdfs', maxCount: 5 },
        { name: 'videos', maxCount: 5 }
    ]
), itemInventoryController.updateItem);

router.delete('/delete-item/:id', itemInventoryController.deleteItem);
router.get('/get-all-warehouse-items', itemInventoryController.getAllItemForWarehouse);
router.get('/get-all-van-items', itemInventoryController.getAllItemForVan);
router.get('/get-all-van-name', itemInventoryController.getAllItemsWithVanName);
router.post('/transfer-item', itemInventoryController.transferItem);
router.post('/transfer-item-to-van', itemInventoryController.transferItemToVan);
router.get('/files/:filename', itemInventoryController.getFile);


module.exports = router;