import express from "express";
import generateAIExplanation
    from "../controllers/aiController.js";

const router = express.Router();

router.post(
    "/explanation",
    generateAIExplanation
);

export default router;