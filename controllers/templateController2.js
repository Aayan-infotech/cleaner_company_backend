const Template2 = require("../models/templateModel2");
const Category = require("../models/categoryModel");
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");
const CRM = require("../models/crmModel");
const GroupClients = require("../models/groupClientsModel");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

exports.createTemplate = async (req, res, next) => {
  try {
    const {
      titleHtml,
      descHtml,
      titleFontFamily,
      titleFontSize,
      titleFontColor,
      titleisBold,
      titleisItalic,
      desFontColor,
      backgroundColor,
      categoryId,
    } = req.body;

    let logos = [];

    // Handle uploaded logos
    if (req.files && req.files.length > 0) {
      logos = req.files.map((file) => {
        const filename = Date.now() + "-" + file.originalname;
        const filepath = path.join(__dirname, "../uploads", filename);
        fs.writeFileSync(filepath, file.buffer); // Save the file to disk

        return {
          filename,
          contentType: file.mimetype,
        };
      });
    }

    const newTemplate = new Template2({
      logo: logos,
      titleHtml,
      descHtml,
      titleFontFamily,
      titleFontSize,
      titleFontColor,
      titleisBold,
      titleisItalic,
      desFontColor,
      backgroundColor,
      ...(categoryId && categoryId !== "" && { categoryId }),
    });

    await newTemplate.save();
    return next(createSuccess(201, "Template created", newTemplate));
  } catch (error) {
    console.error("Error Create Template", error);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.getAllTemplates = async (req, res, next) => {
  try {
    const templates = await Template2.find()
      .populate("categoryId")
      .sort({ createdAt: -1 });

    const templatesWithLogoURLs = templates.map((template) => {
      const logosWithURLs = (template.logo || []).map((image) => ({
        ...image._doc,
        url: `${req.protocol}://${req.get("host")}/uploads/${image.filename}`,
      }));

      return {
        ...template._doc,
        logo: logosWithURLs,
      };
    });

    return next(
      createSuccess(200, "All templates fetched successfully", {
        totalCount: templates.length,
        templates: templatesWithLogoURLs,
      })
    );
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

    const template = await Template2.findById(id);
    if (!template) {
      return next(createError(404, "Template not found"));
    }

    // Generate URLs for logo images
    const logosWithURLs = (template.logo || []).map((image) => ({
      ...image._doc,
      url: `${req.protocol}://${req.get("host")}/uploads/${image.filename}`,
    }));

    return next(
      createSuccess(200, "Template fetched successfully", {
        ...template._doc,
        logo: logosWithURLs,
      })
    );
  } catch (error) {
    console.error("Error Get Template", error);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      titleHtml,
      descHtml,
      titleFontFamily,
      titleFontSize,
      titleFontColor,
      titleisBold,
      titleisItalic,
      desFontColor,
      backgroundColor,
      categoryId,
    } = req.body;

    const template = await Template2.findById(id);
    if (!template) {
      return next(createError(404, "Template not found"));
    }

    // ✅ Update fields conditionally
    if (titleHtml) template.titleHtml = titleHtml;
    if (descHtml) template.descHtml = descHtml;
    if (titleFontFamily) template.titleFontFamily = titleFontFamily;
    if (titleFontSize) template.titleFontSize = Number(titleFontSize);
    if (titleFontColor) template.titleFontColor = titleFontColor;
    if (desFontColor) template.desFontColor = desFontColor;
    if (backgroundColor) template.backgroundColor = backgroundColor;
    if (categoryId && categoryId !== "") template.categoryId = categoryId;
    template.titleisBold = titleisBold === "true" || titleisBold === true;
    template.titleisItalic = titleisItalic === "true" || titleisItalic === true;

    // ✅ Handle logo re-upload
    if (req.files && req.files.length > 0) {
      const logos = req.files.map((file) => {
        const filename = Date.now() + "-" + file.originalname;
        const filepath = path.join(__dirname, "../uploads", filename);
        fs.writeFileSync(filepath, file.buffer);

        return {
          filename,
          contentType: file.mimetype,
        };
      });

      template.logo = logos; // Replace existing logos
    }

    await template.save();

    return next(createSuccess(200, "Template updated successfully", template));
  } catch (error) {
    console.error("Error Update Template", error);
    return next(createError(500, "Internal Server Error"));
  }
};

exports.deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(createError(400, "Template ID is required"));
    }

    const templateExists = await Template2.findByIdAndDelete(id);
    if (!templateExists) {
      return next(createError(404, "Template not found"));
    }

    return next(createSuccess(200, "Template deleted successfully"));
  } catch (error) {
    console.error("Error deleting template:", error);
    return next(createError(500, "Internal Server Error"));
  }
};

// Share template to clients
exports.shareTemplateToClients = async (req, res) => {
  const { templateId } = req.params;
  const { clientIds } = req.body;

  try {
    const template = await Template2.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const clients = await CRM.find({ _id: { $in: clientIds } });

    if (clients.length === 0) {
      return res.status(404).json({ message: "No valid clients found" });
    }

    const logoUrl = template.logo?.[0]?.filename
      ? `http://98.82.228.18:5966/uploads/${template.logo[0].filename}`
      : null;


    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Template Email</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: ${template.backgroundColor || "#8000b0"};
            font-family: ${template.titleFontFamily || "Arial, sans-serif"};
          }
          .container {
            width: 100%;
            max-width: 500px;
            margin: auto;
            background-color: ${template.backgroundColor || "#8000b0"};
            padding: 20px;
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo img {
            max-width: 200px;
            border: 2px solid white;
            display: block;
            margin: 0 auto;
          }
          .title {
            background-color: #ffffff;
            color: ${template.titleFontColor || "#000000"};
            font-family: ${template.titleFontFamily };
            font-weight: ${template.titleisBold ? "bold" : "normal"};
            font-style: ${template.titleisItalic ? "italic" : "normal"};
            font-size: ${template.titleFontSize || 20}px;
            text-align: center;
            padding: 12px 20px;
            margin-bottom: 10px;
          }
          .description {
            background-color: #ffffff;
            color: ${template.desFontColor || "#333333"};
            padding: 20px;
            font-size: 16px;
            line-height: 1.5;
            text-align: center;
            min-height: 200px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${
            logoUrl
              ? `<div class="logo"><img src="${logoUrl}" alt="Logo" /></div>`
              : ""
          }
          <div class="title">${template.titleHtml || ""}</div>
          <div class="description">${template.descHtml || ""}</div>
        </div>
      </body>
      </html>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gpt11032024@gmail.com",
        pass: "vrsypqwmiganvevf",
      },
    });

    // Send email to each client
    for (const client of clients) {
      const mailOptions = {
        from: "gpt11032024@gmail.com",
        to: client.email,
        subject: "Here’s a new template for you",
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);
    }

    return res.json({
      message: "Template shared with all clients successfully",
    });
  } catch (error) {
    console.error("Error sharing template:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Share Template to Groups
exports.shareTemplateToGroups = async (req, res) => {
  const { templateId } = req.params;
  const { groupIds = [] } = req.body;

  if (!templateId || !Array.isArray(groupIds) || groupIds.length === 0) {
    return res
      .status(400)
      .json({ message: "templateId and groupIds[] are required" });
  }

  try {
    const template = await Template2.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Get all clients from the selected groups
    const groupClientDocs = await GroupClients.find({
      groupName: { $in: groupIds },
    })
      .populate({
        path: "clients",
        select: "email name",
      })
      .lean();

    const allClients = groupClientDocs.flatMap((gc) => gc.clients || []);
    const uniqueClients = Array.from(
      new Map(allClients.map((c) => [c._id.toString(), c])).values()
    );

    if (uniqueClients.length === 0) {
      return res
        .status(404)
        .json({ message: "No clients found in selected groups" });
    }

    // Resolve logo URL
    const logoUrl = template.logo?.[0]?.filename
      ? `http://98.82.228.18:5966/uploads/${template.logo[0].filename}`
      : null;

    // Build HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Template Email</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: ${template.backgroundColor || "#8000b0"};
            font-family: ${template.titleFontFamily || "Arial, sans-serif"};
          }
          .container {
            width: 100%;
            max-width: 500px;
            margin: auto;
            background-color: ${template.backgroundColor || "#8000b0"};
            padding: 20px;
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo img {
            max-width: 200px;
            border: 2px solid white;
            display: block;
            margin: 0 auto;
          }
          .title {
            background-color: #ffffff;
            color: ${template.titleFontColor || "#000000"};
            font-family: ${template.titleFontFamily};
            font-weight: ${template.titleisBold ? "bold" : "normal"};
            font-style: ${template.titleisItalic ? "italic" : "normal"};
            font-size: ${template.titleFontSize || 20}px;
            text-align: center;
            padding: 12px 20px;
            margin-bottom: 10px;
          }
          .description {
            background-color: #ffffff;
            color: ${template.desFontColor || "#333333"};
            padding: 20px;
            font-size: 16px;
            line-height: 1.5;
            text-align: center;
            min-height: 200px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${
            logoUrl
              ? `<div class="logo"><img src="${logoUrl}" alt="Logo" /></div>`
              : ""
          }
          <div class="title">${template.titleHtml || ""}</div>
          <div class="description">${template.descHtml || ""}</div>
        </div>
      </body>
      </html>
    `;

    // Setup Nodemailer
    const transporter = require("nodemailer").createTransport({
      service: "gmail",
      auth: {
        user: "gpt11032024@gmail.com",
        pass: "vrsypqwmiganvevf",
      },
    });

    // Send emails
    for (const client of uniqueClients) {
      const mailOptions = {
        from: "gpt11032024@gmail.com",
        to: client.email,
        subject: "Here’s a new template for you",
        html: htmlContent,
      };
      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json({
      message: `Template shared with ${uniqueClients.length} clients in groups successfully`,
    });
  } catch (err) {
    console.error("Error sharing template to groups:", err);
    return res.status(500).json({ message: "Server error" });
  }
};