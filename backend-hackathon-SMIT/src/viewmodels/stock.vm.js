import Product from "../models/Product.js";
import StockHistory from "../models/StockHistory.js";

export const updateStockVM = async ({ productId, qty, reason, userId }) => {
  const product = await Product.findById(productId);
  product.stock += qty;
  await product.save();

  await StockHistory.create({
    productId,
    projectId: product.projectId,
    change: qty,
    reason,
    createdBy: userId
  });

  return product;
};
