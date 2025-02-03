const mongoose = require('mongoose');

const calSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        startTime: { type: String, required: false },
        endTime: { type: String, required: false },
        description: { type: String, required: false },
        employeeName: { type: String, required: false },
        jobId: { type: String, required: true, unique: true },
        clientName: { type: String, required: false },
        clientEmail: { type: String, required: false },
        clientContact: { type: String, required: false },
        address: { type: String, required: false },        
        status: { type: String, enum: ['complete', 'inprogress', 'pending'], default: 'pending' }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Event', calSchema);
