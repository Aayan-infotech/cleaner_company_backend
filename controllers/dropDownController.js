const Dropdown = require('../models/jobEstimateDropModel');
const Role = require('../models/roleModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')
//to Create user 
const createDropdown = async (req, res, next) => {
    try {
        const role = await Role.find({ role: 'Admin' });
        const { specialServices,room,hardSurface,itemClean,dryCleaning,method } = req.body;
        const dropdown = new Dropdown({ specialServices,room,hardSurface,itemClean,dryCleaning,method });
       
        await dropdown.save();
      
        return next(createSuccess(200, "Dropdown Created Successfully"))
    }
    catch (error) {
      
        return next(createError(500, "Something went wrong"))
    }
}
//get All Dropdowns
const getAllDropdowns = async (req, res, next) => {
    try {
        const dropdowns = await Dropdown.find();
        return next(createSuccess(200, "All Dropdowns", dropdowns));

    } catch (error) {
        return next(createError(500, "Internal Server Error!"))
    }
}


module.exports = {
    createDropdown,getAllDropdowns
}