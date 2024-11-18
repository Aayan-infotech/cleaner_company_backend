const CategoryItem = require('../models/categoryItemModel');
const Category = require('../models/troubleshootCategoryModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');
const path = require('path');
const fs = require('fs');

// for add new item
exports.createItem = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const { name, partNumber, shortDescription, partDescription } = req.body;

        const category = await Category.findById(categoryId);
        if (!category) {
            return next(createError(404, 'Category not found'));
        }

        const images = [];
        const pdfs = [];
        const videos = [];

        if (req.files) {
            // Process images
            if (req.files.images) {
                req.files.images.forEach(file => {
                    const filename = Date.now() + path.extname(file.originalname);
                    const filepath = path.join(__dirname, '../uploads', filename);

                    try {
                        fs.writeFileSync(filepath, file.buffer);
                        images.push({
                            filename,
                            contentType: file.mimetype
                        });
                    } catch (err) {
                        console.error(`Error saving image file: ${err.message}`);
                        return next(createError(500, 'Error saving image file'));
                    }
                });
            }

            // Process PDFs
            if (req.files.pdfs) {
                req.files.pdfs.forEach(file => {
                    const filename = Date.now() + path.extname(file.originalname);
                    const filepath = path.join(__dirname, '../uploads', filename);

                    try {
                        fs.writeFileSync(filepath, file.buffer);
                        pdfs.push({
                            filename,
                            contentType: file.mimetype
                        });
                    } catch (err) {
                        console.error(`Error saving PDF file: ${err.message}`);
                        return next(createError(500, 'Error saving PDF file'));
                    }
                });
            }

            // Process videos
            if (req.files.videos) {
                req.files.videos.forEach(file => {
                    const filename = Date.now() + path.extname(file.originalname);
                    const filepath = path.join(__dirname, '../uploads', filename);

                    try {
                        fs.writeFileSync(filepath, file.buffer);
                        videos.push({
                            filename,
                            contentType: file.mimetype
                        });
                    } catch (err) {
                        console.error(`Error saving video file: ${err.message}`);
                        return next(createError(500, 'Error saving video file'));
                    }
                });
            }
        }

        const newCategoryItem = new CategoryItem({ name, partNumber, shortDescription, partDescription, images, pdfs, videos });

        const savedCategoryItem = await newCategoryItem.save();

        category.items.push(savedCategoryItem._id);
        await category.save();

        const response = { success: true, status: 200, message: 'Item added successfully',
            data: {
                ...savedCategoryItem.toObject(),
                category: {
                    _id: category._id,
                    categoryName: category.name
                }
            }
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal Server Error!"));
    }
};

// for get all items
exports.getAllItems = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId).populate('items');

        if (!category) {
            return next(createError(404, "Category not found"));
        }

        if (!category.items || category.items.length === 0) {
            return res.status(200).json(createSuccess(200, "No items found", []));
        }

        const itemsWithURLs = category.items.map(item => ({
            ...item.toObject(),
            images: item.images.map(image => ({
                ...image.toObject(),
                url: `${req.protocol}://${req.get('host')}/uploads/${image.filename}`
            })),
            pdfs: item.pdfs.map(pdf => ({
                ...pdf.toObject(),
                url: `${req.protocol}://${req.get('host')}/uploads/${pdf.filename}`
            })),
            videos: item.videos.map(video => ({
                ...video.toObject(),
                url: `${req.protocol}://${req.get('host')}/uploads/${video.filename}`
            }))
        }));

        return res.status(200).json(createSuccess(200, "All Items", itemsWithURLs));
    } catch (err) {
        console.error(err);
        return next(createError(500, "Internal Server Error!"));
    }
};

// for get item by id
exports.getItemById = async (req, res, next) => {
    try {
        const { categoryId, id } = req.params;

        const category = await Category.findById(categoryId).populate({
            path: 'items',
            match: { _id: id }
        });

        if (!category || !category.items.length) {
            return next(createError(404, "Item not found"));
        }

        const item = category.items[0];
        const imagesWithURLs = item.images.map(image => ({
            ...image._doc,
            url: `${req.protocol}://${req.get('host')}/uploads/${image.filename}`
        }));

        const pdfsWithURLs = item.pdfs.map(pdf => ({
            ...pdf._doc,
            url: `${req.protocol}://${req.get('host')}/uploads/${pdf.filename}`
        }));

        const videosWithURLs = item.videos.map(video => ({
            ...video._doc,
            url: `${req.protocol}://${req.get('host')}/uploads/${video.filename}`
        }));

        const itemWithURLs = {
            ...item._doc,
            images: imagesWithURLs,
            pdfs: pdfsWithURLs,
            videos: videosWithURLs
        };

        return res.status(200).json(createSuccess(200, "Single Item found", itemWithURLs));

    } catch (err) {
        console.error(err);
        return next(createError(500, "Internal Server Error!"));
    }
}

// for update item details by id
exports.updateItemById = async (req, res, next) => {
    try {
        const { categoryId, id } = req.params;
        const { name, partNumber, shortDescription, partDescription } = req.body;

        // Find the category
        const category = await Category.findById(categoryId);
        if (!category) {
            return next(createError(404, "Category not found"));
        }

        // Find the item
        const item = await CategoryItem.findById(id);
        if (!item) {
            return next(createError(404, "Item not found"));
        }

        // Handle file uploads if they are present
        let images = item.images;
        let pdfs = item.pdfs;
        let videos = item.videos;

        if (req.files) {
            // Handle images
            if (req.files.images) {
                images.forEach(image => {
                    const filepath = path.join(__dirname, '../uploads', image.filename);
                    if (fs.existsSync(filepath)) {
                        fs.unlinkSync(filepath);
                    }
                });

                images = req.files.images.map(file => {
                    const filename = Date.now() + path.extname(file.originalname);
                    const filepath = path.join(__dirname, '../uploads', filename);

                    fs.writeFileSync(filepath, file.buffer);

                    return {
                        filename,
                        contentType: file.mimetype
                    };
                });
            }

            // Handle PDFs
            if (req.files.pdfs) {
                pdfs.forEach(pdf => {
                    const filepath = path.join(__dirname, '../uploads', pdf.filename);
                    if (fs.existsSync(filepath)) {
                        fs.unlinkSync(filepath);
                    }
                });

                pdfs = req.files.pdfs.map(file => {
                    const filename = Date.now() + path.extname(file.originalname);
                    const filepath = path.join(__dirname, '../uploads', filename);

                    fs.writeFileSync(filepath, file.buffer);

                    return {
                        filename,
                        contentType: file.mimetype
                    };
                });
            }

            // Handle videos
            if (req.files.videos) {
                videos.forEach(video => {
                    const filepath = path.join(__dirname, '../uploads', video.filename);
                    if (fs.existsSync(filepath)) {
                        fs.unlinkSync(filepath);
                    }
                });

                videos = req.files.videos.map(file => {
                    const filename = Date.now() + path.extname(file.originalname);
                    const filepath = path.join(__dirname, '../uploads', filename);

                    fs.writeFileSync(filepath, file.buffer);

                    return {
                        filename,
                        contentType: file.mimetype
                    };
                });
            }
        }

        // Update item details
        item.name = name || item.name;
        item.partNumber = partNumber || item.partNumber;
        item.shortDescription = shortDescription || item.shortDescription;
        item.partDescription = partDescription || item.partDescription;
        item.images = images;
        item.pdfs = pdfs;
        item.videos = videos;

        // Save the updated item
        await item.save();

        return res.status(200).json(createSuccess(200, "Item Details Updated successfully", item));

    } catch (err) {
        console.error(err);
        return next(createError(500, "Internal Server Error!"));
    }
}

// for delete item by id
exports.deleteItemById = async (req, res, next) => {
    try {
        const { categoryId, id } = req.params;

        const deletedItem = await CategoryItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return next(createError(404, "Item not found"));
        }

        deletedItem.images.forEach(image => {
            const filepath = path.join(__dirname, '../uploads', image.filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        });

        const category = await Category.findById(categoryId);
        if (category) {
            category.items = category.items.filter(itemId => !itemId.equals(id));
            await category.save();
        }

        return res.status(200).json(createSuccess(200, "Item deleted successfully", deletedItem));

    } catch (err) {
        console.error(err);
        return next(createError(500, "Internal Server Error!"));
    }
}

// for files
exports.getFile = (req, res) => {
    const filepath = path.join(__dirname, '../uploads', req.params.filename);

    fs.readFile(filepath, (err, data) => {
        if (err) {
            return res.status(404).json({ message: 'The requested file could not be found.' });
        }

        const ext = path.extname(req.params.filename).toLowerCase();
        let contentType = 'application/octet-stream';

        if (ext === '.jpg' || ext === '.jpeg') {
            contentType = 'image/jpeg';
        } else if (ext === '.png') {
            contentType = 'image/png';
        } else if (ext === '.gif') {
            contentType = 'image/gif';
        } else if (ext === '.pdf') {
            contentType = 'application/pdf';
        } else if (ext === '.mp4') {
            contentType = 'video/mp4';
        } else if (ext === '.mkv') {
            contentType = 'video/x-matroska';
        } else if (ext === '.webm') {
            contentType = 'video/webm';
        }

        res.setHeader('Content-Type', contentType);
        res.send(data);
    });
};
