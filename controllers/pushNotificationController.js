const admin = require('../firebaseConfig');

exports.sendPushNotification = async (req, res) => {
  const { token, title, body } = req.body; // Token of the mobile device, notification title, and body

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    await admin.messaging().send(message);
    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Failed to send notification", error });
  }
};
