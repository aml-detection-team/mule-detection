import mongoose from "mongoose";
import { randomUUID } from "node:crypto";

const CASE_STATUSES = ["OPEN", "IN_REVIEW", "ESCALATED", "CLOSED", "FALSE_POSITIVE"];
const CASE_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const caseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
      default: () => `CASE-${randomUUID()}`,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: CASE_STATUSES,
      default: "OPEN",
    },
    priority: {
      type: String,
      enum: CASE_PRIORITIES,
      default: "MEDIUM",
    },
    accountIds: {
      type: [String],
      default: [],
    },
    flagKeys: {
      type: [String],
      default: [],
    },
    transactionIds: {
      type: [String],
      default: [],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: {
      type: [
        {
          author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          text: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

caseSchema.index({ status: 1, createdAt: -1 });
caseSchema.index({ accountIds: 1 });

const Case = mongoose.model("Case", caseSchema);

export { CASE_STATUSES, CASE_PRIORITIES };
export default Case;
