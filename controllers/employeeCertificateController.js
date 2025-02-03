const path = require('path');
const multer = require('multer');
const EmployeeCertificate = require('../models/employeeCertificateModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedFileTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed.'));
        }
    },
});

exports.addCertificate = [
    upload.single('certificate_file'),
    async (req, res, next) => {
        try {
            const { employee_id } = req.params; // Employee ID from params
            const { certificate_note } = req.body;

            if (!employee_id || !req.file) {
                return next(createError(400, 'Employee ID and certificate file are required.'));
            }

            const certificate_file = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

            const certificate = new EmployeeCertificate({
                employee_id,
                certificate_file,
                certificate_note,
            });

            await certificate.save();
            return next(createSuccess(201, 'Certificate added successfully.', certificate));
        } catch (error) {
            return next(createError(500, error.message || 'Internal Server Error!'));
        }
    },
];

exports.getAllCertificates = async (req, res, next) => {
    try {
        const { employee_id } = req.params; 
        if (!employee_id) {
            return next(createError(400, 'Employee ID is required.'));
        }

        const certificates = await EmployeeCertificate.find({ employee_id }); 
        return next(createSuccess(200, 'Certificates retrieved successfully.', certificates));
    } catch (error) {
        return next(createError(500, 'Internal Server Error!'));
    }
};

exports.getCertificateById = async (req, res, next) => {
    try {
        const { employee_id, id } = req.params; 

        if (!employee_id || !id) {
            return next(createError(400, 'Employee ID and Certificate ID are required.'));
        }

        const certificate = await EmployeeCertificate.findOne({ _id: id, employee_id }); 

        if (!certificate) {
            return next(createError(404, 'Certificate not found.'));
        }

        return next(createSuccess(200, 'Certificate retrieved successfully.', certificate));
    } catch (error) {
        return next(createError(500, 'Internal Server Error!'));
    }
};

exports.updateCertificate = [
    upload.single('certificate_file'),
    async (req, res, next) => {
        try {
            const { employee_id, id } = req.params; 
            const { certificate_note } = req.body;

            if (!employee_id || !id) {
                return next(createError(400, 'Employee ID and Certificate ID are required.'));
            }

            const certificate = await EmployeeCertificate.findOne({ _id: id, employee_id }); // Filter by both IDs

            if (!certificate) {
                return next(createError(404, 'Certificate not found.'));
            }

            if (req.file) {
                const certificate_file = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
                certificate.certificate_file = certificate_file;
            }

            if (certificate_note) {
                certificate.certificate_note = certificate_note;
            }

            await certificate.save();
            return next(createSuccess(200, 'Certificate updated successfully.', certificate));
        } catch (error) {
            return next(createError(500, error.message || 'Internal Server Error!'));
        }
    },
];

exports.deleteCertificate = async (req, res, next) => {
    try {
        const { employee_id, id } = req.params; 

        if (!employee_id || !id) {
            return next(createError(400, 'Employee ID and Certificate ID are required.'));
        }

        const certificate = await EmployeeCertificate.findOneAndDelete({ _id: id, employee_id }); 

        if (!certificate) {
            return next(createError(404, 'Certificate not found.')); 
        }

        return next(createSuccess(200, 'Certificate deleted successfully.', certificate));
    } catch (error) {
        return next(createError(500, 'Internal Server Error!'));
    }
};
