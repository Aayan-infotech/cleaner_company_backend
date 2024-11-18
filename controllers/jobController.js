const Job = require('../models/jobModel');
const Role = require('../models/roleModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success')

exports.getJobs = async (req, res, next) => {
    try {
        const jobs = await Job.find({ technician: req.user.username });
        return next(createSuccess(200, "Job Assign Created", jobs));
    } catch (err) {
        return next(createError(500, "Internal Server Error!"))
    }
};

exports.createJob = async (req, res, next) => {
    const role = await Role.findOne({ role: 'Tech' });
    const { clientName, clientEmail, date, address, technician ,userId,phoneNumber} = req.body;

    const newJob = new Job({
        clientName,
        clientEmail,
        date,
        address,
        technician,
        userId,
        phoneNumber,
        roles: role
    });

    try {
        const savedJob = await newJob.save();
        return next(createSuccess(200, "Job Assign Created", savedJob));
    } catch (err) {
        return next(createError(500, "Internal Server Error!"))
    }
};
exports.getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        return next(createSuccess(200, "Job Details", job));
    } catch (err) {
        return next(createError(500, "Internal Server Error!"))
    }
};

exports.updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await Job.findByIdAndUpdate(id, req.body);
        if (!job) {
            return next(createError(404, "Job Assign Not Found"));
        }
        return next(createSuccess(200, "Job Details Updated", job));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"))
    }
};

exports.deleteJob = async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await Job.findByIdAndDelete(id);
        if (!job) {
            return next(createError(404, "Job Not Found"));
        }
        return next(createSuccess(200, "Job Deleted", job));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"))
    }
};

exports.getJobsByTechnician = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const jobs = await Job.find({ userId });
        return next(createSuccess(200, "Job Get All", jobs));
    } catch (err) {
        return next(createError(500, "Internal Server Error!"))
    }
};
