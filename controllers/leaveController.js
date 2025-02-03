const Leave = require('../models/leaveModel');
const TimeRecord = require('../models/timeTrackModel');
const Employee = require('../models/employeeManagementModel');
// const Employee = require('../models/userModel') 
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');

exports.applyLeave = async (req, res, next) => {
    try {
        const { employeeId, startDate, endDate } = req.body;

        // Check required fields
        if (!employeeId || !startDate || !endDate) {
            return next(createError(400, "Employee ID, Start Date, and End Date are required."));
        }

        // Check if employee exists
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return next(createError(404, "Employee not found."));
        }

        // Check for overlapping leave
        const existingLeave = await Leave.find({
            employeeId,
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // Leave overlaps
                { startDate: { $gte: startDate }, startDate: { $lte: endDate } },
            ]
        });

        if (existingLeave.length > 0) {
            return next(createError(400, "Leave period overlaps with existing leave."));
        }

        // Apply leave
        const leave = new Leave({ employeeId, startDate, endDate });
        await leave.save();

        // Update leave logs
        await exports.updateLeaveLogs(leave._id);

        return next(createSuccess(200, "Leave applied successfully", leave));
    } catch (error) {
        console.error("Error in applyLeave:", error);
        return next(createError(500, "Internal Server Error!"));
    }
};


exports.updateLeaveLogs = async (leaveId) => {
    try {
        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return;
        }

        const { employeeId, startDate, endDate } = leave;

        const timeRecords = await TimeRecord.find({
            employeeId,
            date: {
                $gte: startDate,
                $lte: endDate,
            }
        });

        for (const record of timeRecords) {
            record.status = 'leave'; 
            record.clockIn = null;
            record.clockOut = null;
            record.morningMeetingStart = null;
            record.morningMeetingEnd = null;
            record.lunchStart = null;
            record.lunchEnd = null;
            record.maintenanceStart = null;
            record.maintenanceEnd = null;
            record.breakStart = null;
            record.breakEnd = null;
            await record.save();
        }

    } catch (error) {
        console.error('Error updating time logs for leave:', error);
    }
};

exports.deleteLeave = async (req, res, next) => {
    const { leaveId } = req.params;

    try {
        const leave = await Leave.findById(leaveId);
        if (!leave) {
            return next(createError(404, "Leave not found"));
        }

        const timeRecords = await TimeRecord.find({
            employeeId: leave.employeeId,
            date: {
                $gte: leave.startDate,
                $lte: leave.endDate,
            }
        });

        for (const record of timeRecords) {
            record.status = 'worked';
            await record.save();
        }

        await leave.deleteOne();

        return next(createSuccess(200, "Leave deleted and time logs reverted."));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};
