const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JobSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    technician: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    roles: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "Role"
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  }
);

module.exports = mongoose.model('Job', JobSchema);
