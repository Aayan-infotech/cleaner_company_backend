const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const devicetokenSchema = new Schema ({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true,
      },
      token: {
        type: String,
        required: true,
        unique: true, 
      },
});
module.exports = mongoose.model('deviceToken', devicetokenSchema);