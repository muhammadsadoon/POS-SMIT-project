// ============================================
// views/reportsRoutes.js - REPORTS ROUTES
// ============================================
const express = require('express');
const reportsRouter = express.Router();
const TransactionViewModel = require('../viewModels/TransactionViewModel');
const { ReportsViewModel } = TransactionViewModel;

// @route   GET /api/reports/daily/:date
// @desc    Get daily sales report
// @access  Private (Admin/Manager)
reportsRouter.get('/daily/:date', async (req, res, next) => {
  try {
    const result = await ReportsViewModel.getDailySalesReport(req.params.date);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/reports/top-selling
// @desc    Get top selling products
// @access  Private (Admin/Manager)
reportsRouter.get('/top-selling', async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate are required'
      });
    }
    
    const result = await ReportsViewModel.getTopSellingProducts(
      startDate,
      endDate,
      parseInt(limit)
    );
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/reports/profit
// @desc    Get profit analysis
// @access  Private (Admin/Manager)
reportsRouter.get('/profit', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate are required'
      });
    }
    
    const result = await ReportsViewModel.getProfitAnalysis(startDate, endDate);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/reports/monthly/:year/:month
// @desc    Get monthly summary
// @access  Private (Admin/Manager)
reportsRouter.get('/monthly/:year/:month', async (req, res, next) => {
  try {
    const { year, month } = req.params;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const [salesReport, topProducts, profitAnalysis] = await Promise.all([
      ReportsViewModel.getDailySalesReport(startDate),
      ReportsViewModel.getTopSellingProducts(startDate, endDate, 5),
      ReportsViewModel.getProfitAnalysis(startDate, endDate)
    ]);
    
    res.json({
      success: true,
      data: {
        period: {
          year: parseInt(year),
          month: parseInt(month),
          startDate,
          endDate
        },
        sales: salesReport.data,
        topProducts: topProducts.data,
        profit: profitAnalysis.data
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = reportsRouter;