const Service = require('../models/Service');
const Method = require('../models/Method');
const mongoose = require('mongoose');
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");
const MethodToService = require('../models/methodToService');


exports.createService = async (req, res, next) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return next(createError(400, "Both 'name' and 'price' are required."));
    }

    const service = await Service.create({ name, price });
    return next(
      createSuccess(200, "Service created successfully", service)
    );
  } catch (err) {
    console.error("createService error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};


exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find();

    const populatedServices = await Promise.all(
      services.map(async (service) => {
        const methodsData = await MethodToService
          .findOne({ service: service._id })
          .populate('methods.method')
          .lean();

        return {
          ...service.toObject(),
          methods: methodsData ? methodsData.methods : []
        };
      })
    );

    return next(
      createSuccess(200, "Services retrieved successfully", populatedServices)
    );
  } catch (err) {
    console.error("getAllServices error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};


exports.getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid service ID"));
    }

    const service = await Service.findById(id);
    if (!service) {
      return next(createError(404, "Service not found"));
    }

    const methodsData = await MethodToService
      .findOne({ service: service._id })
      .populate('methods.method')
      .lean();

    const response = {
      ...service.toObject(),
      methods: methodsData ? methodsData.methods : []
    };

    return next(
      createSuccess(200, "Service retrieved successfully", response)
    );
  } catch (err) {
    console.error("getServiceById error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid service ID"));
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { name, price },
      { new: true }
    );

    if (!service) {
      return next(createError(404, "Service not found"));
    }

    const methodsData = await MethodToService
      .findOne({ service: service._id })
      .populate('methods.method')
      .lean();

    const response = {
      ...service.toObject(),
      methods: methodsData ? methodsData.methods : []
    };

    return next(
      createSuccess(200, "Service updated successfully", response)
    );
  } catch (err) {
    console.error("updateService error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid service ID"));
    }

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return next(createError(404, "Service not found"));
    }

    await MethodToService.deleteOne({ service: id });

    return next(
      createSuccess(200, "Service deleted successfully", service)
    );
  } catch (err) {
    console.error("deleteService error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};


exports.addMethodToService = async (req, res, next) => {
  try {
    const { serviceId } = req.params
    const { methodId, price } = req.body

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return next(createError(400, "Invalid service ID"))
    }
    if (!mongoose.Types.ObjectId.isValid(methodId)) {
      return next(createError(400, "Invalid method ID"))
    }
    if (price === undefined || isNaN(price)) {
      return next(createError(400, "Valid price is required for the method"))
    }

    // ensure service exists
    const serviceExists = await Service.exists({ _id: serviceId })
    if (!serviceExists) {
      return next(createError(404, "Service not found"))
    }
    // ensure method exists
    const methodExists = await Method.exists({ _id: methodId })
    if (!methodExists) {
      return next(createError(404, "Method not found"))
    }

    // find or create the MethodToService document for this service
    let mts = await MethodToService.findOne({ service: serviceId })
    if (!mts) {
      mts = new MethodToService({ service: serviceId, methods: [] })
    }

    // prevent duplicates
    if (mts.methods.some(m => m.method.toString() === methodId)) {
      return next(createError(409, "Method already exists in the service"))
    }

    // add & save
    mts.methods.push({ method: methodId, price })
    await mts.save()
    await mts.populate('methods.method')

    return next(createSuccess(200, "Method added to service successfully", mts))
  } catch (err) {
    console.error("addMethodToService error:", err)
    return next(createError(500, "Internal Server Error"))
  }
}

exports.removeMethodFromService = async (req, res, next) => {
  try {
    const { serviceId, methodId } = req.params

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return next(createError(400, "Invalid service ID"))
    }
    if (!mongoose.Types.ObjectId.isValid(methodId)) {
      return next(createError(400, "Invalid method ID"))
    }

    const mts = await MethodToService.findOne({ service: serviceId })
    if (!mts) {
      return next(createError(404, "Service-to-methods mapping not found"))
    }

    mts.methods = mts.methods.filter(m => m.method.toString() !== methodId)
    await mts.save()
    await mts.populate('methods.method')

    return next(createSuccess(200, "Method removed from service successfully", mts))
  } catch (err) {
    console.error("removeMethodFromService error:", err)
    return next(createError(500, "Internal Server Error"))
  }
}

exports.getMethodsByServiceId = async (req, res, next) => {
  try {
    const { serviceId } = req.params

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return next(createError(400, "Invalid service ID"))
    }

    const mts = await MethodToService.findOne({ service: serviceId }).populate('methods.method')
    if (!mts) {
      return next(createError(404, "No methods mapping found for this service"))
    }
    if (mts.methods.length === 0) {
      return next(createError(404, "No methods found for this service"))
    }

    return next(createSuccess(200, "Methods retrieved successfully", mts.methods))
  } catch (err) {
    console.error("getMethodsByServiceId error:", err)
    return next(createError(500, "Internal Server Error"))
  }
}

