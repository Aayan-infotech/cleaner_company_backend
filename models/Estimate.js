const mongoose = require('mongoose');

const SelectedServiceSchema = new mongoose.Schema({
  service: {
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
  totalSquarefeet: { type: Number, required: false },  
  selectedServices: [SelectedServiceSchema],
  totalEstimate: { type: Number, required: true },
  jobId: { type:String, required: true },
}, {
  timestamps: true
});

const Estimate = mongoose.model('Estimate', EstimateSchema);

module.exports = Estimate;