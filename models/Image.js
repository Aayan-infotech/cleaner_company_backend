// models/Image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
  productName: { type: String, required: false },
  images: [imageSchema] // Array of images
});

module.exports = mongoose.model('Product', productSchema);
