
const Order = require ('../models/orderModel')
const Role = require('../models/roleModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')

  //order
  const orderItem = async (req, res, next) => {
    try {
      const role = await Role.find({ role: 'User' });
      const newOrder = new Order({
        orderQuantity: req.body.orderQuantity,
        itemInfo: ''
      })
      await newOrder.save();
      //return res.status(200).json("Order Placed Successfully")
      return next(createSuccess(200, "Order Placed Successfully"))
    }
    catch (error) {
      //return res.status(500).send("Something went wrong")
      return next(createError(500, "Something went wrong"))
    }
  }
module.exports = {
   orderItem
}