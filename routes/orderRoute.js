const express = require('express');
const orderController = require('../controllers/orderController')
const router = express.Router();


router.post('/requested-order/:itemId', orderController.createOrderRequest);
router.get('/get-all-requested-orders', orderController.getAllRequestedOrders);
router.put("/:orderId/approve-order", orderController.approveOrder);
router.put("/:orderId/reject-order", orderController.rejectOrder);



module.exports = router;
