const Contact = require('../models/contactUsModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');

// create Contact Us
exports.createContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({ name, email, message });
    await newContact.save();
    
    return next(createSuccess(200, "Contact message created successfully", newContact));
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

// Function to handle fetching all contact messages
exports.getAllContacts = async (req, res, next) => {
  try {
    const allContacts = await Contact.find();

    return next(createSuccess(200, "All Contact messages", allContacts));
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};

// Function to handle deleting a contact message by ID
exports.deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);

    return next(createSuccess(200, 'Contact message deleted successfully'));
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};
