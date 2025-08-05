const MarketingCategories = require("../models/marketingCategoriesModel");
const createError = require("../middleware/error");
const createSuccess = require("../middleware/success");

// Create New Marketing Category
exports.createMarketingCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.body;
    const newCategory = new MarketingCategories({ categoryName });

    await newCategory.save();

    return next(
      createSuccess(200, "Category created successfully", newCategory)
    );
  } catch (error) {
    console.error("Error fetch Create Category", error);
    return next(createError(500, "Something went wrong"));
  }
};

// Get All Marketing Categories With Pagination
exports.getAllMarketingCategories = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(1, parseInt(req.query.limit || "10", 10));
    const skip = (page - 1) * limit;

    const totalCategories = await MarketingCategories.countDocuments();

    const categories = await MarketingCategories.find()
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

// Get All Marketing Categories Without Pagination
exports.getAllMarketingCategoriesNoPagination = async (req, res, next) => {
  try {
    const categories = await MarketingCategories.find()
      .sort({ createdAt: -1 })
      .lean();

    return next(
      createSuccess(
        200,
        "Get All Marketing Categories Successfully",
        categories
      )
    );
  } catch (error) {
    next(createError(500, "Something went wrong"));
  }
};

// Get Marketing Category By ID
exports.getMarketingCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await MarketingCategories.findById(id).lean();

    if (!category) {
      return next(createError(404, "Marketing Category not found"));
    }

    return next(
      createSuccess(200, "Marketing Category fetched successfully", category)
    );
  } catch (error) {
    next(createError(500, "Something went wrong"));
  }
};

// Update Marketing Category Details By ID
exports.updateMarketingCategoryDetailsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;

    const updatedCategory = await MarketingCategories.findByIdAndUpdate(
      id,
      { categoryName },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedCategory) {
      return next(createError(404, "Marketing Category not found"));
    }

    return next(
      createSuccess(
        200,
        "Marketing Category updated successfully",
        updatedCategory
      )
    );
  } catch (error) {
    next(createError(500, "Something went wrong"));
  }
};

// Delete Marketing Category By ID
exports.deleteMarketingCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCategory = await MarketingCategories.findByIdAndDelete(id);

    if (!deletedCategory) {
      return next(createError(404, "Marketing Category not found"));
    }

    return next(createSuccess(200, "Marketing Category deleted successfully", deletedCategory ));

  } catch (error) {
    next(createError(500, "Something went wrong"));
  }
};
