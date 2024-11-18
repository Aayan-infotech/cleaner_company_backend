const mongoose = require('mongoose');

const SelectedServiceSchema = new mongoose.Schema({
  service: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number
  },
  itemClean: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number
  },
  dryCleaning: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number
  },
  hardSurface: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number
  },
  method: {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number
  },
  estimatedCost: { type: Number, required: true }
});

const EstimateSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  length: { type: Number, required: true }, 
  width: { type: Number, required: true },  
  totalSquarefoot: { type: Number, required: false },  
  selectedServices: [SelectedServiceSchema],
  totalEstimate: { type: Number, required: true },
  jobId: { type: String, required: false }
}, {
  timestamps: true
});

const Estimate = mongoose.model('Estimate', EstimateSchema);

module.exports = Estimate;