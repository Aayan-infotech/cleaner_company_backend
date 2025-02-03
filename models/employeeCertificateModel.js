const mongoose = require('mongoose');

const employeeCertificateSchema = new mongoose.Schema(
    {
        employee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee', 
            required: true,
        },
        certificate_file: {
            type: String,
            required: true,
        },
        certificate_note: {
            type: String,
            required: false,
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('EmployeeCertificate', employeeCertificateSchema);
