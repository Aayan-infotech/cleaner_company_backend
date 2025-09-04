const mongoose = require("mongoose");

const vanStockSchema = new mongoose.Schema(
  {
    vanId: { type: mongoose.Schema.Types.ObjectId, ref: "Van", required: true },
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        qty: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VanStock", vanStockSchema);
