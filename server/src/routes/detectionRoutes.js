import express from "express";
import detectTransactions from "../controllers/detectionController.js";

const router = express.Router();

router.post("/", detectTransactions);

export default router;
