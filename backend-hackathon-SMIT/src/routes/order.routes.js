import express from "express";
import { protect } from "../middleware/auth.js";
import { createOrderVM } from "../viewmodels/order.vm.js";
import { success, error } from "../views/response.view.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const order = await createOrderVM({
      ...req.body,
      userId: req.user.id
    });
    success(res, order, "Order created");
  } catch (e) {
    error(res, e.message);
  }
});

export default router;
