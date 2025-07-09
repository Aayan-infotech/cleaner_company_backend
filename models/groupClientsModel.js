const mongoose = require('mongoose');

const groupClientsSchema = new mongoose.Schema({
  groupName: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,},
    clients:
     [
        { 
            type: mongoose.Schema.Types.ObjectId,
             ref: 'CRM' 
            }
    ]
}, { timestamps: true });
module.exports = mongoose.model('GroupClients', groupClientsSchema);