const Material = require('../models/Material');

exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (err) {
    res.status(500).send(err);
  }
  
};

exports.createMaterial = async (req, res) => {
  const material = new Material(req.body);
  try {
    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(400).send(err);
  }
};
