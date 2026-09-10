import Transaction from "../models/Transaction.js";

const getTransactions = async (req, res) => {
  const transaction = await Transaction.find();
  res.json(transaction);
};

const getTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({
    transactionId: req.params.transactionId,
  });
  res.json(transaction);
};

const createTransaction = async (req, res) => {
  const transaction = new Transaction(req.body);
  const savedTransaction = await transaction.save();
  res.json(savedTransaction);
};

const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndUpdate(
    {
      transactionId: req.params.transactionId,
    },
    req.body,
    { new: true },
  );
  res.json(transaction);
};

const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    transactionId: req.params.transactionId,
  });
  res.json(transaction);
};
export {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
