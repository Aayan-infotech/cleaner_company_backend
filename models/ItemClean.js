
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const ItemCleanSchema = new Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true }
// });

const ItemCleanSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    subItems: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true }
      }
    ]
  }
);

module.exports = mongoose.model('ItemClean', ItemCleanSchema);