const mongoose = require('mongoose');
 
const methodToServiceSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  }, 
  methods: [
      {
        method: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Method',
          required: true,
        },
        price: {
          type: Number,
          required: true,
        }
      }
    ],


}, { timestamps: true });

module.exports = mongoose.model('MethodToService', methodToServiceSchema);
