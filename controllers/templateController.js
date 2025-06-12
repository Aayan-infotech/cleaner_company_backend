const Template = require('../models/templateModel');
const mongoose = require('mongoose');
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");

exports.createTemplate = async (req, res, next) => {
  try {
    // If sender used JSON, html might be in req.body.html
    // Otherwise (text mode) it's the entire body
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
      .map(t => `<section>${t.html}</section>`)
      .join('<hr>');
    res.set('Content-Type', 'text/html');
    return res.send(combinedHtml);
  } catch (err) {
    console.error("getAllTemplates error:", err);
    return next(createError(500, "Internal Server Error"));
  }
};