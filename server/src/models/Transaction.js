import mongoose, { model, mongo } from "mongoose";

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

const Transaction = mongoose.model("Transacation", transactionSchema);
export default Transaction;
