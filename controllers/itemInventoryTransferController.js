const Item = require("../models/itemInventoryModel");
const VanStock = require("../models/itemInventoryTransferModel");
const Van = require("../models/vanModel");
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");
const mongoose = require("mongoose");

// Transfer Item to Van
exports.transferToVan = async (req, res, next) => {
  try {
    const { itemId, vanId, quantity } = req.body;

    if (!itemId) {
      return next(createError(400, "itemId is required"));
    }
    if (!vanId) {
      return next(createError(400, "vanId is required"));
    }
    if (quantity === undefined || quantity === null) {
      return next(createError(400, "quantity is required"));
    }
    if (quantity <= 0) {
      return next(createError(400, "Transfer quantity must be greater than 0"));
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return next(createError(400, "Invalid itemId format"));
    }
    if (!mongoose.Types.ObjectId.isValid(vanId)) {
      return next(createError(400, "Invalid vanId format"));
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return next(createError(404, "Item not found"));
    }

    const vanExist = await Van.findById(vanId);
    if (!vanExist) {
      return next(createError(404, "Van not found"));
    }

    if (item.inStock < quantity) {
      return next(createError(400, "Not enough stock in warehouse"));
    }

    if (item.inStock - quantity < item.minQty) {
      return next(
        createError(
          400,
          `Transfer not allowed. Warehouse must always keep at least ${item.minQty} items.`
        )
      );
    }

    item.inStock -= quantity;
    await item.save();

    let vanStock = await VanStock.findOne({ vanId });
    if (!vanStock) {
      vanStock = new VanStock({ vanId, items: [] });
    }

    const existingItem = vanStock.items.find(
      (i) => i.itemId.toString() === itemId
    );

    if (existingItem) {
      existingItem.qty += quantity;
    } else {
      vanStock.items.push({ itemId, qty: quantity });
    }

    await vanStock.save();

    return next(
      createSuccess(200, "Transfer successful", {
        warehouseRemaining: item.inStock,
        vanStock: vanStock.items,
      })
    );
  } catch (error) {
    console.error("Error transferring item to van:", error);
    return next(createError(500, "Internal Server Error!"));
  }
};

// Get all transfers with populated van and item details
exports.getAllTransfers = async (req, res, next) => {
  try {
    const transfers = await VanStock.find()
      .populate("vanId", "vanName createdAt updatedAt")
      .populate(
        "items.itemId",
        "itemName partNumber maxQty minQty inStock cost price"
      )
      .sort({ createdAt: -1 });

    return next(
      createSuccess(200, "Transfers fetched successfully", transfers)
    );
  } catch (error) {
    console.error("Error fetching transfers:", error);
    return next(createError(500, "Internal Server Error!"));
  }
};

// Get Transfer By ID
exports.getTransferById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid transferId format"));
    }

    const transfer = await VanStock.findById(id)
      .populate("vanId", "vanName createdAt updatedAt")
      .populate(
        "items.itemId",
        "itemName partNumber maxQty minQty inStock cost price"
      );

    if (!transfer) {
      return next(createError(404, "Transfer record not found"));
    }

    return next(createSuccess(200, "Transfer fetched successfully", transfer));
  } catch (error) {
    console.error("Error fetching transfer by ID:", error);
    return next(createError(500, "Internal Server Error!"));
  }
};

// Delete Transfer By ID
exports.deleteTransferById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid transferId format"));
    }

    const transfer = await VanStock.findByIdAndDelete(id);

    if (!transfer) {
      return next(createError(404, "Transfer record not found"));
    }

    return next(createSuccess(200, "Transfer deleted successfully", transfer));

  } catch (error) {
    console.error("Error deleting transfer:", error);
    return next(createError(500, "Internal Server Error!"));
  }
};
