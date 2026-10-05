import express from "express";
import { getFlags } from "../controllers/flagController.js";

const router = express.Router();

router.get("/", getFlags);

export default router;
