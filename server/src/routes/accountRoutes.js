import express from "express";
import {
  getAccount,
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/accountController.js";

const router = express.Router();

router.get("/", getAccounts);

router.get("/:accountId", getAccount);

router.post("/", createAccount);

router.put("/:accountId", updateAccount);

router.delete("/:accountId", deleteAccount);

export default router;
