const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MethodSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = mongoose.model('Method', MethodSchema);
