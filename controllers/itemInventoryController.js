const Item = require('../models/itemInventoryModel');
const InventoryCategory = require('../models/itemInventoryModel');
const Van = require('../models/vanModel');
const Role = require('../models/roleModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');
const path = require('path');
const fs = require('fs');

//to create item
const addItem = async (req, res, next) => {
  try {
    const role = await Role.find({ role: 'User' });

    const {
      itemName, partNumber, categoryId, maxQty, minQty, vanId, inStock, amtOrder,
      forWarehouse, addOrder, cost, price, comment, shortDes, partDes
    } = req.body;

    // Handle Images
    let Images = [];
    if (req.files && req.files.Images) {
      Images = req.files.Images.map(file => {
        const filename = Date.now() + path.extname(file.originalname);
        const filepath = path.join(__dirname, '../uploads', filename);

        // Save file to the filesystem
        fs.writeFileSync(filepath, file.buffer);

        return {
          filename,
          contentType: file.mimetype
        };
      });
    }

    // Handle PDFs
    let pdfs = [];
    if (req.files && req.files.pdfs) {
      pdfs = req.files.pdfs.map(file => {
        const filename = Date.now() + path.extname(file.originalname);
        const filepath = path.join(__dirname, '../uploads', filename);

        // Save file to the filesystem
        fs.writeFileSync(filepath, file.buffer);

        return {
          filename,
          contentType: file.mimetype
        };
      });
    }

    // Handle Videos
    let videos = [];
    if (req.files && req.files.videos) {
      videos = req.files.videos.map(file => {
        const filename = Date.now() + path.extname(file.originalname);
        const filepath = path.join(__dirname, '../uploads', filename);

        // Save file to the filesystem
        fs.writeFileSync(filepath, file.buffer);

        return {
          filename,
          contentType: file.mimetype
        };
      });
    }

    const newItem = new Item({
      itemName, partNumber, categoryId, maxQty, minQty, vanId, inStock,
      amtOrder, forWarehouse, addOrder, cost, price, comment, shortDes,
      partDes, Images, pdfs, videos
    });

    await newItem.save();
    return next(createSuccess(200, "Item Addedd Successfully", newItem))
  }
  catch (error) {
    console.error("Error in addItem:", error);
    return next(createError(500, "Something went wrong"));
  }
}

//get Allitems
const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find().populate('vanId').populate('categoryId');

    if (!items || items.length === 0) {
      return res.status(200).json(createSuccess(200, "No items found", []));
    }

    const itemsWithURLs = items.map((item) => {
      const category = item.categoryId
        ? {
          _id: item.categoryId._id,
          categoryName: item.categoryId.categoryName,
          createdAt: item.categoryId.createdAt,
          updatedAt: item.categoryId.updatedAt,
        }
        : null;

      return {
        ...item.toObject(),
        categoryId: category,

        Images: item.Images.map((image) => ({
          ...image.toObject(),
          url: `${req.protocol}://${req.get('host')}/uploads/${image.filename}`,
        })),
        
        pdfs: item.pdfs.map((pdf) => ({
          ...pdf.toObject(),
          url: `${req.protocol}://${req.get('host')}/uploads/${pdf.filename}`,
        })),
        
        videos: item.videos.map((video) => ({
          ...video.toObject(),
          url: `${req.protocol}://${req.get('host')}/uploads/${video.filename}`,
        })),
      };
    });

    return res.status(200).json(createSuccess(200, "All Items", itemsWithURLs));
  } catch (error) {
    console.error(error);
    return next(createError(500, "Internal Server Error!"));
  }
};

//get Item
const getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return next(createError(404, "Item Not Found"));
    }

    const itemWithURLs = {
      ...item.toObject(),
      Images: item.Images.map((image) => ({
        ...image.toObject(),
        url: `${req.protocol}://${req.get("host")}/uploads/${image.filename}`,
      })),
      pdfs: item.pdfs.map((pdf) => ({
        ...pdf.toObject(),
        url: `${req.protocol}://${req.get("host")}/uploads/${pdf.filename}`,
      })),
      videos: item.videos.map((video) => ({
        ...video.toObject(),
        url: `${req.protocol}://${req.get("host")}/uploads/${video.filename}`,
      })),
    };

    return next(createSuccess(200, "Single Item", itemWithURLs));
  } catch (error) {
    return next(createError(500, "Internal Server Error!"))
  }
}

//update item
const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the item by ID to ensure it exists
    const item = await Item.findById(id);
    if (!item) {
      return next(createError(404, "Item Not Found"));
    }

    // Update the item with new data
    const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    
    // Format the updated item response
    const updatedItemWithURLs = {
      ...updatedItem.toObject(),
      Images: updatedItem.Images.map((image) => ({
        ...image.toObject(),
        url: `${req.protocol}://${req.get("host")}/uploads/${image.filename}`,
      })),
      pdfs: updatedItem.pdfs.map((pdf) => ({
        ...pdf.toObject(),
        url: `${req.protocol}://${req.get("host")}/uploads/${pdf.filename}`,
      })),
      videos: updatedItem.videos.map((video) => ({
        ...video.toObject(),
        url: `${req.protocol}://${req.get("host")}/uploads/${video.filename}`,
      })),
    };

    return res
      .status(200)
      .json(createSuccess(200, "Item Details Updated", updatedItemWithURLs));
  } catch (error) {
    console.error(error);
    return next(createError(500, "Internal Server Error!"));
  }
};

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

//  get all item for warehouse whare warehouse is true
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

// file function
const getFile = (req, res) => {
  const filepath = path.join(__dirname, '../uploads', req.params.filename);

  fs.readFile(filepath, (err, data) => {
    if (err) {
      return res.status(404).json({ message: 'The requested file could not be found.' });
    }

    const ext = path.extname(req.params.filename).toLowerCase();
    let contentType = 'application/octet-stream';

    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.mp4') {
      contentType = 'video/mp4';
    } else if (ext === '.mkv') {
      contentType = 'video/x-matroska';
    } else if (ext === '.webm') {
      contentType = 'video/webm';
    }

    res.setHeader('Content-Type', contentType);
    res.send(data);
  });
};


module.exports = { addItem, getAllItems, getItem, updateItem, deleteItem, getAllItemForWarehouse, getAllItemForVan, getAllItemsWithVanName, transferItem, transferItemToVan, getFile }