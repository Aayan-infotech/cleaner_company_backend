const Method = require('../models/Method');

exports.getMethods = async (req, res) => {
  try {
    const methods = await Method.find();
    res.json(methods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMethod = async (req, res) => {
  const method = new Method({ name: req.body.name, price: req.body.price });
  try {
    const newMethod = await method.save();
    res.status(201).json(newMethod);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
