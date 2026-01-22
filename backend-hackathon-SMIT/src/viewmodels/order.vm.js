import Order from "../models/Order.js";
import Product from "../models/Product.js";
import StockHistory from "../models/StockHistory.js";

export const createOrderVM = async ({ projectId, items, userId }) => {
  let total = 0;

  for (let item of items) {
    const product = await Product.findById(item.productId);
    if (product.stock < item.qty) throw new Error("Not enough stock");

    product.stock -= item.qty;
    await product.save();

    total += item.qty * product.price;

    await StockHistory.create({
      productId: product._id,
      projectId,
      change: -item.qty,
      reason: "Sale",
      createdBy: userId
    });
  }

  return await Order.create({ projectId, items, total, createdBy: userId });
};
