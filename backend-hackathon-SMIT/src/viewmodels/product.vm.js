import Product from "../models/Product.js";
import { generateBarcode } from "../utils/barcode.js";

export const createProductVM = async ({ projectId, name, price, stock, barcode }) => {
  const code = barcode || generateBarcode();
  return await Product.create({ projectId, name, price, stock, barcode: code });
};
