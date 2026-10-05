import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  fromAccount: {
    type: String,
    required: true,
  },
  toAccount: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

// Explicitly use the expected collection name; this also avoids the old
// "Transacation" model-name typo creating a misspelled MongoDB collection.
const Transaction = mongoose.model(
  "Transaction",
  transactionSchema,
  "transactions",
);

export default Transaction;
