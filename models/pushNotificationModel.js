const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pushNotificationSchema = new Schema(
  {
    employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee', 
            required: true,
          },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } 

);

module.exports = mongoose.model('PushNotification', pushNotificationSchema);
