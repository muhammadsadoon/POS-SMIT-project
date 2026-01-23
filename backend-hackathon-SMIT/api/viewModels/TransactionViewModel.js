const mongoose = require('mongoose');
const Product = require('../models/Product');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');

class TransactionViewModel {
  // Create new sale
  static async createSale(saleData) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Generate unique transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      let subtotal = 0;
      const items = [];

      // Process each item
      for (const item of saleData.items) {
        const product = await Product.findById(item.productId).session(session);

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const itemSubtotal = product.price * item.quantity;
        subtotal += itemSubtotal;

        items.push({
          product: product._id,
          name: product.name,
          sku: product.sku,
          quantity: item.quantity,
          price: product.price,
          subtotal: itemSubtotal
        });

        // Reduce stock
        product.quantity -= item.quantity;
        await product.save({ session });

        // Create stock movement
        await Stock.create([{
          project: saleData.project,
          product: product._id,
          type: 'OUT',
          quantity: item.quantity,
          reason: 'Sale',
          performedBy: saleData.performedBy,
          notes: `Transaction: ${transactionId}`,
          previousQuantity: product.quantity + item.quantity,
          newQuantity: product.quantity
        }], { session });
      }

      // Calculate discount
      let discountAmount = saleData.discount || 0;
      if (saleData.discountType === 'PERCENTAGE') {
        discountAmount = (subtotal * discountAmount) / 100;
      }

      // Calculate tax (18% GST example)
      const taxRate = 0.18;
      const taxableAmount = subtotal - discountAmount;
      const tax = taxableAmount * taxRate;

      const totalAmount = subtotal - discountAmount + tax;

      // Create transaction
      const transaction = await Transaction.create([{
        project: saleData.project,
        transactionId,
        items,
        subtotal,
        discount: discountAmount,
        discountType: saleData.discountType || 'FIXED',
        tax,
        totalAmount,
        paymentMethod: saleData.paymentMethod,
        amountPaid: saleData.amountPaid,
        changeReturned: saleData.amountPaid - totalAmount,
        customerName: saleData.customerName,
        customerPhone: saleData.customerPhone,
        performedBy: saleData.performedBy,
        notes: saleData.notes
      }], { session });

      await session.commitTransaction();

      return {
        success: true,
        message: 'Sale completed successfully',
        data: transaction[0]
      };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Sale Error: ${error.message}`);
    } finally {
      session.endSession();
    }
  }

  // Get sales with pagination
  static async getSales(page = 1, limit = 20, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = { status: 'COMPLETED' };

      if (filters.startDate && filters.endDate) {
        query.createdAt = {
          $gte: new Date(filters.startDate),
          $lte: new Date(filters.endDate)
        };
      }

      if (filters.paymentMethod) {
        query.paymentMethod = filters.paymentMethod;
      }

      const sales = await Transaction
        .find(query)
        .populate('performedBy', 'name email')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Transaction.countDocuments(query);

      return {
        success: true,
        data: sales,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      };
    } catch (error) {
      throw new Error(`Get Sales Error: ${error.message}`);
    }
  }

  // Get sale by ID
  static async getSaleById(transactionId) {
    try {
      const sale = await Transaction
        .findOne({ transactionId })
        .populate('items.product')
        .populate('performedBy', 'name email');

      if (!sale) {
        throw new Error('Sale not found');
      }

      return {
        success: true,
        data: sale
      };
    } catch (error) {
      throw new Error(`Get Sale Error: ${error.message}`);
    }
  }

  // Cancel/Refund sale
  static async refundSale(transactionId, performedBy) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const sale = await Transaction.findOne({ transactionId }).session(session);

      if (!sale) {
        throw new Error('Sale not found');
      }

      if (sale.status === 'REFUNDED') {
        throw new Error('Sale already refunded');
      }

      // Restore stock
      for (const item of sale.items) {
        const product = await Product.findById(item.product).session(session);

        if (product) {
          product.quantity += item.quantity;
          await product.save({ session });

          // Create stock movement
          await Stock.create([{
            product: product._id,
            type: 'IN',
            quantity: item.quantity,
            reason: 'Refund',
            performedBy,
            notes: `Refund: ${transactionId}`,
            previousQuantity: product.quantity - item.quantity,
            newQuantity: product.quantity
          }], { session });
        }
      }

      sale.status = 'REFUNDED';
      await sale.save({ session });

      await session.commitTransaction();

      return {
        success: true,
        message: 'Sale refunded successfully',
        data: sale
      };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Refund Error: ${error.message}`);
    } finally {
      session.endSession();
    }
  }
}
class ReportsViewModel {
  // Daily sales report
  static async getDailySalesReport(date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const report = await Transaction.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            status: 'COMPLETED'
          }
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$totalAmount' },
            totalTransactions: { $sum: 1 },
            totalDiscount: { $sum: '$discount' },
            totalTax: { $sum: '$tax' },
            cash: {
              $sum: {
                $cond: [{ $eq: ['$paymentMethod', 'CASH'] }, '$totalAmount', 0]
              }
            },
            card: {
              $sum: {
                $cond: [{ $eq: ['$paymentMethod', 'CARD'] }, '$totalAmount', 0]
              }
            },
            upi: {
              $sum: {
                $cond: [{ $eq: ['$paymentMethod', 'UPI'] }, '$totalAmount', 0]
              }
            }
          }
        }
      ]);

      return {
        success: true,
        data: report[0] || {
          totalSales: 0,
          totalTransactions: 0,
          totalDiscount: 0,
          totalTax: 0,
          cash: 0,
          card: 0,
          upi: 0
        }
      };
    } catch (error) {
      throw new Error(`Report Error: ${error.message}`);
    }
  }

  // Top selling products
  static async getTopSellingProducts(startDate, endDate, limit = 10) {
    try {
      const products = await Transaction.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            },
            status: 'COMPLETED'
          }
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            productName: { $first: '$items.name' },
            totalQuantity: { $sum: '$items.quantity' },
            totalRevenue: { $sum: '$items.subtotal' }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: limit }
      ]);

      return {
        success: true,
        data: products
      };
    } catch (error) {
      throw new Error(`Top Selling Error: ${error.message}`);
    }
  }

  // Profit analysis
  static async getProfitAnalysis(startDate, endDate) {
    try {
      const transactions = await Transaction.find({
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        },
        status: 'COMPLETED'
      }).populate('items.product', 'costPrice');

      let totalRevenue = 0;
      let totalCost = 0;

      transactions.forEach(txn => {
        totalRevenue += txn.totalAmount;
        txn.items.forEach(item => {
          if (item.product && item.product.costPrice) {
            totalCost += item.product.costPrice * item.quantity;
          }
        });
      });

      const profit = totalRevenue - totalCost;
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue * 100).toFixed(2) : 0;

      return {
        success: true,
        data: {
          totalRevenue,
          totalCost,
          grossProfit: profit,
          profitMargin: `${profitMargin}%`,
          transactions: transactions.length
        }
      };
    } catch (error) {
      throw new Error(`Profit Analysis Error: ${error.message}`);
    }
  }
}

// ============================================
// Export all ViewModels
// ============================================
module.exports = TransactionViewModel;
module.exports.ReportsViewModel = ReportsViewModel;
