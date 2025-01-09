const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        categoryName: { type: String, required: true },
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CategoryItem' }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Category', categorySchema);