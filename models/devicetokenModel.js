const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const devicetokenSchema = new Schema ({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', 
        required: true,
      },
      token: {
        type: String,
        required: true
      },
});
module.exports = mongoose.model('deviceToken', devicetokenSchema);