const mongoose = require('mongoose');
const OrderSchema = mongoose.Schema(
    {
        orderQuantity: {
            type: Number,
            required: true
        },
        itemInfo:{
            type: Array,
            required: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', OrderSchema); 