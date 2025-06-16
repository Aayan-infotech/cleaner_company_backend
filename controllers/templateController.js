const Template = require('../models/templateModel');
const mongoose = require('mongoose');
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");

exports.createTemplate = async (req, res, next) => {
  try {
    const html = (req.body && req.body.html) ? req.body.html : req.body;

    if (!html || typeof html !== 'string' || html.trim().length === 0) {
      return next(createError(400, 'HTML content is required.'));
    }

    const template = await Template.create({ html });
    return next(createSuccess(200, 'Template created successfully', template));
  } catch (err) {
    console.error('createTemplate error:', err);
    return next(createError(500, 'Internal Server Error'));
  }
};

exports.getAllTemplates = async (req, res, next) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    const combinedHtml = templates
      .map(t => `
        <section data-template-id="${t._id}" style="margin-bottom: 40px;">
          <!-- Hidden ID -->
          <script type="application/json" data-template-meta>${JSON.stringify({ _id: t._id })}</script>
          ${t.html}
        </section>
      `)
      .join('<hr>');
    
    res.set('Content-Type', 'text/html');
    return res.send(combinedHtml);
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

