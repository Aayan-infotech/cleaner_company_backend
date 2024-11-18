
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HardSurfaceSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('HardSurface', HardSurfaceSchema);
