const Item = require('../models/itemInventoryModel');
const InventoryCategory = require('../models/itemInventoryModel');
const Van = require('../models/vanModel');
const Role = require('../models/roleModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')

//to create item

const addItem = async (req, res, next) => {
  try {
    const role = await Role.find({ role: 'User' });

    const newItem = new Item(
      {
        itemName: req.body.itemName,
        partNumber: req.body.partNumber,
        categoryId: req.body.categoryId,
        maxQty: req.body.maxQty,
        minQty: req.body.minQty,
        vanId: req.body.vanId,
        inStock: req.body.inStock,
        amtOrder: req.body.amtOrder,
        forWarehouse: req.body.forWarehouse,
        addOrder: req.body.addOrder,
        cost: req.body.cost,
        price: req.body.price,
        comment: req.body.comment,
        shortDes: req.body.shortDes,
        partDes: req.body.partDes,
        // on test
           
      }
    )
    await newItem.save();
    return res.status(200).json("Item Registered Successfully")
  }
  catch (error) {
    return next(createError(500, "Something went wrong"))
  }
}

//get Allitems
const getAllItems = async (req, res, next) => {
  try {
    // const items = await Item.find();
    const items = await Item.find().populate('vanId');
    return next(createSuccess(200, "All Items", items));

  } catch (error) {
    return next(createError(500, "Internal Server Error!"))
  }
}

//get Item
const getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return next(createError(404, "Item Not Found"));
    }
    return next(createSuccess(200, "Single Item", item));
  } catch (error) {
    return next(createError(500, "Internal Server Error!"))
  }
}

//update user
const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const item = await Item.findByIdAndUpdate(id, req.body);
    const item = await Item.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) {
      return next(createError(404, "Item Not Found"));
    }
    return next(createSuccess(200, "Item Details Updated", item));
  } catch (error) {
    return next(createError(500, "Internal Server Error!"))
  }
}

//delete item
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return next(createError(404, "Item Not Found"));
    }
    return next(createSuccess(200, "Item Deleted", item));
  } catch (error) {
    return next(createError(500, "Internal Server Error!"))
  }
}

//  get all item for warehouse
const getAllItemForWarehouse = async (req, res, next) => {
  try {
    const items = await Item.find({ forWarehouse: true });
    return next(createSuccess(200, "Items for Warehouse", items));
  } catch (error) {
    console.error(error);
    return next(createError(500, "Internal Server Error!"));
  }
};

//  get all ietm for van
const getAllItemForVan = async (req, res, next) => {
  try {
    const items = await Item.find({ forVan: true });
    return next(createSuccess(200, "Items for Van", items));
  } catch (error) {
    return next(createError(500, "Internal Server Error!"));
  }
};

// get all items where vanName is available
const getAllItemsWithVanName = async (req, res, next) => {
  try {
    const items = await Item.find({ vanName: { $exists: true, $ne: "" } });
    next(createSuccess(200, "Items with vanName", items));
  } catch (error) {
    next(createError(500, "Internal Server Error!"));
  }
};

// transfer from warehouse to van
const transferItem = async (req, res, next) => {
  try {
    const { sourceItemId, destinationVanId, transferQuantity } = req.body;

    // Find the source item in the warehouse
    const sourceItem = await Item.findById(sourceItemId);
    if (!sourceItem || !sourceItem.forWarehouse) {
      return next(createError(404, "Source item not found in warehouse"));
    }

    // Check if there's enough quantity to transfer
    if (sourceItem.totalQuantity - sourceItem.minimumQuantity < transferQuantity) {
      return next(createError(400, "Not enough quantity in the warehouse to transfer"));
    }

    // Find the destination van by its ID
    const destinationVan = await Van.findById(destinationVanId);
    if (!destinationVan) {
      return next(createError(404, "Destination van not found"));
    }

    // Find the destination item (in the van) with the same itemName and categoryName
    let destinationItem = await Item.findOne({
      vanName: destinationVan.vanName,
      itemName: sourceItem.itemName,
      categoryName: sourceItem.categoryName,
      forWarehouse: false
    });

    // If destination item exists, update the quantity; otherwise, create a new one
    if (destinationItem) {
      destinationItem.totalQuantity += transferQuantity;
    } else {
      destinationItem = new Item({
        itemName: sourceItem.itemName,
        itemID: sourceItem.itemID,
        totalQuantity: transferQuantity,  // Set the quantity to the transferred amount
        minimumQuantity: 0,  // No minimum quantity for items in vans
        forWarehouse: false,
        categoryName: sourceItem.categoryName,
        vanName: destinationVan.vanName,  // Store the actual van name here
      });
    }

    // Transfer quantity from the source item
    sourceItem.totalQuantity -= transferQuantity;

    // Save changes
    await sourceItem.save();
    await destinationItem.save();

    // Respond with success
    return next(createSuccess(200, "Item successfully transferred", {
      sourceItem,
      destinationItem: {
        ...destinationItem._doc,
        vanName: destinationVan.vanName  // Respond with actual van name
      },
      transferredQuantity: transferQuantity
    }));

  } catch (error) {
    console.error(error);
    return next(createError(500, "Internal Server Error"));
  }
};

// transfer from one van to another
const transferItemToVan = async (req, res, next) => {
  try {
    const { sourceItemId, destinationVanId, transferQuantity } = req.body;

    // Find the source item in the source van
    const sourceItem = await Item.findById(sourceItemId);

    // Check if the item exists and if it's not in the warehouse
    if (!sourceItem || sourceItem.forWarehouse) {
      return next(createError(404, "Source item not found in the van or it's in the warehouse"));
    }

    // Check if there's enough quantity to transfer
    if (sourceItem.totalQuantity < transferQuantity) {
      return next(createError(400, "Not enough quantity in the van to transfer"));
    }

    // Find the destination van by its ID
    const destinationVan = await Van.findById(destinationVanId);
    if (!destinationVan) {
      return next(createError(404, "Destination van not found"));
    }

    // Find the destination item (in the destination van) with the same itemName and categoryName
    let destinationItem = await Item.findOne({
      vanName: destinationVan.vanName,
      itemName: sourceItem.itemName,
      categoryName: sourceItem.categoryName,
      forWarehouse: false // Make sure we're checking for an item in the van, not the warehouse
    });

    // If destination item exists, update the quantity; otherwise, create a new one
    if (destinationItem) {
      destinationItem.totalQuantity += transferQuantity;
    } else {
      destinationItem = new Item({
        itemName: sourceItem.itemName,
        itemID: sourceItem.itemID,
        totalQuantity: transferQuantity,  // Set the quantity to the transferred amount
        minimumQuantity: 0,  // No minimum quantity for items in vans
        forWarehouse: false,  // Item is in the van
        categoryName: sourceItem.categoryName,
        vanName: destinationVan.vanName,  // Store the actual van name here
      });
    }

    // Transfer quantity from the source item
    sourceItem.totalQuantity -= transferQuantity;

    // Save changes
    await sourceItem.save();
    await destinationItem.save();

    // Respond with success
    return next(createSuccess(200, "Item successfully transferred from van to van", {
      sourceItem,
      destinationItem: {
        ...destinationItem._doc,
        vanName: destinationVan.vanName  // Respond with actual van name
      },
      transferredQuantity: transferQuantity
    }));

  } catch (error) {
    console.error(error);
    return next(createError(500, "Internal Server Error"));
  }
};

module.exports = { addItem, getAllItems, getItem, updateItem, deleteItem, getAllItemForWarehouse, getAllItemForVan, getAllItemsWithVanName, transferItem, transferItemToVan }