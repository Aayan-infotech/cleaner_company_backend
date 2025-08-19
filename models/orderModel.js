const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema(
    {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        requestedQuantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'], },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        approvedQuantity: { type: Number, required: false, default: 0 },
        remarks: { type: String, required: false },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', OrderSchema); 