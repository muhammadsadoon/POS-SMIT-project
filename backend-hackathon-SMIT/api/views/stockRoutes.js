const express = require('express');
const StockViewModel = require('../viewModels/StockViewModel');
const { validateObjectId, validateStockMovement, validateStockAdjust } = require('../middleware/validator');

const stockRouter = express.Router();
// @route   GET /api/stock
// @desc    Get all stock movements with pagination
// @access  Public
stockRouter.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, productId, type } = req.query;
    
    const result = await StockViewModel.getStockMovements(
      parseInt(page),
      parseInt(limit),
      productId,
      type
    );
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/stock/product/:id
// @desc    Get stock info for specific product
// @access  Public
stockRouter.get('/product/:id', validateObjectId, async (req, res, next) => {
  try {
    const result = await StockViewModel.getStockByProduct(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/stock/add
// @desc    Add stock (Stock IN)
// @access  Private
stockRouter.post('/add', validateStockMovement, async (req, res, next) => {
  try {
    const { project, productId, quantity, reason, performedBy, notes } = req.body;
    
    const result = await StockViewModel.addStock(
      project,
      productId,
      parseInt(quantity),
      reason,
      performedBy,
      notes
    );
    
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/stock/remove
// @desc    Remove stock (Stock OUT)
// @access  Private
stockRouter.post('/remove', validateStockMovement, async (req, res, next) => {
  try {
    const { project, productId, quantity, reason, performedBy, notes } = req.body;
    
    const result = await StockViewModel.removeStock(
      project,
      productId,
      parseInt(quantity),
      reason,
      performedBy,
      notes
    );
    
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/stock/adjust
// @desc    Adjust stock manually
// @access  Private
stockRouter.post('/adjust', validateStockAdjust, async (req, res, next) => {
  try {
    const { project, productId, newQuantity, reason, performedBy, notes } = req.body;
    
    const result = await StockViewModel.adjustStock(
      project,
      productId,
      parseInt(newQuantity),
      reason,
      performedBy,
      notes
    );
    
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = stockRouter;