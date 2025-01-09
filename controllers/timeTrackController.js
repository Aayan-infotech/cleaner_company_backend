const TimeRecord = require('../models/timeTrackModel');
const Event = require('../models/eventsModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');


// create new 
exports.createTimeRecord = async (req, res, next) => {
    const { eventId, employeeId, date, clockIn } = req.body;

    try {
        if (!eventId || !employeeId || !date) {
            return next(createError(400, "Event ID, Employee ID, and Date are required."));
        }

        // Create and save the TimeRecord
        const timeRecord = new TimeRecord({ eventId, employeeId, date, clockIn });
        await timeRecord.save();

        // Fetch and populate the TimeRecord
        const populatedTimeRecord = await TimeRecord.findById(timeRecord._id)
            .populate({
                path: 'eventId',
                select: 'title date startTime endTime description jobId clientName clientEmail clientContact address'
            })
            .exec();

        return next(createSuccess(200, "Time record created successfully.", populatedTimeRecord));

    } catch (error) {
        console.error("Error during time record creation:", error.message, error.stack);
        return next(createError(500, "Internal Server Error!"));
    }
};

// update details by id
exports.updateTimeRecord = async (req, res, next) => {
    const { timeRecordId } = req.params;
    const updateData = req.body;
    try {
        const timeRecord = await TimeRecord.findByIdAndUpdate(timeRecordId, updateData, { new: true });

        if (!timeRecord) {
            return next(createError(404, "Record not found"));
        }

        return next(createSuccess(200, "Time record updated successfully", timeRecord));

    } catch (err) {
        return next(createError(500, "Internal Server Error!"));
    }
};

// get all logs
exports.getAllTimeLogs = async (req, res, next) => {
    try {
        const { employeeId, date } = req.params;
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);  // To cover the full day

        // Find time records for the employee on the specified date
        const timeRecords = await TimeRecord.find({
            employeeId: employeeId,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        let totalWorkingTimeMs = 0;
        let totalBreakTimeMs = 0;
        let totalMorningMeetingTimeMs = 0;
        let totalLunchTimeMs = 0;
        let totalMaintenanceTimeMs = 0;

        timeRecords.forEach(record => {
            const clockIn = new Date(record.clockIn);
            const clockOut = record.clockOut ? new Date(record.clockOut) : null;
            const morningMeetingStart = record.morningMeetingStart ? new Date(record.morningMeetingStart) : null;
            const morningMeetingEnd = record.morningMeetingEnd ? new Date(record.morningMeetingEnd) : null;
            const lunchStart = record.lunchStart ? new Date(record.lunchStart) : null;
            const lunchEnd = record.lunchEnd ? new Date(record.lunchEnd) : null;
            const maintenanceStart = record.maintenanceStart ? new Date(record.maintenanceStart) : null;
            const maintenanceEnd = record.maintenanceEnd ? new Date(record.maintenanceEnd) : null;
            const breakStart = record.breakStart ? new Date(record.breakStart) : null;
            const breakEnd = record.breakEnd ? new Date(record.breakEnd) : null;

            // Calculate total working time
            if (clockIn && clockOut) {
                totalWorkingTimeMs += (clockOut - clockIn);
            }

            // Calculate total break time
            if (breakStart && breakEnd) {
                totalBreakTimeMs += (breakEnd - breakStart);
            }

            // Calculate total morning meeting time
            if (morningMeetingStart && morningMeetingEnd) {
                totalMorningMeetingTimeMs += (morningMeetingEnd - morningMeetingStart);
            }

            // Calculate total lunch time
            if (lunchStart && lunchEnd) {
                totalLunchTimeMs += (lunchEnd - lunchStart);
            }

            // Calculate total maintenance time
            if (maintenanceStart && maintenanceEnd) {
                totalMaintenanceTimeMs += (maintenanceEnd - maintenanceStart);
            }
        });

        // Convert milliseconds to hours and minutes
        const convertMsToHM = (ms) => {
            const totalMinutes = Math.floor(ms / (1000 * 60));
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return { hours, minutes };
        };

        const totalWorkingTimeHM = convertMsToHM(totalWorkingTimeMs);
        const totalBreakTimeHM = convertMsToHM(totalBreakTimeMs);
        const totalMorningMeetingTimeHM = convertMsToHM(totalMorningMeetingTimeMs);
        const totalLunchTimeHM = convertMsToHM(totalLunchTimeMs);
        const totalMaintenanceTimeHM = convertMsToHM(totalMaintenanceTimeMs);

        // Calculate Total Productive Time
        const totalWorkingMinutes = totalWorkingTimeHM.hours * 60 + totalWorkingTimeHM.minutes;
        const totalBreakMinutes = totalBreakTimeHM.hours * 60 + totalBreakTimeHM.minutes;
        const totalMorningMeetingMinutes = totalMorningMeetingTimeHM.hours * 60 + totalMorningMeetingTimeHM.minutes;
        const totalLunchMinutes = totalLunchTimeHM.hours * 60 + totalLunchTimeHM.minutes;
        const totalMaintenanceMinutes = totalMaintenanceTimeHM.hours * 60 + totalMaintenanceTimeHM.minutes;

        const totalNonProductiveMinutes = totalBreakMinutes + totalMorningMeetingMinutes + totalLunchMinutes + totalMaintenanceMinutes;
        const totalProductiveMinutes = totalWorkingMinutes - totalNonProductiveMinutes;

        const totalProductiveTimeHM = convertMsToHM(totalProductiveMinutes * 60 * 1000); // Convert back to ms

        return next(createSuccess(200, "Time logs retrieved successfully", {
            totalWorkingTime: `${totalWorkingTimeHM.hours}h ${totalWorkingTimeHM.minutes}m`,
            totalMorningMeetingTime: `${totalMorningMeetingTimeHM.hours}h ${totalMorningMeetingTimeHM.minutes}m`,
            totalLunchTime: `${totalLunchTimeHM.hours}h ${totalLunchTimeHM.minutes}m`,
            totalBreakTime: `${totalBreakTimeHM.hours}h ${totalBreakTimeHM.minutes}m`,
            totalMaintenanceTime: `${totalMaintenanceTimeHM.hours}h ${totalMaintenanceTimeHM.minutes}m`,
            totalProductiveTime: `${totalProductiveTimeHM.hours}h ${totalProductiveTimeHM.minutes}m`,
            timeRecords: timeRecords.map(record => ({
                _id: record._id,
                eventId: record.eventId,
                employeeId: record.employeeId,
                date: record.date,
                clockIn: record.clockIn,
                morningMeetingStart: record.morningMeetingStart,
                morningMeetingEnd: record.morningMeetingEnd,
                lunchStart: record.lunchStart,
                lunchEnd: record.lunchEnd,
                maintenanceStart: record.maintenanceStart,
                maintenanceEnd: record.maintenanceEnd,
                breakStart: record.breakStart,
                breakEnd: record.breakEnd,
                clockOut: record.clockOut,
                status: record.status,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
            }))
        }));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};

// get all logs of all employee
exports.getAllEmployeeTimeLogs = async (req, res, next) => {
    try {
        const { date } = req.params;
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);  // To cover the full day

        // Find all time records on the specified date
        const timeRecords = await TimeRecord.find({
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        // Aggregate time records by employeeId
        const aggregatedLogs = {};

        timeRecords.forEach(record => {
            const employeeId = record.employeeId.toString(); // Ensure employeeId is a string for consistent key usage

            if (!aggregatedLogs[employeeId]) {
                aggregatedLogs[employeeId] = {
                    totalWorkingTimeMs: 0
                };
            }

            const clockIn = new Date(record.clockIn);
            const clockOut = record.clockOut ? new Date(record.clockOut) : null;

            if (clockIn && clockOut) {
                aggregatedLogs[employeeId].totalWorkingTimeMs += (clockOut - clockIn);
            }
        });

        // Convert milliseconds to hours and minutes
        const convertMsToHM = (ms) => {
            const totalMinutes = Math.floor(ms / (1000 * 60));
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return { hours, minutes };
        };

        // Prepare the response data
        const responseData = Object.keys(aggregatedLogs).map(employeeId => {
            const { totalWorkingTimeMs } = aggregatedLogs[employeeId];
            const totalWorkingTimeHM = convertMsToHM(totalWorkingTimeMs);

            return {
                employeeId,
                totalWorkingTime: `${totalWorkingTimeHM.hours}h ${totalWorkingTimeHM.minutes}m`
            };
        });

        return next(createSuccess(200, "All logs retrieved successfully", responseData));
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal Server Error!"));
    }
};

// delete log by id
exports.deleteEmployeeLogsByDate = async (req, res, next) => {
    const { employeeId, date } = req.params;

    try {
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);  // To cover the full day

        // Delete time records for the specified employee on the given date
        const result = await TimeRecord.deleteMany({
            employeeId: employeeId,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        if (result.deletedCount === 0) {
            return next(createError(404, "No logs found for the specified date"));
        }
        
        return next(createSuccess(200, "Logs deleted successfully"));

    } catch (err) {
        console.error(err);
        return next(createError(500, "Internal Server Error!"))
    }
};
