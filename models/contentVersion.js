const mongoose = require('mongoose');
const VersionSchema = mongoose.Schema(
    {
        verName: {
            type: String,
            required: true
        },
        modifiedBy: {
            type: String,
            required: false
        },
        modifiedDate: {
            type: Date,
            required: false
        },
        createdBy: {
            type: String,
            required: false
        },
        createdDate: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Version', VersionSchema); 