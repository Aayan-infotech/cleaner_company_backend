const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  logo: {
    type: String, // Base64 string or image URL
    required: false,
  },
  titleHtml: {
    type: String,
    required: false,
  },
  descHtml: {
    type: String,
    required: false,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: false, // Optional unless you're enforcing categories
  },
  backgroundColor: {
    type: String,
    required: false,
  },
  font: {
    type: String,
    required: false,
  },
  fontColor: {
    type: String,
    required: false,
  },
  textColor: {
    type: String,
    required: false,
  },
  fontSize: {
    type: Number,
    required: false,
  },
  isBold: {
    type: Boolean,
    default: false,
  },
  isItalic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Template2", templateSchema);
