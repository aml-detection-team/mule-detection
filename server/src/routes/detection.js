import express from "express";
import getDetectionResults from "../controllers/detectionController.js";

const router = express.Router();

router.get("/", getDetectionResults);

export default router;