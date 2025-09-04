const express = require('express');
const itemInventoryTransferController = require('../controllers/itemInventoryTransferController')
const router = express.Router();

router.post('/transfer-item-to-van', itemInventoryTransferController.transferToVan);
router.get('/get-all-transfered-items', itemInventoryTransferController.getAllTransfers);
router.get('/get-transfer/:id', itemInventoryTransferController.getTransferById);
router.delete("/delete-transfer/:id", itemInventoryTransferController.deleteTransferById);

module.exports = router;