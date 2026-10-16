import express from "express";
import {
  getCases,
  getCase,
  createCase,
  updateCase,
  deleteCase,
} from "../controllers/caseController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getCases);
router.get("/:caseId", getCase);
router.post("/", createCase);
router.put("/:caseId", updateCase);
router.patch("/:caseId", updateCase);
router.delete("/:caseId", authorize("admin"), deleteCase);

export default router;
