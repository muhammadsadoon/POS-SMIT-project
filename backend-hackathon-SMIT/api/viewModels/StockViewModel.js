const Stock = require('../models/Stock');
const Product = require('../models/Product');

class StockViewModel {
  // Get stock movements with pagination
  static async getStockMovements(page = 1, limit = 10, productId = null, type = null) {
    try {
      const skip = (page - 1) * limit;
      const query = {};
      
      if (productId) query.product = productId;
      if (type) query.type = type;

      const stocks = await Stock
        .find(query)
        .populate('product', 'name sku')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      const total = await Stock.countDocuments(query);

      return {
        success: true,
        data: stocks,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      };
    } catch (error) {
      throw new Error(`Get Stock Movements Error: ${error.message}`);
    }
  }

  // Add stock (Stock IN)
  static async addStock(projectId, productId, quantity, reason, performedBy, notes = '') {
    try {
      const product = await Product.findById(productId);
      
      if (!product) {
        throw new Error('Product not found');
      }

      const previousQuantity = product.quantity;
      const newQuantity = previousQuantity + quantity;

      // Create stock movement record
      const stockMovement = new Stock({
        project: projectId,
        product: productId,
        type: 'IN',
        quantity,
        reason,
        performedBy,
        notes,
        previousQuantity,
        newQuantity
      });

      await stockMovement.save();

      // Update product quantity
      product.quantity = newQuantity;
      await product.save();

      return {
        success: true,
        message: 'Stock added successfully',
        data: {
          stockMovement,
          product
        }
      };
    } catch (error) {
      throw new Error(`Add Stock Error: ${error.message}`);
    }
  }

  // Remove stock (Stock OUT)
  static async removeStock(projectId, productId, quantity, reason, performedBy, notes = '') {
    try {
      const product = await Product.findById(productId);
      
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.quantity < quantity) {
        throw new Error('Insufficient stock quantity');
      }

      const previousQuantity = product.quantity;
      const newQuantity = previousQuantity - quantity;

      // Create stock movement record
      const stockMovement = new Stock({
        project: projectId,
        product: productId,
        type: 'OUT',
        quantity,
        reason,
        performedBy,
        notes,
        previousQuantity,
        newQuantity
      });

      await stockMovement.save();

      // Update product quantity
      product.quantity = newQuantity;
      await product.save();

      return {
        success: true,
        message: 'Stock removed successfully',
        data: {
          stockMovement,
          product
        }
      };
    } catch (error) {
      throw new Error(`Remove Stock Error: ${error.message}`);
    }
  }

  // Adjust stock (Manual adjustment)
  static async adjustStock(projectId, productId, newQuantity, reason, performedBy, notes = '') {
    try {
      const product = await Product.findById(productId);
      
      if (!product) {
        throw new Error('Product not found');
      }

      const previousQuantity = product.quantity;

      // Create stock movement record
      const stockMovement = new Stock({
        project: projectId,
        product: productId,
        type: 'ADJUSTMENT',
        quantity: Math.abs(newQuantity - previousQuantity),
        reason,
        performedBy,
        notes,
        previousQuantity,
        newQuantity
      });

      await stockMovement.save();

      // Update product quantity
      product.quantity = newQuantity;
      await product.save();

      return {
        success: true,
        message: 'Stock adjusted successfully',
        data: {
          stockMovement,
          product
        }
      };
    } catch (error) {
      throw new Error(`Adjust Stock Error: ${error.message}`);
    }
  }

  // Get stock by product
  static async getStockByProduct(productId) {
    try {
      const product = await Product.findById(productId).populate('category');
      
      if (!product) {
        throw new Error('Product not found');
      }

      const stockMovements = await Stock
        .find({ product: productId })
        .sort({ createdAt: -1 })
        .limit(20);

      return {
        success: true,
        data: {
          product,
          currentStock: product.quantity,
          isLowStock: product.isLowStock(),
          recentMovements: stockMovements
        }
      };
    } catch (error) {
      throw new Error(`Get Stock By Product Error: ${error.message}`);
    }
  }
}

module.exports = StockViewModel;