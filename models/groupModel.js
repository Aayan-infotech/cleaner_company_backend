const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    groupName: { type: String, required: true },
    clients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CRM",
            required: true
        }
    ],
}, { timestamps: true });
module.exports = mongoose.model("Group", groupSchema);
