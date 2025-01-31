const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userTokenSchema = mongoose.Schema(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref:"Employee"
        },
        token: {
            type: String,
            required: true
        },
        createdAt:{
            type: Date,
            default: Date.now,
            expires: 300
        }
    }
);

module.exports = mongoose.model('UserToken', userTokenSchema); 