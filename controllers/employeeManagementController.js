const multer = require('multer');
const path = require('path');
const Employee = require('../models/employeeManagementModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');
const mongoose = require('mongoose');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });


exports.addEmployee = [
    upload.single('employee_photo'),  
    async (req, res, next) => {
        try {
            const {
                employee_name,
                employee_contact,
                employee_email,
                employee_password,
                employee_vanAssigned,
                employee_role,
                employee_jobStatus,
                employee_employeeStatus,
                employee_EmContactName,
                employee_EmContactNumber,
                employee_EmContactEmail,
                employee_EmContactAddress,
                employee_SocialSecurityNumber,
                employee_addNote,
                employee_address,
                ins_date,
            } = req.body;

            if (!employee_name || !employee_contact || !employee_email || !employee_vanAssigned || !employee_role || !employee_password) {
                return next(createError(400, 'Please provide all required fields.'));
            }

            const employeeExists = await Employee.findOne({ employee_email });
            if (employeeExists) {
                return next(createError(400, 'Employee already exists.'));
            }

            const imageUrl = req.file
                ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
                : `${req.protocol}://${req.get('host')}/uploads/default.jpg`; // Default image URL

            const employee = new Employee({
                employee_name,
                employee_contact,
                employee_email,
                employee_password,
                employee_vanAssigned,
                employee_role,
                employee_photo: imageUrl,
                employee_jobStatus,
                employee_employeeStatus,
                employee_SocialSecurityNumber,
                employee_EmContactName,
                employee_EmContactNumber,
                employee_EmContactEmail,
                employee_EmContactAddress,
                employee_addNote,
                employee_address,
                ins_date,
            });

            const savedEmployee = await employee.save();


            const populatedEmployee = await Employee.findById(savedEmployee._id).populate(
                'employee_vanAssigned',
                'vanName'
            );

            return next(createSuccess(200, 'Employee added successfully.', populatedEmployee));
        } catch (error) {
            return next(createError(500, error.message || 'Internal Server Error!'));
        }
    },
];


exports.getAllEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find().populate('employee_vanAssigned', 'vanName');

        if (!employees || employees.length === 0) {
            return next(createError(404, 'No employees found.'));
        }

        return next(createSuccess(200, 'All employees fetched successfully.', employees));
    } catch (error) {
        return next(createError(500, 'Internal Server Error!'));
    }
};


exports.getEmployeeById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createError(400, 'Invalid Employee ID.'));
        }

        const employee = await Employee.findById(id).populate('employee_vanAssigned', 'vanName');

        if (!employee) {
            return next(createError(404, 'Employee not found.'));
        }

        return next(createSuccess(200, 'Employee fetched successfully.', employee));
    } catch (error) {
        return next(createError(500, 'Internal Server Error!'));
    }
};


exports.updateEmployeeDetails = [
    upload.single('employee_photo'),
    async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(createError(400, 'Invalid Employee ID.'));
            }

            const employee = await Employee.findById(id);
            if (!employee) {
                return next(createError(404, 'Employee not found.'));
            }

            const {
                employee_name,
                employee_contact,
                employee_email,
                employee_password,
                employee_vanAssigned,
                employee_role,
                employee_jobStatus,
                employee_employeeStatus,
                employee_SocialSecurityNumber,
                employee_EmContactName,
                employee_EmContactNumber,
                employee_EmContactEmail,
                employee_EmContactAddress,
                employee_addNote,
                employee_address,
                ins_date,
            } = req.body;

            

            const imageUrl = req.file
                ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
                : employee.employee_photo || `${req.protocol}://${req.get('host')}/uploads/default.jpg`;

            const updatedEmployee = await Employee.findByIdAndUpdate(
                id,
                {
                    employee_name: employee_name || employee.employee_name,
                    employee_contact: employee_contact || employee.employee_contact,
                    employee_email: employee_email || employee.employee_email,
                    employee_password : employee_password || employee.employee_password,
                    employee_vanAssigned: employee_vanAssigned || employee.employee_vanAssigned,
                    employee_role: employee_role || employee.employee_role,
                    employee_photo: imageUrl,
                    employee_jobStatus,
                    employee_employeeStatus,
                    employee_SocialSecurityNumber,
                    employee_EmContactName,
                    employee_EmContactNumber,
                    employee_EmContactEmail,
                    employee_EmContactAddress,
                    employee_addNote,
                    employee_address,
                    ins_date,
                },
                { new: true, runValidators: true } 
            ).populate('employee_vanAssigned', 'vanName');

            return next(createSuccess(200, 'Employee details updated successfully.', updatedEmployee));
        } catch (error) {
            return next(createError(500, error.message || 'Internal Server Error!'));
        }
    },
];


exports.deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return next(createError(404, 'Employee not found.'));
        }

        return next(createSuccess(200, 'Employee deleted successfully.', employee));
    } catch (error) {
        return next(createError(500, 'Internal Server Error!'));
    }
};
exports.updateEmployeeStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(createError(400, 'Invalid Employee ID.'));
        }

        const employee = await Employee.findById(id);
        if (!employee) {
            return next(createError(404, 'Employee not found.'));
        }

        const newStatus = employee.employee_employeeStatus === 'Active' ? 'Block' : 'Active';

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            { employee_employeeStatus: newStatus },
            { new: true, runValidators: true }
        );

        return next(createSuccess(200, 'Employee status updated successfully.', updatedEmployee));
    } catch (error) {
        return next(createError(500, error.message || 'Internal Server Error!'));
    }
};


exports.updatePassword = [
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const { new_password } = req.body;

            if (!new_password) {
                return next(createError(400, 'Please provide the required field.'));
            }

            const employee = await Employee.findById(id);
            if (!employee) {
                return next(createError(404, 'Employee not found.'));
            }

            const updatedEmployee = await Employee.findByIdAndUpdate(
                id,
                { employee_password: new_password },
                { new: true, runValidators: true }
            );

            return next(createSuccess(200, 'Password updated successfully.', updatedEmployee));
        } catch (error) {
            return next(createError(500, error.message || 'Internal Server Error!'));
        }
    },
];

