const mongoose = require('mongoose');

// Schema for files (can be used for images, PDFs, and videos)
const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true }
});

const categoryitemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },      
        partNumber: { type: String, required: true },
        shortDescription: { type: String, required: true },
        partDescription: { type: String, required: true },
        images: { type: [fileSchema], default: [] },
        pdfs: { type: [fileSchema], default: [] },
        videos: { type: [fileSchema], default: [] }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('CategoryItem', categoryitemSchema);
