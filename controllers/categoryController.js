const Category = require('../models/categoryModel');
const createError = require('../middleware/error');
const createSuccess = require('../middleware/success');


exports.createCategory = async (req, res, next) => {
    try {
        const { categoryName } = req.body;
        const newCategory = new Category({ categoryName });
        await newCategory.save();
        return next(createSuccess(200, "Category created successfully", newCategory));
    }
    catch (error) {
        return next(createError(500, "Something went wrong"));
    }
}


exports.getAllCategories = async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  || '1',  10));
    const limit = Math.max(1, parseInt(req.query.limit || '10', 10));
    const skip  = (page - 1) * limit;

    const totalCategories = await Category.countDocuments();

    const categories = await Category
      .find()
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit)
      .lean();

    const pagination = {
      page,
      limit,
      totalCategories,
      totalPages: Math.ceil(totalCategories / limit),
    };

    res.status(200).json({
      success: true,
      data: categories,
      pagination,
    });
  } catch (error) {
    next(createError(500, "Something went wrong"));
  }
};


exports.getAllCategories2 = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }); 
    return next(createSuccess(200, 'Categories fetched successfully', categories));
  } catch (error) {
    return next(createError(500, "Something went wrong"));
  }
};



exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        return next(createSuccess(200, 'Category deleted successfully'));
    }
    catch (error) {
        return next(createError(500, "Something went wrong"));
    }
}

exports.updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(id, { categoryName }, { new: true });
        return next(createSuccess(200, 'Category updated successfully', updatedCategory));
    }
    catch (error) {
        return next(createError(500, "Something went wrong"));
    }
}

exports.getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return next(createError(404, "Category not found"));
        }
        return next(createSuccess(200, 'Category fetched successfully', category));
    }
    catch (error) {
        return next(createError(500, "Something went wrong"));
    }
}






