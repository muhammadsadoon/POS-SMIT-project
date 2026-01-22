import mongoose from "mongoose";

const stockHistorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  change: Number,
  reason: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now }
},{
  collections:"stockhistories"
});

export default mongoose.model("StockHistory", stockHistorySchema);
