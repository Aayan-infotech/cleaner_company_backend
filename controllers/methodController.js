const Method = require('../models/Method');
const mongoose = require('mongoose');
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");

exports.createMethod = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return next(createError(400, "'name' is required.")); // Validate name
    }

    const method = await Method.create({ name }); // Create a new method
    return next(
      createSuccess(200, "Method created successfully", method)
    );
  } catch (err) {
    console.error("createMethod error:", err);
    return next(createError(500, "Internal Server Error"));
  }
}

exports.getAllMethods = async (req, res, next) => {
  try {
    const methods = await Method.find(); // Retrieve all methods
    return next(
      createSuccess(200, "Methods retrieved successfully", methods) 
    );
  } catch (err) {
    console.error("getAllMethods error:", err);
    return next(createError(500, "Internal Server Error"));
  }
}

exports.getMethodById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid method ID")); // Validate method ID
    }

    const method = await Method.findById(id);
    if (!method) {
      return next(createError(404, "Method not found")); // Check if method exists
    }
    return next(
      createSuccess(200, "Method retrieved successfully", method)
    );
  }
  catch (err) {
    console.error("getMethodById error:", err);
    return next(createError(500, "Internal Server Error"));
  } 
}

exports.updateMethod = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid method ID")); // Validate method ID
    }

    if (!name) {
      return next(createError(400, "'name' is required.")); // Validate name
    }

    const method = await Method.findByIdAndUpdate(id, { name }, { new: true });
    if (!method) {
      return next(createError(404, "Method not found")); // Check if method exists
    }

    return next(
      createSuccess(200, "Method updated successfully", method)
    );
  } catch (err) {
    console.error("updateMethod error:", err);
    return next(createError(500, "Internal Server Error"));
  }
}

exports.deleteMethod = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid method ID")); // Validate method ID
    }

    const method = await Method.findByIdAndDelete(id);
    if (!method) {
      return next(createError(404, "Method not found")); // Check if method exists
    }

    return next(
      createSuccess(200, "Method deleted successfully", method)
    );
  } catch (err) {
    console.error("deleteMethod error:", err);
    return next(createError(500, "Internal Server Error"));
  }
}

