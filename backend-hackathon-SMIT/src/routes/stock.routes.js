import express from "express";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";
import { updateStockVM } from "../viewmodels/stock.vm.js";
import { success, error } from "../views/response.view.js";

const router = express.Router();

router.post("/", protect, allowRoles("admin"), async (req, res) => {
  try {
    const product = await updateStockVM({
      ...req.body,
      userId: req.user.id
    });
    success(res, product, "Stock updated");
  } catch (e) {
    error(res, e.message);
  }
});

export default router;
