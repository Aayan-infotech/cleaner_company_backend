const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeRecordSchema = new Schema(
    {
        eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
        employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
        date: { type: Date, required: true },
        clockIn: Date,
        breakStart: Date,
        breakEnd: Date,
        lunchStart: Date,
        lunchEnd: Date,
        morningMeetingStart: Date,
        morningMeetingEnd: Date,
        maintenanceStart: Date,
        maintenanceEnd: Date,
        clockOut: Date,
        notes: String,
        // status: { type: String, enum: ['complete', 'inprogress', 'pending'], default: 'pending' }  
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('TimeRecord', timeRecordSchema);