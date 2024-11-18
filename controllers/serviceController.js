const Service = require('../models/Service');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).send(err);
  }
};


exports.createService = async (req, res) => {
  const service = new Service(req.body);
  try {
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).send(err);
  }
}