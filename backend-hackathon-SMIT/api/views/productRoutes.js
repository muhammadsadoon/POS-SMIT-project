const express = require('express');
const router = express.Router();
const ProductViewModel = require('../viewModels/ProductViewModel');
const { validateProduct, validateObjectId } = require('../middleware/validator');

// @route   GET /api/products
// @desc    Get all products with pagination
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    
    const result = await ProductViewModel.getAllProducts(
      parseInt(page),
      parseInt(limit),
      search,
      category
    );
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/low-stock
// @desc    Get products with low stock
// @access  Public
router.get('/low-stock', async (req, res, next) => {
  try {
    const result = await ProductViewModel.getLowStockProducts();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', validateObjectId, async (req, res, next) => {
  try {
    const result = await ProductViewModel.getProductById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private
router.post('/', validateProduct, async (req, res, next) => {
  try {
    const result = await ProductViewModel.createProduct(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private
router.put('/:id', validateObjectId, validateProduct, async (req, res, next) => {
  try {
    const result = await ProductViewModel.updateProduct(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete)
// @access  Private
router.delete('/:id', validateObjectId, async (req, res, next) => {
  try {
    const result = await ProductViewModel.deleteProduct(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;