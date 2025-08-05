const mongoose = require("mongoose");
const MethodToService = require("../models/methodToService");
const Service = require("../models/Service");
const Method = require("../models/Method");
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

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return next(createError(400, `Invalid room ID: ${roomId}`));
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

    const roomDoc = await Room.findById(roomId).lean();
    if (!roomDoc) {
      return next(createError(404, `Room not found for ID: ${roomId}`));
    }

    let sumCostPerSqFt = 0;
    const selectedServicesDocs = [];

    for (let i = 0; i < selectedServices.length; i++) {
      const { serviceId, methodId } = selectedServices[i];

      if (!serviceId || !methodId) {
        return next(
          createError(400, `Entry #${i} is missing serviceId or methodId.`)
        );
      }

      if (
        !mongoose.Types.ObjectId.isValid(serviceId) ||
        !mongoose.Types.ObjectId.isValid(methodId)
      ) {
        return next(
          createError(
            400,
            `Invalid ObjectId in entry #${i} (serviceId or methodId)`
          )
        );
      }

      const mtsDoc = await MethodToService.findOne({ service: serviceId }).lean();
      if (!mtsDoc) {
        return next(
          createError(404, `No MethodToService found for serviceId at entry #${i}.`)
        );
      }

      const methodData = mtsDoc.methods.find((m) => {
        const methodObj = m.method;
        const methodIdStr = typeof methodObj === 'object' ? methodObj._id?.toString() : methodObj?.toString();
        return methodIdStr === methodId;
      });

      if (!methodData) {
        return next(
          createError(
            404,
            `Method ID: ${methodId} not associated with service ID: ${serviceId} (entry #${i}).`
          )
        );
      }

      let methodPrice;
      let methodDoc;

      if (typeof methodData.method === 'object' && methodData.method.price !== undefined) {
        methodPrice = Number(methodData.method.price);
        methodDoc = methodData.method;
      } else {
        methodDoc = await Method.findById(methodId).lean();
        if (!methodDoc) {
          return next(
            createError(404, `Method not found for ID ${methodId} (entry #${i}).`)
          );
        }
        methodPrice = Number(methodDoc.price);
      }

      if (isNaN(methodPrice) || methodPrice <= 0) {
        return next(
          createError(
            400,
            `Invalid price for method ID ${methodId} (entry #${i}).`
          )
        );
      }

      const serviceDoc = await Service.findById(serviceId).lean();
      if (!serviceDoc || typeof serviceDoc.price !== "number") {
        return next(
          createError(
            400,
            `Invalid or missing price for service ID ${serviceId} (entry #${i}).`
          )
        );
      }

      const costPerSqFt = Number(serviceDoc.price) * methodPrice;

      if (isNaN(costPerSqFt)) {
        return next(
          createError(400, `Calculated costPerSqFt is NaN at entry #${i}.`)
        );
      }

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
          price: methodPrice,
        },
        estimatedCost: costPerSqFt,
      });
    }

    const totalEstimate = Number(sumCostPerSqFt) * Number(totalSquarefeet);
    if (isNaN(totalEstimate)) {
      return next(createError(400, "`totalEstimate` calculated as NaN."));
    }

    const newEstimate = await Estimate.create({
      jobId,
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
      return next(createError(err.message.includes("not found") ? 404 : 400, err.message));
    }

    return next(createError(500, "Internal Server Error"));
  }
};

// Get All Estimate without Pagination
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

// Get All Estimate With Pagination
exports.getAllEstimatespagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const estimates = await Estimate.find()
      .populate('jobId')
      .populate('room')
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalEstimates = await Estimate.countDocuments();

    const response = {
      success: true,
      status: 200,
      message: "All estimates fetched successfully",
      data: estimates,
      pagination: {
        total: totalEstimates,
        page,
        limit,
      },
    };

    return res.status(200).json(response);
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


