const Estimate = require('../models/Estimate');
const Service = require('../models/Service');
const ItemClean = require('../models/ItemClean');
const DryCleaning = require('../models/DryCleaning');
const HardSurface = require('../models/HardSurface');
const Method = require('../models/Method');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')
const mongoose = require('mongoose');


const createEstimate = async (req, res, next) => {
  try {
    const { estimates, jobId } = req.body;

    if (!jobId) {
      return next(createError(400, "Job ID is required"));
    }

    if (!estimates || !Array.isArray(estimates)) {
      return next(createError(400, "Invalid input data"));
    }

    const estimateDocuments = await Promise.all(
      estimates.map(async (estimate) => {
        try {
          const selectedServices = Array.isArray(estimate.selectedServices)
            ? await Promise.all(
              estimate.selectedServices.map(async (selectedService) => {
                try {
                  const service = selectedService.service
                    ? await Service.findById(selectedService.service)
                    : null;

                  // Check if itemClean is a valid ObjectId; if not, use it as a label
                  const itemClean = mongoose.isValidObjectId(selectedService.itemClean)
                    ? await ItemClean.findById(selectedService.itemClean)
                    : { name: selectedService.itemClean };

                  const dryCleaning = selectedService.dryCleaning
                    ? await DryCleaning.findById(selectedService.dryCleaning)
                    : null;
                  const hardSurface = selectedService.hardSurface
                    ? await HardSurface.findById(selectedService.hardSurface)
                    : null;
                  const method = selectedService.method
                    ? await Method.findById(selectedService.method)
                    : null;

                  const estimatedCost =
                    (service ? service.price : 0) +
                    (itemClean && itemClean.price ? itemClean.price : 0) +
                    (dryCleaning ? dryCleaning.price : 0) +
                    (hardSurface ? hardSurface.price : 0) +
                    (method ? method.price : 0);

                  return {
                    service: service
                      ? { _id: service._id, name: service.name, price: service.price }
                      : null,
                    itemClean: itemClean
                      ? { _id: itemClean._id || null, name: itemClean.name, price: itemClean.price || 0 }
                      : null,
                    dryCleaning: dryCleaning
                      ? { _id: dryCleaning._id, name: dryCleaning.name, price: dryCleaning.price }
                      : null,
                    hardSurface: hardSurface
                      ? { _id: hardSurface._id, name: hardSurface.name, price: hardSurface.price }
                      : null,
                    method: method
                      ? { _id: method._id, name: method.name, price: method.price }
                      : null,
                    estimatedCost
                  };
                } catch (error) {
                  console.error('Error fetching service details:', error);
                  throw new Error('Error fetching service details');
                }
              })
            )
            : [];

          const totalEstimate = selectedServices.reduce(
            (total, service) => total + service.estimatedCost,
            0
          );

          const totalSquareFoot = estimate.length * estimate.width;

          return {
            room: estimate.room,
            length: estimate.length,
            width: estimate.width,
            totalSquareFoot,
            selectedServices,
            totalEstimate,
            jobId
          };
        } catch (error) {
          console.error('Error processing estimate:', error);
          throw new Error('Error processing estimate');
        }
      })
    );

    const newEstimates = await Estimate.insertMany(estimateDocuments);

    return res.status(200).json(createSuccess(200, "Estimate Created Successfully", newEstimates));
  } catch (error) {
    console.error('Error creating estimates:', error);
    return next(createError(500, "Something went wrong"));
  }
};





const getAllEstimates = async (req, res, next) => {
  try {
    // Fetch all estimates from the database and populate the necessary fields
    const estimates = await Estimate.find()
      .populate({
        path: 'selectedServices',
        // populate: [
        //   { path: 'service', select: 'name price' },
        //   { path: 'itemClean', select: 'name price' },
        //   { path: 'dryCleaning', select: 'name price' },
        //   { path: 'hardSurface', select: 'name price' },
        //   { path: 'method', select: 'name price' }
        // ]
      })
      .populate('room', 'name'); // Populate the room field with the name field

    // Return the estimates in the response
    return next(createSuccess(200, "All Estimates", estimates));
  } catch (error) {
    // Handle any errors
    return next(createError(500, "Something went wrong"));
  }
};


const deleteEstimate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const estimate = await Estimate.findByIdAndDelete(id);
    if (!estimate) {
      return next(createError(404, "Estimate Not Found"));
    }
    return next(createSuccess(200, "Estimate Deleted", estimate));
  } catch (error) {
    return next(createError(500, "Internal Server Error1"))
  }
}


module.exports = { createEstimate, getAllEstimates, deleteEstimate };
