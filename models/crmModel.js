const mongoose = require("mongoose");

const phoneSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["cell", "work", "home", "emergency", "other"],
    require: true,
  },
  number: { type: String, require: true },
});

const crmSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    address: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    phones: [phoneSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CRM", crmSchema);
