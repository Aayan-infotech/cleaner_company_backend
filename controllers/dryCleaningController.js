const DryCleaning = require('../models/DryCleaning');

exports.getDryCleanings = async (req, res) => {
  try {
    const dryCleanings = await DryCleaning.find();
    res.json(dryCleanings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDryCleaning = async (req, res) => {
  const dryCleaning = new DryCleaning({ name: req.body.name, price: req.body.price });
  try {
    const newDryCleaning = await dryCleaning.save();
    res.status(201).json(newDryCleaning);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
