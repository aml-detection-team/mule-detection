import mongoose from "mongoose";

const flagSchema = new mongoose.Schema(
  {
    // One flag is one account's participation in one detected scenario.
    // The deterministic key makes repeated detection runs idempotent.
    flagKey: {
      type: String,
      required: true,
      unique: true,
    },
    scenarioKey: {
      type: String,
      required: true,
      index: true,
    },
    accountId: {
      type: String,
      required: true,
      index: true,
    },
    pattern: {
      type: String,
      required: true,
    },
    riskLevel: {
      type: String,
      required: true,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    transactionIds: {
      type: [String],
      required: true,
      default: [],
    },
    reasons: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

flagSchema.index({ accountId: 1, createdAt: -1 });

const Flag = mongoose.model("Flag", flagSchema);

export default Flag;
