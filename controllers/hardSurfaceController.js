
const HardSurface = require('../models/HardSurface');

exports.getHardSurfaces = async (req, res) => {
  try {
    const hardSurfaces = await HardSurface.find();
    res.json(hardSurfaces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createHardSurface = async (req, res) => {
  const hardSurface = new HardSurface({ name: req.body.name, price: req.body.price });
  try {
    const newHardSurface = await hardSurface.save();
    res.status(201).json(newHardSurface);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
