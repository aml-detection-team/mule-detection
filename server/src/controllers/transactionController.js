import Transaction from "../models/Transaction.js";

const parsePagination = (req) => {
  const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const rawLimit = Number.parseInt(req.query.limit, 10);
  const limit = Math.min(100, Math.max(1, Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 20));
  return { hasPagination, page, limit, skip: (page - 1) * limit };
};

const buildTransactionFilter = (req) => {
  const filter = {};
  if (req.query.transactionId) filter.transactionId = req.query.transactionId;
  if (req.query.fromAccount) filter.fromAccount = req.query.fromAccount;
  if (req.query.toAccount) filter.toAccount = req.query.toAccount;
  if (req.query.currency) filter.currency = req.query.currency;
  if (req.query.minAmount || req.query.maxAmount) {
    filter.amount = {};
    if (req.query.minAmount) filter.amount.$gte = Number(req.query.minAmount);
    if (req.query.maxAmount) filter.amount.$lte = Number(req.query.maxAmount);
  }
  return filter;
};

const getTransactions = async (req, res) => {
  const { hasPagination, page, limit, skip } = parsePagination(req);
  const filter = buildTransactionFilter(req);
  const sortField = req.query.sort || "timestamp";
  const sort = { [sortField]: req.query.order === "asc" ? 1 : -1 };

  if (!hasPagination) {
    const transactions = await Transaction.find(filter).sort(sort);
    return res.json(transactions);
  }

  const [transactions, total] = await Promise.all([
    Transaction.find(filter).sort(sort).skip(skip).limit(limit),
    Transaction.countDocuments(filter),
  ]);

  return res.json({
    data: transactions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
};

const getTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({ transactionId: req.params.transactionId });
  if (!transaction) return res.status(404).json({ message: "Transaction not found" });
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
  if (!transaction) return res.status(404).json({ message: "Transaction not found" });
  return res.json(transaction);
};

const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ transactionId: req.params.transactionId });
  if (!transaction) return res.status(404).json({ message: "Transaction not found" });
  return res.json(transaction);
};

export { getTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction };
