const mongoose = require('mongoose');
const templateSchema = new mongoose.Schema({
    html: {
        type: String,
        required: true,
    },
    
    }, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);
