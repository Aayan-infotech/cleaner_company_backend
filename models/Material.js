const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

module.exports = mongoose.model('Material', materialSchema);
