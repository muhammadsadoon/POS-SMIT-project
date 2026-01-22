import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import cors from "cors";
import morgan from "morgan";

dotenv.config({
  path: "./.env"
});
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stock", stockRoutes);

app.get("/", (req, res) => {
  res.send("🚀 POS Backend is running");
});
app.listen(PORT, () => {
  console.log(`🚀 POS Backend running on http://localhost:${PORT}`);
});
