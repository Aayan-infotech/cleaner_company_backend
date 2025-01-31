const Leave = require('../models/leaveModel')
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

        // Check if the employee has an approved leave on the given date
        const leaveRecord = await Leave.findOne({
            employeeId,
            startDate: { $lte: date },
            endDate: { $gte: date }
        });

        if (leaveRecord) {
            return next(createError(400, "Time log cannot be created as the employee is on leave."));
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

// get all logs by employeeid and date
exports.getAllTimeLogs = async (req, res, next) => {
    try {
        const { employeeId, date } = req.params;
        if (!employeeId || !date) {
            return next(createError(400, "Employee ID and Date are required."));
        }
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        const timeRecords = await TimeRecord.find({
            employeeId: employeeId,
            date: { $gte: startDate, $lt: endDate }
        });

        const leaveRecord = await Leave.findOne({
            employeeId,
            startDate: { $lte: startDate },
            endDate: { $gt: startDate } 
        });

        let records = timeRecords.map(record => ({
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
            status: leaveRecord ? "leave" : record.status, 
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        }));

        if (records.length === 0 && leaveRecord) {
            records.push({
                employeeId,
                date: startDate,
                status: "leave",
                leaveDetails: {
                    leaveId: leaveRecord._id,
                    startDate: leaveRecord.startDate,
                    endDate: leaveRecord.endDate
                }
            });
        }

        return next(createSuccess(200, "Time logs retrieved successfully", records));
    } catch (error) {
        console.error("Error fetching time logs:", error); 
        return next(createError(500, error.message || "Internal Server Error!"));
    }
};




// get all logs of all employee
exports.getAllEmployeeTimeLogs = async (req, res, next) => {
    try {
        const { date } = req.params;
        const startDate = new Date(date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1); 

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

//get employee timelogs by id
exports.getEmployeeTimeLogsById = async (req, res, next) => {
    try {
        const { employeeId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const timeRecords = await TimeRecord.find({ employeeId })
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const leaveRecords = await Leave.find({ employeeId });

        let records = timeRecords.map(record => {
            const leaveForThisDay = leaveRecords.some(leave => {
                const leaveStart = new Date(leave.startDate);
                const leaveEnd = new Date(leave.endDate);
                leaveEnd.setDate(leaveEnd.getDate() - 1); 
                
                return new Date(record.date) >= leaveStart && new Date(record.date) <= leaveEnd;
            });

            return {
                date: record.date,
                status: leaveForThisDay ? "leave" : record.status,
                leaveDetails: leaveForThisDay
                    ? { leaveId: leaveRecords.find(leave => new Date(record.date) >= new Date(leave.startDate) && new Date(record.date) < new Date(leave.endDate))._id, startDate: leaveRecords.find(leave => new Date(record.date) >= new Date(leave.startDate) && new Date(record.date) < new Date(leave.endDate)).startDate, endDate: leaveRecords.find(leave => new Date(record.date) >= new Date(leave.startDate) && new Date(record.date) < new Date(leave.endDate)).endDate }
                    : null,
                timeRecordDetails: {
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
                    createdAt: record.createdAt,
                    updatedAt: record.updatedAt,
                },
            };
        });
//logs with leave also seen
        leaveRecords.forEach(leave => {
            let currentDate = new Date(leave.startDate);
            let adjustedEndDate = new Date(leave.endDate);
            adjustedEndDate.setDate(adjustedEndDate.getDate() - 1); 
            
            while (currentDate <= adjustedEndDate) {
                if (!records.some(r => new Date(r.date).toDateString() === currentDate.toDateString())) {
                    records.push({
                        date: new Date(currentDate),
                        status: "leave",
                        leaveDetails: {
                            leaveId: leave._id,
                            startDate: leave.startDate,
                            endDate: leave.endDate
                        },
                        timeRecordDetails: {} 
                    });
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });
//sort datewise new date first
        records.sort((a, b) => new Date(b.date) - new Date(a.date));

        const totalRecords = timeRecords.length + leaveRecords.length; 
        const totalPages = Math.ceil(totalRecords / limit);

        return res.status(200).json({
            status: "success",
            message: "User details retrieved successfully",
            data: {
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalRecords: totalRecords,
                records: records,
            },
        });
    } catch (error) {
        console.error("Error fetching employee time logs:", error);
        next(createError(500, "Internal Server Error!"));
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
