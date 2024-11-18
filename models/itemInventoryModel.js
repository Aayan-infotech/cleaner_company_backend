const mongoose = require('mongoose');

const itemFileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true }
});

const ItemSchema = mongoose.Schema(
    {
        // itemName: { type: String, required: true },
        // itemID: { type: String, required: false },
        // categoryName: { type: String, required: false },
        // totalQuantity: { type: Number, required: false },
        // minimumQuantity: { type: Number, required: false },
        // vanName: { type: String, required: false },
        // vanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Van', required: false },
        // forWarehouse: { type: Boolean, required: false },
        // comment: { type: String, required: false },


        //new one 
        itemName: { type: String, required: true },
        partNumber: { type: Number, required: false },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryCategory', required: false },
        maxQty: { type: Number, required: false },
        minQty: { type: Number, required: false },
        vanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Van', required: false },
        inStock: { type: Number, required: false },
        amtOrder: { type: Number, required: false },
        forWarehouse: { type: Boolean, required: false },
        addOrder: { type: Boolean, required: false },
        cost: { type: Number, required: false },
        price: { type: Number, required: false },
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
