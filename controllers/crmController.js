const CRM = require("../models/crmModel");
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");
const path = require('path');
const fs = require('fs');

// Default Profile Picture
const defaultImage = {
  filename: 'default-image.jpg',
  contentType: 'image/png'
};

// Create new CRM entry
exports.createCRM = async (req, res, next) => {
  try {
    const { name, address, email, phones } = req.body;

    // Parse phones if it's a JSON string
    let parsedPhones = [];
    if (phones) {
      parsedPhones = typeof phones === "string" ? JSON.parse(phones) : phones;
    }

    if (!name || !address || !email) {
      return next(createError(400, "Name, address, and email are required."));
    }

    const existing = await CRM.findOne({ email });
    if (existing) {
      return next(createError(400, "Email already exists."));
    }

    // Handle image upload or fallback to default
    let images = [];
    if (!req.files || req.files.length === 0) {
      images = [defaultImage]; // default image
    } else {
      images = req.files.map((file) => {
        const filename = Date.now() + path.extname(file.originalname);
        const filepath = path.join(__dirname, "../uploads", filename);
        fs.writeFileSync(filepath, file.buffer);

        return {
          filename,
          contentType: file.mimetype
        };
      });
    }

    const crm = new CRM({
      name,
      address,
      email,
      phones: parsedPhones,
      images
    });

    await crm.save();
    return next(createSuccess(200, "CRM entry created successfully", crm));
  } catch (error) {
    console.error("create CRM", error);    
    return next(createError(500, "Internal Server Error!"));
  }
};

// Get all CRM entries
exports.getAllCRM = async (req, res, next) => {
  try {
    const crms = await CRM.find().sort({ createdAt: -1 });

    const crmWithImageURLs = crms.map(crm => {
      const imagesWithURLs = crm.images.map(image => {
        return {
          ...image._doc,
          url: `${req.protocol}://${req.get('host')}/uploads/${image.filename}`
        };
      });

      return {
        ...crm._doc,
        images: imagesWithURLs
      };
    });

    return next(createSuccess(200, "All CRM entries fetched successfully", {
      totalCount: crms.length,
      crms: crmWithImageURLs
    }));

  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};

// Get CRM by ID
exports.getCRMById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const crm = await CRM.findById(id);
    if (!crm) {
      return next(createError(404, "CRM entry not found"));
    }

    // Add image URLs to the images field
    const imagesWithURLs = crm.images.map(image => {
      return {
        ...image._doc,
        url: `${req.protocol}://${req.get('host')}/uploads/${image.filename}`
      };
    });

    // Return the CRM entry with image URLs
    return next(createSuccess(200, "CRM entry fetched successfully", {
      ...crm._doc,
      images: imagesWithURLs
    }));
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};

// Update CRM by ID
exports.updateCRMById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, email, phones } = req.body;

    let crm = await CRM.findById(id);
    if (!crm) {
      return next(createError(404, "CRM entry not found"));
    }

    if (name) crm.name = name;
    if (address) crm.address = address;
    if (email) crm.email = email;

    let parsedPhones = [];
    if (phones) {
      if (typeof phones === "string") {
        parsedPhones = JSON.parse(phones); 
      } else if (Array.isArray(phones)) {
        parsedPhones = phones; 
      } else if (typeof phones === "object") {
        parsedPhones = [phones];
      } else {
        return next(createError(400, "Phones data should be an array or object"));
      }

      crm.phones = parsedPhones.map(phone => ({
        type: phone.type, 
        number: phone.number
      }));
    } else {
      crm.phones = [];  
    }

    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => {
        const filename = Date.now() + path.extname(file.originalname);
        const filepath = path.join(__dirname, '../uploads', filename);

        fs.writeFileSync(filepath, file.buffer);

        return {
          filename,
          contentType: file.mimetype
        };
      });

      crm.images = images; 
    }

    await crm.save();
    return res.status(200).json({
      success: true,
      message: "CRM entry updated successfully",
      data: crm
    });
  } catch (error) {
    console.error(error); 
    return next(createError(500, "Something went wrong"));
  }
};

// Delete CRM by ID
exports.deleteCRMById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await CRM.findByIdAndDelete(id);
    if (!deleted) {
      return next(createError(404, "CRM entry not found"));
    }

    return next(createSuccess(200, "CRM entry deleted successfully", deleted));
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};
