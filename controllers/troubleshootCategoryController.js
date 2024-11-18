const Category = require('../models/troubleshootCategoryModel')
const Role = require('../models/roleModel');
const createError = require('../middleware/error')
const createSuccess = require('../middleware/success');
const path = require('path');
const fs = require('fs');

//postcategory
const addCategory = async (req, res, next) => {
  try {
    const role = await Role.find({ role: 'User' });
    
    const newCategory = new Category({ categoryName: req.body.categoryName })
    await newCategory.save();
    
    return next(createSuccess(200, "Category Added Successfully", newCategory))
    
  }
  catch (error) {
    return next(createError(500, "Something went wrong"))
  }
}

// Get all categories only
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    return next(createSuccess(200, "All Categories", categories));

  } catch (error) {
    return next(createError(500, "Internal Server Error!"));
  }
};

// Get category by ID
const getCategoryById = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    // Find the category by its ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(createError(404, "Category not found"));
    }

    return next(createSuccess(200, "Category found successfully", category));
  } catch (error) {
    console.error(error);
    return next(createError(500, "Internal Server Error!"));
  }
};

// Update category by ID
const updateCategoryById = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { categoryName } = req.body;

    // Find the category by its ID
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(createError(404, "Category not found"));
    }

    // Update the category details
    if (categoryName) {
      category.categoryName = categoryName;
    }

    // Save the updated category
    await category.save();

    return next(createSuccess(200, "Category updated successfully", category));
  } catch (error) {
    console.error(error);
    return next(createError(500, "Internal Server Error!"));
  }
};

// Delete files from a category
const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const deleteCategory = await Category.findByIdAndDelete(categoryId);

    if (!deleteCategory) {
      return next(createError(404, "Category not found"));
    }

    return next(createSuccess(200, "Category deleted successfully", deleteCategory));

  } catch (error) {
    console.error(error);
    return next(createError(500, "Internal Server Error"));
  }
};


module.exports = { addCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategory }