import express from "express";
import { protect } from "../middleware/auth.js";
import { createProjectVM, addMemberVM } from "../viewmodels/project.vm.js";
import { success, error } from "../views/response.view.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const project = await createProjectVM({
      name: req.body.name,
      userId: req.user.id
    });
    success(res, project, "Project created");
  } catch (e) {
    error(res, e.message);
  }
});

router.post("/:projectId/member", protect, async (req, res) => {
  try {
    const project = await addMemberVM({
      projectId: req.params.projectId,
      userId: req.body.userId
    });
    success(res, project, "Member added");
  } catch (e) {
    error(res, e.message);
  }
});

export default router;
