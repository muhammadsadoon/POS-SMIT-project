import express from "express";
import { registerVM, loginVM } from "../viewmodels/auth.vm.js";
import { success, error } from "../views/response.view.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await registerVM(req.body);
    success(res, user, "User registered");
  } catch (e) {
    error(res, e.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = await loginVM(req.body);
    success(res, data, "Login success");
  } catch (e) {
    error(res, e.message, 401);
  }
});

export default router;
