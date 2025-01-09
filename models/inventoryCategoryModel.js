const mongoose = require('mongoose');

const InventoryCategorySchema = new mongoose.Schema(
    {
        categoryName: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('InventoryCategory', InventoryCategorySchema);