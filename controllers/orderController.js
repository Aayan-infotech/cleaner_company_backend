const Order = require("../models/orderModel");
const Role = require("../models/roleModel");
const Item = require("../models/itemInventoryModel");
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");

// Create Order Request (Company side)
exports.createOrderRequest = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { requestedQuantity } = req.body;

    // Validate required fields
    if (!itemId) {
      return next(createError(400, "Item ID is required"));
    }
    if (!requestedQuantity || requestedQuantity <= 0) {
      return next(
        createError(400, "Requested quantity must be greater than 0")
      );
    }

    // Check if Item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return next(createError(404, "Item not found"));
    }

    // Create order request
    const newOrder = new Order({
      itemId,
      requestedQuantity,
      status: "pending", // default
    });

    await newOrder.save();

    return next(
      createSuccess(201, "Order request created successfully", newOrder)
    );
  } catch (error) {
    console.error("Error creating order request:", error);
    return next(
      createError(500, "Something went wrong while creating order request")
    );
  }
};

// Get All Requested Orders
exports.getAllRequestedOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("itemId", "itemName availableQuantity")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return next(createSuccess(200, "No orders found", []));
    }

    return next(createSuccess(200, "Orders fetched successfully", orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return next(createError(500, "Something went wrong while fetching orders"));
  }
};

// Approve Order
exports.approveOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { approvedQuantity } = req.body;

    // Validate approvedQuantity
    if (!approvedQuantity || approvedQuantity <= 0) {
      return next(createError(400, "Approved quantity must be greater than 0"));
    }

    // Find order
    const order = await Order.findById(orderId).populate(
      "itemId",
      "itemName availableQuantity"
    );
    if (!order) {
      return next(createError(404, "Order not found"));
    }

    // Check status
    if (order.status !== "pending") {
      return next(createError(400, `Order is already ${order.status}`));
    }

    // Ensure approvedQuantity is not more than requested
    if (approvedQuantity > order.requestedQuantity) {
      return next(
        createError(
          400,
          `Approved quantity (${approvedQuantity}) cannot be greater than requested quantity (${order.requestedQuantity})`
        )
      );
    }

    // Update order
    order.approvedQuantity = approvedQuantity;
    order.status = "approved";
    await order.save();

    const updatedItem = await Item.findByIdAndUpdate(
      order.itemId,                     
      { $inc: { maxQty: approvedQuantity } }, 
      { new: true }                      
    );

    if (!updatedItem) {
      return next(createError(404, "Related item not found"));
    }

    return next(createSuccess(200, "Order approved successfully", { order, updatedItem }));

  } catch (error) {
    console.error("Error approving order:", error);
    return next(createError(500, "Something went wrong while approving order"));
  }
};

// Reject Order
exports.rejectOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { remarks } = req.body;

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return next(createError(404, "Order not found"));
    }

    // If already approved or rejected, no need to reject again
    if (order.status !== "pending") {
      return next(createError(400, `Order is already ${order.status}`));
    }

    // Update status
    order.status = "rejected";
    if (remarks) order.remarks = remarks;

    await order.save();

    return next(createSuccess(200, "Order rejected successfully", order));
  } catch (error) {
    console.error("Error rejecting order:", error);
    return next(
      createError(500, "Something went wrong while rejecting the order")
    );
  }
};
