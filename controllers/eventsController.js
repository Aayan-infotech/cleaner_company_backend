const Event = require('../models/eventsModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');
const User = require('../models/userModel');


// Create a new event
const createEvent = async (req, res, next) => {
  try {
    const { title, date, startTime, endTime, description, employeeName, clientName, clientEmail, address, clientContact,eventType } = req.body;

    // Generate a random jobId with the format J-XXXX
    const generateJobId = () => {
      const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
      return `J-${randomNumber}`;
    };

    const jobId = generateJobId();

    const newEvent = new Event({ title, date, startTime, endTime, description, employeeName, jobId, clientName, clientEmail, address, clientContact,eventType, status: 'pending' });
    await newEvent.save();
 
    const populatedEvent = await Event.findById(newEvent._id);

    return res.status(200).json(createSuccess(200, "Event Registered Successfully", populatedEvent));

  } catch (error) {
    console.error("Error in createEvent:", error);
    return next(createError(500, "Failed to register event"));
  }
};

// Get all events
const getAllEvents = async (req, res, next) => {
  try {
    const allEvents = await Event.find() // Populate user details
    return res.status(200).json(createSuccess(200, "All Events", allEvents));
  }
  catch (error) {
    return next(createError(500, "Failed to fetch events"));
  }
};

// Get event by ID
const getEventById = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate('Employee');  // Populate user details
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
    const { title, date, startTime, endTime, description, employeeName, jobId, clientName, clientEmail, address,clientContact, status,eventType } = req.body;
   
    const updatedEvent = await Event.findByIdAndUpdate( eventId,
      { title, date, startTime, endTime, description, employeeName, jobId, clientName, clientEmail, address,clientContact, status,eventType},
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json(createError(404, "Event not found"));
    }

    return res.status(200).json(createSuccess(200, "Event updated successfully", updatedEvent));
  } catch (error) {
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


module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent, getEventsByEmployeeName };

