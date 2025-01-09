const express = require('express');
const {orderItem} = require('../controllers/orderController')
const router = express.Router();

router.post('/order',orderItem );

module.exports = router;