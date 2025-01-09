// controllers/productController.js
const Product = require('../models/Image');
const path = require('path');
const fs = require('fs');

exports.uploadProduct = async (req, res) => {
  try {
    const { productName } = req.body;

    if (!productName) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const images = req.files.map(file => {
      const filename = Date.now() + path.extname(file.originalname);
      const filepath = path.join(__dirname, '../uploads', filename);

      fs.writeFileSync(filepath, file.buffer); // Save the file to the filesystem

      return {
        filename,
        contentType: file.mimetype
      };
    });

    const product = new Product({
      productName,
      images
    });

    await product.save();

    res.status(201).json({ message: 'Product uploaded successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const productsWithImageURLs = products.map(product => {
      const imagesWithURLs = product.images.map(image => {
        return {
          ...image._doc,
          url: `${req.protocol}://${req.get('host')}/api/images/${image.filename}`
        };
      });

      return {
        ...product._doc,
        images: imagesWithURLs
      };
    });

    res.status(200).json(productsWithImageURLs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getImage = (req, res) => {
  const filepath = path.join(__dirname, '../uploads', req.params.filename);
  fs.readFile(filepath, (err, data) => {
    if (err) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const image = data;
    const mimeType = req.params.filename.split('.').pop();
    res.setHeader('Content-Type', `image/${mimeType}`);
    res.send(image);
  });
};

