import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  name: String,
  price: Number,
  stock: Number,
  barcode: String
},
{
  collections:"products"
});

export default mongoose.model("Product", productSchema);
