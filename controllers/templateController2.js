const Template2 = require('../models/templateModel2');
const Category = require('../models/categoryModel');
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");

// exports.createTemplate = async (req, res, next) => {
//   try {
//     const template = new Template2(req.body);
//     await template.save();
//     return next(createSuccess(201, "Template created", template));

//   } catch (error) {
//     console.error("Error Create Template", error);
//     return next(createError(500, "Internal Server Error"));
//   }
// };

exports.createTemplate = async (req, res, next) => {
  try {
    const { logo, titleHtml, descHtml, fontFamily, fontSize, fontColor, fontWeight, fontStyle, backgroundColor, textColor } = req.body;

    const template = new Template2({
      logo,
      titleHtml,
      descHtml,
      fontFamily,
      fontSize,
      fontColor,
      fontWeight,
      fontStyle,
      backgroundColor,
      textColor,
    });

    await template.save();
    return next(createSuccess(201, "Template created", template));
  } catch (error) {
    console.error("Error Create Template", error);
    return next(createError(500, "Internal Server Error"));
  }
};


exports.getAllTemplates = async (req, res, next) => {
  try {
    const templates = await Template2.find().populate('categoryId');
    return next(createSuccess(200, "Get all Templates", templates ));
  } catch (error) {
    console.error("Error Get Templates", error);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.getTemplateById = async (req, res, next) => {
  try {
    const template = await Template2.findById(req.params.id).populate('categoryId');
    if (!template) {
        return next(createError(404, "Not Found" ));
    };

    return next(createSuccess(200, "Get template", template ));
  } catch (error) {
    console.error("Error Get Template", error);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateTemplate = async (req, res, next) => {
  try {
    const template = await Template2.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!template) { 
        return next(createError(404, 'Not found' ));
    }
    
    return next(createSuccess(200, "Update template successfully", template ));
  } catch (error) {
    console.error("Error Update Template", error);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template2.findByIdAndDelete(req.params.id);
    if (!template) {
        return next(createError(404, 'Not found' ));
    }
    return next(createSuccess(200, "Deleted successfully" ));
  } catch (error) {
    console.error("Error Delete Template", error);
    return next(createError(500, "Internal Server Error"));
  }
};
