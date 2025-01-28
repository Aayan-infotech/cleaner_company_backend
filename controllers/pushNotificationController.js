const admin = require('../firebaseConfig');
const Notification = require("../models/pushNotificationModel")
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success');

exports.sendPushNotification = async (req, res) => {
  const {  userId, token, title, body } = req.body; 

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    await admin.messaging().send(message);
   const notificationData= await Notification.create({userId,title,body});
    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Failed to send notification", error });
  }
};


exports.getNotificationsByUserId = async (req, res, next) => {
  const { userId } = req.params; 

  if (!userId) {
    return next(createError(400, "User ID is required."));
  }

  try {
    const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });
    if (notifications.length === 0) {
      return next(createSuccess(200, "No notifications found for this user.", []));
    }

    return next(createSuccess(200, "Notifications fetched successfully.", notifications));
  } catch (error) {
    return next(createError(500, "Internal Server Error."));
  }
};

exports.deleteNotificationById = async (req, res, next) => {
  const { id } = req.params; //notification id to pass in this 

  if (!id) {
    return next(createError(400, "Notification ID is required."));
  }

  try {
    const deletedNotification = await Notification.findByIdAndDelete(id);

    if (!deletedNotification) {
      return next(createError(404, "Notification not found."));
    }

    return next(createSuccess(200, "Notification deleted successfully.", deletedNotification));
  } catch (error) {
    return next(createError(500, "Internal Server Error."));
  }
};