const Profiles = require('../models/profileManageModel');
const Role = require('../models/roleModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');

// to profile managements

//create 
const createProfile = async (req, res, next) => {
    try {
        const role = await Role.find({ role: 'User'});
        const newProfile = new Profiles({
            
            comLogo: req.body.comLogo,
            custName: req.body.custName,
            status: req.body.status,
            accType: req.body.accType,
            lastOdrDate: req.body.lastOdrDate,
            amtLastOdr: req.body.amtLastOdr
        })
        await newProfile.save();
        return next(createSuccess(200, "Profile Added Successfully"));
    } catch (error) {
        return next(createError(500, "Something went wrong"));
    } 
};

//get all profiles
const getAllProfile = async(req, res, next) => {
    try {
        const profile = await Profiles.find();
        return next(createSuccess(200, "All Profiles", profile));
    }   catch (error) {
        return next(createError(500, "Internal Server Error!"))
    }
};

//get by id
const getById = async (req, res, next) => {
    try {
        const profile = await Profiles.findById(req.params.id);
        if(!profile) {
            return next(createError(404, "Profile Not Found"));
        }
        return next(createSuccess(200, "Single Profile", profile));
    } catch (error) {
        return  next(createError(500, "Internal Server Error!"))
    }
};

//update profile by id
const updateProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const profile = await Profiles.findByIdAndUpdate(id, req.body);
        if(!profile) {
            return next(createError(404, "Profile Not Found"));
        }
        return next(createSuccess(200, "Profile Details Updated", profile));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};

//delete profile by id
const deleteProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const profile = await Profiles.findByIdAndDelete(id);
        if(!profile) {
            return next(createError(404, "Profile Not Found"));
        } 
        return next(createSuccess(200, "Profile Deleted", profile)); 
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};

module.exports = { createProfile, getAllProfile, getById, updateProfile, deleteProfile };