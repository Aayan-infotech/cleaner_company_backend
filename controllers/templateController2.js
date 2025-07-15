const Template2 = require('../models/templateModel2');
const Category = require('../models/categoryModel');
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");
const CRM = require("../models/crmModel");
const GroupClients = require("../models/groupClientsModel");
const nodemailer = require("nodemailer");


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
    const { id } = req.params;
    if (!id) {
      return next(createError(400, "Template ID is required"));
    }

    const templateExists = await Template2.findById(id);
    if (!templateExists) {
      return next(createError(404, "Template not found"));
    }
    return next(createSuccess(200, "Template found", templateExists));

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

exports.deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(createError(400, 'Template ID is required'));
    }

    const templateExists = await Template2.findByIdAndDelete(id);
    if (!templateExists) {
      return next(createError(404, 'Template not found'));
    }
    
    return next(createSuccess(200, 'Template deleted successfully'));
  } catch (error) {
    console.error('Error deleting template:', error);
    return next(createError(500, 'Internal Server Error'));
  }
};

// Share template to clients
exports.shareTemplateToClients = async (req, res) => {
  const { templateId } = req.params;
  const { clientIds } = req.body; 

  try {
    const template = await Template2.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const clients = await CRM.find({ _id: { $in: clientIds } });

    if (clients.length === 0) {
      return res.status(404).json({ message: 'No valid clients found' });
    }

    const htmlContent = `
      <div style="
        background-color: ${template.backgroundColor || '#ffffff'};
        color: ${template.textColor || '#000000'};
        font-size: ${template.fontSize || 16}px;
        font-weight: ${template.isBold ? 'bold' : 'normal'};
        font-style: ${template.isItalic ? 'italic' : 'normal'};
        padding: 20px;
      ">
        ${template.logo ? `<img src="${template.logo}" alt="Logo" style="max-width: 200px;" />` : ''}
        <h2 style="color: ${template.fontColor || '#000'}">${template.titleHtml || ''}</h2>
        <p>${template.descHtml || ''}</p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gpt11032024@gmail.com',
        pass: 'vrsypqwmiganvevf'
      }
    });

    // Send email to each client
    for (const client of clients) {
      const mailOptions = {
        from: 'gpt11032024@gmail.com',
        to: client.email,
        subject: 'Here’s a new template for you',
        html: htmlContent
      };

      await transporter.sendMail(mailOptions);
    }

    return res.json({ message: 'Template shared with all clients successfully' });
  } catch (error) {
    console.error('Error sharing template:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Share Template to Groups
exports.shareTemplateToGroups = async (req, res) => {
  const { templateId } = req.params;
  const { groupIds = [] } = req.body;

  if (!templateId || !Array.isArray(groupIds) || groupIds.length === 0) {
    return res.status(400).json({ message: 'templateId and groupIds[] are required' });
  }

  try {
    const template = await Template2.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    // Get all clients from the selected groups
    const groupClientDocs = await GroupClients.find({ groupName: { $in: groupIds } })
      .populate({
        path: 'clients',
        select: 'email name'
      })
      .lean();

    const allClients = groupClientDocs.flatMap(gc => gc.clients || []);
    const uniqueClients = Array.from(new Map(allClients.map(c => [c._id.toString(), c])).values());

    if (uniqueClients.length === 0) {
      return res.status(404).json({ message: 'No clients found in selected groups' });
    }

    // Prepare the email content
    const htmlContent = `
      <div style="
        background-color: ${template.backgroundColor || '#ffffff'};
        color: ${template.textColor || '#000000'};
        font-size: ${template.fontSize || 16}px;
        font-weight: ${template.isBold ? 'bold' : 'normal'};
        font-style: ${template.isItalic ? 'italic' : 'normal'};
        padding: 20px;
      ">
        ${template.logo ? `<img src="${template.logo}" alt="Logo" style="max-width: 200px;" />` : ''}
        <h2 style="color: ${template.fontColor || '#000'}">${template.titleHtml || ''}</h2>
        <p>${template.descHtml || ''}</p>
      </div>
    `;

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gpt11032024@gmail.com',
        pass: 'vrsypqwmiganvevf'
      }
    });

    const sendPromises = uniqueClients.map(client => {
      const mailOptions = {
        from: 'gpt11032024@gmail.com',
        to: client.email,
        subject: 'Here’s a new template for you',
        html: htmlContent
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(sendPromises);

    return res.status(200).json({ message: `Template shared to ${uniqueClients.length} clients.` });
  } catch (err) {
    console.error('Error sharing template to groups:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};