const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProfileSchema = mongoose.Schema(
    {
        comLogo: {
            type: String,
            required: false
        },
        custName: {
            type: String,
            required: false
        },
        status: {
            type: String,
            required: false
        },
        accType: {
            type: String,
            required: false
        },
        lastOdrDate: {
            type: String,
            required: false
        },
        amtLastOdr: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Profiles', ProfileSchema);