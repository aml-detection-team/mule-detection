import Transaction from "../models/Transaction.js";

const getTransactions = async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
};

const getTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({
    transactionId: req.params.transactionId,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  return res.json(transaction);
};

const createTransaction = async (req, res) => {
  const transaction = new Transaction(req.body);
  const savedTransaction = await transaction.save();
  return res.status(201).json(savedTransaction);
};

const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate(
    { transactionId: req.params.transactionId },
    req.body,
    { new: true, runValidators: true },
  );

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  return res.json(transaction);
};

const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    transactionId: req.params.transactionId,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  return res.json(transaction);
};

export {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
