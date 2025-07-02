const Template = require('../models/templateModel');
const mongoose = require('mongoose');
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");

const fs = require('fs');
const path = require('path');

exports.createTemplate = async (req, res) => {
  try {
    const htmlContent = req.body.html;
    if (!htmlContent) {
      return res.status(400).json({ success: false, message: "HTML content is required" });
    }

    const templatesDir = path.join(process.cwd(), 'savedTemplates');
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir);
    }

    const fileName = `template-${Date.now()}.html`;
    const filePath = path.join(templatesDir, fileName);

    fs.writeFileSync(filePath, htmlContent);

    // Save just the file name in DB under "html"
    const newTemplate = new Template({ html: fileName });
    await newTemplate.save();

    res.status(201).json({ 
      success: true,
      message: "Template saved",
      fileName,
      previewUrl: `/api/template/view/${newTemplate._id}` // you will create this endpoint next
    });

  } catch (error) {
    console.error("createTemplate error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


exports.getAllTemplates = async (req, res, next) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: templates });
  } catch (err) {
    console.error("getAllTemplates error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};


exports.getTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, 'Invalid template ID'));
    }

    const template = await Template.findById(id);
    if (!template) {
      return next(createError(404, 'Template not found'));
    }

    res.set('Content-Type', 'text/html');
    return res.send(template.html);
  } catch (err) {
    console.error("getTemplateById error:", err);
    return next(createError(500, "Internal Server Error"));
  }
}

// exports.updateTemplate = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return next(createError(400, 'Invalid template ID'));
//     }

//     const html = (req.body && req.body.html) ? req.body.html : req.body;
//     if (!html || typeof html !== 'string' || html.trim().length === 0) {
//       return next(createError(400, 'HTML content is required.'));
//     }

//     const updatedTemplate = await Template.findByIdAndUpdate(id, { html }, { new: true });
//     if (!updatedTemplate) {
//       return next(createError(404, 'Template not found'));
//     }

//     return next(createSuccess(200, 'Template updated successfully', updatedTemplate));
//   } catch (err) {
//     console.error("updateTemplate error:", err);
//     return next(createError(500, "Internal Server Error"));
//   }
// };

exports.deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, 'Invalid template ID'));
    }

    const deletedTemplate = await Template.findByIdAndDelete(id);
    if (!deletedTemplate) {
      return next(createError(404, 'Template not found'));
    }

    return next(createSuccess(200, 'Template deleted successfully', deletedTemplate));
  } catch (err) {
    console.error("deleteTemplate error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.viewTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).send("Template not found");
    }

    const filePath = path.join(process.cwd(), 'savedTemplates', template.html);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Template file missing on server");
    }

    // Send the file content as HTML
    res.sendFile(filePath);
    
  } catch (error) {
    console.error("viewTemplate error:", error);
    res.status(500).send("Error loading template");
  }
};
