const mongoose = require("mongoose");

// Logo Schema
const logoSchema = new mongoose.Schema({
 filename: { type: String, required: true },
 contentType: { type: String, required: true },
});

const templateSchema = new mongoose.Schema(
 {
   logo: { type: [logoSchema] },
   titleHtml: { type: String, required: false },
   titleFontColor: { type: String, required: false },
   titleFontFamily: { type: String, required: false },
   titleisBold: { type: Boolean, default: false },
   titleisItalic: { type: Boolean, default: false },
   titleFontSize: { type: Number, required: false },
   descHtml: { type: String, required: false },
   desFontColor: { type: String, required: false },
   backgroundColor: { type: String, required: false },
   categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Categories", required: false },
 },
 {
   timestamps: true,
 }
);


module.exports = mongoose.model("Template2", templateSchema);