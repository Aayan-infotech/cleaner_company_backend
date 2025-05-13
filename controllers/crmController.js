const CRM = require("../models/crmModel");
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");

// Create new CRM entry
exports.createCRM = async (req, res, next) => {
  try {
    const { name, address, email, phones } = req.body;

    if (!name || !address || !email) {
      return next(createError(400, "Name, address, and email are required."));
    }

    const existing = await CRM.findOne({ email });
    if (existing) {
      return next(createError(400, "Email already exists."));
    }

    const crm = new CRM({ name, address, email, phones });
    await crm.save();

    return next(createSuccess(200, "CRM entry created successfully", crm));
  } catch (error) {
    return next(createError(500, "Internal Server Error!"));
  }
};

// Get all CRM entries
exports.getAllCRM = async (req, res, next) => {
  try {
    const crms = await CRM.find().sort({ createdAt: -1 });

    return next(
        createSuccess(200, "All CRM entries fetched successfully", {
          totalCount: crms.length,
          crms: crms
        })
      );
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

    return next(createSuccess(200, "CRM entry fetched successfully", crm));
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
  }
};

// Update CRM by ID
exports.updateCRMById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, address, email, phones } = req.body;
    const updated = await CRM.findByIdAndUpdate(
      id,
      { name, address, email, phones },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return next(createError(404, "CRM entry not found"));
    }

    return next(createSuccess(200, "CRM entry updated successfully", updated));
  } catch (error) {
    return next(createError(500, "Internal Server Error"));
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
