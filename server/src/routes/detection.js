import express from "express";
import detectTransactions from "../controllers/detectionController.js";

const router = express.Router();

// Compatibility alias for the legacy /api/detection route.
// It now reuses the same controller as /api/detect instead of a
// separate implementation. GET is supported for health checks.
router.get("/", detectTransactions);
router.post("/", detectTransactions);

export default router;
