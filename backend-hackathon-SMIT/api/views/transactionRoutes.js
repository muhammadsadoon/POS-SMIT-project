const express = require('express');
const { authorize } = require('../middleware/auth');
const TransactionViewModel = require('../viewModels/TransactionViewModel');
const { validateTransaction } = require('../middleware/validator');

const transactionRouter = express.Router();

// @route   POST /api/transactions/sale
// @desc    Create new sale
// @access  Private
transactionRouter.post('/sale', validateTransaction, async (req, res, next) => {
  try {
    const saleData = {
      ...req.body,
      performedBy: req.user._id
    };
    
    const result = await TransactionViewModel.createSale(saleData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/transactions
// @desc    Get all sales with pagination
// @access  Private
transactionRouter.get('/', async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      startDate, 
      endDate, 
      paymentMethod 
    } = req.query;
    
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (paymentMethod) filters.paymentMethod = paymentMethod;
    
    const result = await TransactionViewModel.getSales(
      parseInt(page),
      parseInt(limit),
      filters
    );
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/transactions/:transactionId
// @desc    Get single sale
// @access  Private
transactionRouter.get('/:transactionId', async (req, res, next) => {
  try {
    const result = await TransactionViewModel.getSaleById(req.params.transactionId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/transactions/:transactionId/refund
// @desc    Refund a sale
// @access  Private (Admin/Manager)
transactionRouter.post('/:transactionId/refund', 
  authorize('ADMIN', 'MANAGER'), 
  async (req, res, next) => {
    try {
      const result = await TransactionViewModel.refundSale(
        req.params.transactionId,
        req.user._id
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = transactionRouter;