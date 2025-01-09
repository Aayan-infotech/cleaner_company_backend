const mongoose = require('mongoose');

const itemFileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true }
});

const ItemSchema = mongoose.Schema(
    {
        itemName: { type: String, required: true },
        partNumber: { type: Number, required: false },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryCategory', required: false },
        maxQty: { type: Number, default: 0, required: false },
        minQty: { type: Number, default: 0, required: false },
        vanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Van', required: false },
        inStock: { type: Number, required: false },
        amtOrder: { type: Number, required: false },
        forWarehouse: { type: Boolean, required: false },
        addOrder: { type: Boolean, required: false },
        cost: { type: Number, default: 0, required: false },
        price: { type: Number, default: 0, required: false },
        comment: { type: String, required: false },
        shortDes: { type: String, required: false },
        partDes: { type: String, required: false },
        Images: { type:[itemFileSchema], default: [] },
        pdfs: { type:[itemFileSchema], default: [] },
        videos: { type:[itemFileSchema], default: [] }        
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Item', ItemSchema); 
