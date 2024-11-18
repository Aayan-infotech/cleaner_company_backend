const Van = require('../models/vanModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success');

exports.createVan = async (req, res, next) => {
    try {
        const newVan = new Van({ vanName: req.body.vanName });
        const savedVan = await newVan.save();

        return next(createSuccess(200, "Van Added Successfully", savedVan))

    } catch (error) {
        return next(createError(500, "Something went wrong"))
    }
};

exports.getAllVans = async (req, res, next) => {
    try {
        const vans = await Van.find();

        return next(createSuccess(200, "Vans retrieved successfully", vans));

    } catch (error) {
        return next(createError(500, "Something went wrong"));
    }
};

exports.getVanById = async (req, res, next) => {
    try {
        const van = await Van.findById(req.params.id);
        if (!van) return next(createError(404, "Van not found"));

        return next(createSuccess(200, "Van retrieved successfully", van));

    } catch (error) {
        return next(createError(500, "Something went wrong"));
    }
};
