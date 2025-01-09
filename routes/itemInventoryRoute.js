const express = require('express');
const { addItem, getAllItems, getItem, updateItem, deleteItem, getAllItemForWarehouse, getAllItemForVan, getAllItemsWithVanName, transferItem, transferItemToVan, getFile } = require('../controllers/itemInventoryController')
const router = express.Router();
const upload = require('../middleware/upload');


router.post('/addItem', upload.fields(
    [
        { name: 'Images', maxCount: 10 },
        { name: 'pdfs', maxCount: 5 },
        { name: 'videos', maxCount: 5 }
    ]
), addItem);
router.get('/getAllItems', getAllItems);
router.get('/get/:id', getItem);
router.put('/update/:id', upload.fields(
    [
        { name: 'Images', maxCount: 10 },
        { name: 'pdfs', maxCount: 5 },
        { name: 'videos', maxCount: 5 }
    ]
), updateItem);

router.delete('/delete/:id', deleteItem);
router.get('/allWarehouseItems', getAllItemForWarehouse);

router.get('/allVanItems', getAllItemForVan);

router.get('/allVanName', getAllItemsWithVanName);


router.post('/transferItem', transferItem);
router.post('/transferItemToVan', transferItemToVan);

router.get('/files/:filename', getFile);



module.exports = router;