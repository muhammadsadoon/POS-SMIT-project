import express from "express";
import { protect } from "../middleware/auth.js";
import { createProductVM } from "../viewmodels/product.vm.js";
import { success, error } from "../views/response.view.js";

const router = express.Router();

router.post("/:projectId", protect, async (req, res) => {
  try {
    const product = await createProductVM({
      projectId: req.params.projectId,
      ...req.body
    });
    success(res, product, "Product created");
  } catch (e) {
    error(res, e.message);
  }
});

export default router;
