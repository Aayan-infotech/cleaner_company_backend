const ItemClean = require('../models/ItemClean');

exports.createItemClean = async (req, res) => {
  const itemClean = new ItemClean({ 
    name: req.body.name,
    price: req.body.price,
    subItems: req.body.subItems || []
  });

  try {
    const newItemClean = await itemClean.save();
    res.status(201).json(newItemClean);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// exports.createItemClean = async (req, res) => {
//   const itemClean = new ItemClean({ name: req.body.name, price: req.body.price });
//   try {
//     const newItemClean = await itemClean.save();
//     res.status(201).json(newItemClean);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

exports.getItemCleans = async (req, res) => {
  try {
    const itemCleans = await ItemClean.find();
    res.json(itemCleans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


