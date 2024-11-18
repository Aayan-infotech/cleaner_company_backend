const Room = require('../models/Room');

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).send(err);
  }
  
};
exports.createRoom = async (req, res) => {
  const room = new Room(req.body);
  try {
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(400).send(err);
  }
};
