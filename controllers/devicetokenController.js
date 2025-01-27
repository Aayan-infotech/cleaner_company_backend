const DeviceToken = require('../models/devicetokenModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');

const createDeviceToken = async (req, res, next) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return next(createError(400, "userId and token are required."));
    }

    const existingToken = await DeviceToken.findOne({ token });

    if (existingToken && existingToken.userId.toString() !== userId) {
      return next(createError(400, "Token is already used for another user."));
    }

    const updatedToken = await DeviceToken.findOneAndUpdate(
      { userId }, 
      { token }, 
      { new: true, upsert: true } 
    );

    return next(createSuccess(201, "Device Token created/updated successfully.", updatedToken));
  } catch (error) {
    console.error("Error creating/updating device token:", error);
    return next(createError(500, "Internal Server Error."));
  }
};

const getAllDeviceTokens = async (req, res, next) => {
  try {
    const deviceTokens = await DeviceToken.find();
    return next(createSuccess(200, "All Device Tokens", deviceTokens));
  } catch (error) {
    console.error("Error in getAllDeviceTokens:", error);
    return next(createError(500, "Internal Server Error."));
  }
};

module.exports = {
  createDeviceToken,
  getAllDeviceTokens,
};
