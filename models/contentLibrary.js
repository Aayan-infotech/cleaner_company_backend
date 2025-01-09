const mongoose = require('mongoose');
const LibrarySchema = mongoose.Schema(
    {
        libName: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Library', LibrarySchema); 