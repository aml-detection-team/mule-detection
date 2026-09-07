import express from "express";
import getDetectionResults from "../controllers/detectionController.js";

const router = express.Router();

// Health check / get current detection results
router.get("/", getDetectionResults);

// Run detection
router.post("/", getDetectionResults);

export default router;