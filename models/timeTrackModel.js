const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeRecordSchema = new Schema(
    {
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
        status: { type: String, enum: ['worked', 'leave'], default: 'worked' },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('TimeRecord', timeRecordSchema);