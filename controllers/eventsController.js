const Event = require('../models/eventsModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');
const User = require('../models/userModel');
const Employee = require('../models/employeeManagementModel'); // Needed for nested population (optional)
const Van = require('../models/vanModel');  

// Create a new event
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      date,
      startTime,
      endTime,
      description,
      employeeName,
      employeeId, 
      clientName,
      clientEmail,
      address,
      clientContact,
      eventType,
      lat,
      lng
    } = req.body;

    // Generate a random jobId with the format J-XXXX
    const generateJobId = () => {
      const randomNumber = Math.floor(1000 + Math.random() * 9000);
      return `J-${randomNumber}`;
    };

    const jobId = generateJobId();

    const newEvent = new Event({
      title,
      date,
      startTime,
      endTime,
      description,
      employeeName,
      employeeId, 
      jobId,
      clientName,
      clientEmail,
      address,
      clientContact,
      eventType,
      status: 'pending',
      lat,
      lng
    });

    await newEvent.save();
    const populatedEvent = await Event.findById(newEvent._id).populate('employeeId');

    return res.status(200).json(createSuccess(200, "Event Registered Successfully", populatedEvent));
  } catch (error) {
    console.error("Error in createEvent:", error);
    return next(createError(500, "Failed to register event"));
  }
};


// Get all events
const getAllEvents = async (req, res, next) => {
  try {
    const allEvents = await Event.find()
      .sort({ createdAt: -1 }) 
      .populate({
        path: 'employeeId',
        populate: {
          path: 'employee_vanAssigned',  
          model: 'Van'
        }
      });

    return res.status(200).json(createSuccess(200, "All Events", allEvents));
  } catch (error) {
    console.error("Error in getAllEvents:", error);
    return next(createError(500, "Failed to fetch events"));
  }
};

// Get event by ID
const getEventById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const event = await Event.findById(id).populate({
      path: 'employeeId',
      populate: {
        path: 'employee_vanAssigned',  
        model: 'Van'
      }
    });  // Populate user details
    if (!event) {
      return res.status(404).json(createError(404, "Event not found"));
    }
    return res.status(200).json(createSuccess(200, "Single Event", event));
  } catch (error) {
    return next(createError(500, "Failed to fetch event details"));
  }
};

// Update event by ID
const updateEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const {
      title,
      date,
      startTime,
      endTime,
      description,
      employeeName,
      employeeId, 
      jobId,
      clientName,
      clientEmail,
      address,
      clientContact,
      status,
      eventType,
      lat,
      lng
    } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title,
        date,
        startTime,
        endTime,
        description,
        employeeName,
        employeeId, 
        jobId,
        clientName,
        clientEmail,
        address,
        clientContact,
        status,
        eventType,
        lat,
        lng
      },
      { new: true }
    ).populate('employeeId');

    if (!updatedEvent) {
      return res.status(404).json(createError(404, "Event not found"));
    }

    return res.status(200).json(createSuccess(200, "Event updated successfully", updatedEvent));
  } catch (error) {
    console.error("Error in updateEvent:", error);
    return next(createError(500, "Failed to update event"));
  }
};


// Delete event by ID
const deleteEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json(createError(404, "Event not found"));
    }
    return res.status(200).json(createSuccess(200, "Event deleted successfully", deletedEvent));
  } catch (error) {
    return next(createError(500, "Failed to delete event"));
  }
};

// Get events by userName
const getEventsByEmployeeName = async (req, res, next) => {
  try {
    const employeeName = req.params.employeeName;  // Extract userName from request params
    const events = await Event.find({ employeeName });  // Query events by userName

    if (events.length === 0) {
      return res.status(404).json(createError(404, "No events found for this Employee"));
    }

    return res.status(200).json(createSuccess(200, "Events fetched successfully", events));
  } catch (error) {
    return next(createError(500, "Failed to fetch events"));
  }
};


//current date Event 

const getAllCurrentEvents = async (req, res, next) => {
  try {
    const startOfDay = new Date().setUTCHours(0, 0, 0, 0); // 00:00:00 UTC
    const endOfDay = new Date().setUTCHours(23, 59, 59, 999); // 23:59:59 UTC

    const { status } = req.query;
    const query = {
      date: {
        $gte: new Date(startOfDay),
        $lte: new Date(endOfDay),
      },
    };

    if (status) {
      query.status = status;
    }

    const currentEvents = await Event.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: 'employeeId',
        populate: {
          path: 'employee_vanAssigned',
          model: 'Van',
        },
      });

    if (!currentEvents || currentEvents.length === 0) {
      return res.status(404).json(createError(404, "No events found for the current date"));
    }

    // Return the current day's events
    return res.status(200).json(createSuccess(200, "Current Day Events", currentEvents));
  } catch (error) {
    console.error("Error in getAllCurrentEvents:", error);
    return next(createError(500, "Failed to fetch current day events"));
  }
};

// past jobs Events

const getAllPastEvents = async (req, res, next) => {
  try {
    const startOfDay = new Date().setUTCHours(0, 0, 0, 0); // 00:00:00 UTC

    const { status } = req.query;

    const query = {
      date: {
        $lt: new Date(startOfDay), // Dates less than the start of the current day
      },
    };

    if (status) {
      query.status = status;
    }

    const pastEvents = await Event.find(query)
      .sort({ date: -1 }) 
      .populate({
        path: 'employeeId',
        populate: {
          path: 'employee_vanAssigned',
          model: 'Van',
        },
      });

    if (!pastEvents || pastEvents.length === 0) {
      return res.status(404).json(createError(404, "No past events found"));
    }

    // Return the past events
    return res.status(200).json(createSuccess(200, "Past Events", pastEvents));
  } catch (error) {
    console.error("Error in getAllPastEvents:", error);
    return next(createError(500, "Failed to fetch past events"));
  }
};

const getJobIdsWhoseEventTypeIsJob = async (req, res, next) => {
  try {
    const jobEvents = await Event.find({ eventType: 'Job' }).select('_id jobId title');

    if (!jobEvents || jobEvents.length === 0) {
      return res.status(404).json(createError(404, "No job events found"));
    }

    const jobData = jobEvents.map(event => ({
      _id: event._id,
      jobId: event.jobId,
      title: event.title
    }));

    return res.status(200).json(createSuccess(200, "Job IDs fetched successfully", jobData));
  } catch (error) {
    console.error("Error in getJobIdsWhoseEventTypeIsJob:", error.message);
    return next(createError(500, "Failed to fetch job IDs"));
  }
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent, getEventsByEmployeeName,getAllCurrentEvents,getAllPastEvents,getJobIdsWhoseEventTypeIsJob };

