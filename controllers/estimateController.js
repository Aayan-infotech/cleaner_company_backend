// controllers/estimateController.js

const mongoose = require("mongoose");
const MethodToService = require("../models/methodToService");
const Service = require("../models/Service");
const Method = require("../models/Method");
const Job = require("../models/jobModel");
const Room = require("../models/Room");
const Estimate = require("../models/Estimate");
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");

exports.createEstimate = async (req, res, next) => {
  try {
    const {
      room: roomId,
      length: rawLength,
      width: rawWidth,
      selectedServices,
      jobId,
    } = req.body;

    if (
      !roomId ||
      rawLength == null ||
      rawWidth == null ||
      !Array.isArray(selectedServices) ||
      selectedServices.length === 0 ||
      !jobId
    ) {
      return next(
        createError(
          400,
          "All fields (room, length, width, selectedServices, jobId) are required, and selectedServices must be a non‐empty array."
        )
      );
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return next(createError(400, `Invalid jobId: ${jobId}`));
    }
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return next(createError(400, `Invalid room: ${roomId}`));
    }

    const jobDoc = await Job.findById(jobId).lean();
    if (!jobDoc) {
      return next(createError(404, `Job not found for ID: ${jobId}`));
    }

    const roomDoc = await Room.findById(roomId).lean();
    if (!roomDoc) {
      return next(createError(404, `Room not found for ID: ${roomId}`));
    }

    const length = Number(rawLength);
    const width = Number(rawWidth);
    if (isNaN(length) || length <= 0) {
      return next(createError(400, "`length` must be a positive number."));
    }
    if (isNaN(width) || width <= 0) {
      return next(createError(400, "`width` must be a positive number."));
    }

    const totalSquarefeet = length * width;

    let sumCostPerSqFt = 0;
    const selectedServicesDocs = [];

    for (let i = 0; i < selectedServices.length; i++) {
      const entry = selectedServices[i];
      const { serviceId, methodId } = entry;

      if (!serviceId || !methodId) {
        return next(
          createError(400, `Entry #${i} is missing serviceId or methodId.`)
        );
      }
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        return next(
          createError(400, `Invalid serviceId at entry #${i}: ${serviceId}`)
        );
      }
      if (!mongoose.Types.ObjectId.isValid(methodId)) {
        return next(
          createError(400, `Invalid methodId at entry #${i}: ${methodId}`)
        );
      }
      const mtsDoc = await MethodToService.findOne({
        service: serviceId,
      }).lean();
      if (!mtsDoc) {
        return next(
          createError(
            404,
            `No MethodToService entry found for service ID: ${serviceId} (entry #${i}).`
          )
        );
      }

      const methodData = mtsDoc.methods.find(
        (m) => m.method.toString() === methodId
      );
      if (!methodData) {
        return next(
          createError(
            404,
            `Method ID: ${methodId} not associated with service ID: ${serviceId} (entry #${i}).`
          )
        );
      }

      const serviceDoc = await Service.findById(serviceId).lean();
      if (!serviceDoc) {
        return next(
          createError(
            404,
            `Service not found for ID: ${serviceId} (entry #${i}).`
          )
        );
      }
      if (serviceDoc.price == null) {
        return next(
          createError(
            400,
            `Service (ID: ${serviceId}) is missing a price field.`
          )
        );
      }

      // 7.e. Fetch Method document (to get method name)
      const methodDoc = await Method.findById(methodId).lean();
      if (!methodDoc) {
        return next(
          createError(
            404,
            `Method not found for ID: ${methodId} (entry #${i}).`
          )
        );
      }

      const costPerSqFt = serviceDoc.price * methodData.price;
      sumCostPerSqFt += costPerSqFt;

      selectedServicesDocs.push({
        service: {
          _id: serviceDoc._id,
          name: serviceDoc.name,
          price: serviceDoc.price,
        },
        method: {
          _id: methodDoc._id,
          name: methodDoc.name,
          price: methodData.price,
        },
        estimatedCost: costPerSqFt,
      });
    }

    const totalEstimate = sumCostPerSqFt * totalSquarefeet;

    const newEstimate = await Estimate.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      room: new mongoose.Types.ObjectId(roomId),
      length,
      width,
      totalSquarefeet,
      selectedServices: selectedServicesDocs,
      totalEstimate,
    });
    return next(
      createSuccess(200, "Estimate created successfully", newEstimate)
    );
  } catch (err) {
    console.error("createEstimate error:", err);

    if (
      err.message &&
      (err.message.startsWith("Invalid") ||
        err.message.includes("missing") ||
        err.message.includes("not found"))
    ) {
      if (err.message.includes("not found")) {
        return next(createError(404, err.message));
      }
      return next(createError(400, err.message));
    }

    // Otherwise, generic 500
    return next(createError(500, "Internal Server Error"));
  }
};

// GET /api/estimates
exports.getAllEstimates = async (req, res, next) => {
  try {
    const estimates = await Estimate.find()
      .populate('jobId')
      .populate('room')
      .sort({ createdAt: -1 });

    return next(createSuccess(200, "All estimates fetched", estimates));
  } catch (err) {
    console.error("getAllEstimates error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.getEstimateById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid estimate ID"));
    }

    const estimate = await Estimate.findById(id)
      .populate('jobId')
      .populate('room');

    if (!estimate) {
      return next(createError(404, "Estimate not found"));
    }

    return next(createSuccess(200, "Estimate fetched", estimate));
  } catch (err) {
    console.error("getEstimateById error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};


exports.deleteEstimate = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid estimate ID"));
    }

    const deleted = await Estimate.findByIdAndDelete(id);

    if (!deleted) {
      return next(createError(404, "Estimate not found"));
    }

    return next(createSuccess(200, "Estimate deleted successfully", deleted));
  } catch (err) {
    console.error("deleteEstimate error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};


