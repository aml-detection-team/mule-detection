import express from "express";
import {
  getTransaction,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getTransactions);
router.get("/:transactionId", getTransaction);
router.put("/:transactionId", updateTransaction);
router.post("/", createTransaction);
router.delete("/:transactionId", deleteTransaction);
export default router;
