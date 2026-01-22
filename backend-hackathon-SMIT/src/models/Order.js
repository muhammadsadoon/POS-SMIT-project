import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      qty: Number,
      price: Number
    }
  ],
  total: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
},{
  collections:"orders"
});

export default mongoose.model("Order", orderSchema);
