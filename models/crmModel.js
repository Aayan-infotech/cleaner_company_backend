const mongoose = require("mongoose");

// Default Profile Picture
const defaultImage = {
  filename: "default-image.jpg",
  contentType: "image/png",
};

// Profile Picture
const profilePicSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
});

// Phone Numbers
const phoneSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["cell", "work", "home", "emergency", "other"],
    require: true,
  },
  number: { type: String, require: true },
});

// Complete details
const crmSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    address: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    phones: [phoneSchema],
    images: { type: [profilePicSchema], default: [defaultImage] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CRM", crmSchema);
