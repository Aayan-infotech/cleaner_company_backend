const mongoose = require('mongoose');

const vanSchema = new mongoose.Schema(
    {
        vanName: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Van', vanSchema);
