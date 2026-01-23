const express = require('express');
const Category = require('../models/Category');

const categoryRouter = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
categoryRouter.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/categories
// @desc    Create new category
// @access  Private
categoryRouter.post('/', async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
});

module.exports = categoryRouter;
