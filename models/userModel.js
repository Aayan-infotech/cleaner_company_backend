const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const defaultImage = {
    filename: 'default-image.jpg',
    contentType: 'image/png'
  };
  
const imageSchema1 = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true }
  });

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        contactNumber: {
            type: Number,
            required: false
        },
        images: {
            type: [imageSchema1],
            default: [defaultImage]
          },

        companyAddress: {
            type: String,
            required: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        otp: { type: String },
        otpExpiration: { type: Date },   
        roles: {
            type: [Schema.Types.ObjectId],
            required: true,
            ref: "Role"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', UserSchema);