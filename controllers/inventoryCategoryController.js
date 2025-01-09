const InventoryCategory = require('../models/inventoryCategoryModel')
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success');

// inventory category
exports.addInventoryCategory = async (req, res, next) => {
    try {
        const { categoryName } = req.body;
      
        if (!categoryName) {
            return res.status(400).json({ message: 'Category name is required.' });
        }

        const newCategory = new InventoryCategory({ categoryName });
        await newCategory.save();

        return next(createSuccess(200, "Inventory Category Added Successfully", newCategory));
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all inventory categories
exports.getAllInventoryCategories = async (req, res, next) => {
    try {
        const categories = await InventoryCategory.find();
        return next(createSuccess(200, "All Inventory Categories", categories));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};

// get inventory category by id
exports.getInventoryCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await InventoryCategory.findById(id);

        if (!category) {
            return next(createError(404, "Inventory Category not found"));
        }

        return next(createSuccess(200, "Inventory Category fetched successfully", category));
    } catch (error) {
        return next(createError(500, "Internal Server Error!"));
    }
};

// Update inventory category by ID
exports.updateInventoryCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;

        // Find the category by its ID
        const category = await InventoryCategory.findById(id);
        if (!category) {
            return next(createError(404, "Inventory Category not found"));
        }

        // Update the category details
        if (categoryName) {
            category.categoryName = categoryName;
        }

        // Save the updated category
        await category.save();

        return next(createSuccess(200, "Inventory Category details updated successfully", category));
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal Server Error!"));
    }

};

// Delete inventory category by id
exports.deleteInventoryCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleteCategory = await InventoryCategory.findByIdAndDelete(id);

        if (!deleteCategory) {
            return next(createError(404, "Inventory Category not found"));
        }

        return next(createSuccess(200, "Inventory Category deleted successfully", deleteCategory));
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal Server Error"));
    }
};