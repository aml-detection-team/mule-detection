import Account from "../models/Account.js";

const uniqueStrings = (values) => {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((v) => typeof v === "string" && v))];
};

const parsePagination = (req) => {
  const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const rawLimit = Number.parseInt(req.query.limit, 10);
  const limit = Math.min(100, Math.max(1, Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 20));
  return { hasPagination, page, limit, skip: (page - 1) * limit };
};

const buildAccountFilter = (req) => {
  const filter = {};
  if (req.query.accountId) filter.accountId = req.query.accountId;
  if (req.query.accountType) filter.accountType = req.query.accountType;
  if (req.query.country) filter.country = req.query.country;
  if (req.query.customerName) {
    filter.customerName = { $regex: String(req.query.customerName), $options: "i" };
  }
  return filter;
};

const getAccounts = async (req, res) => {
  const { hasPagination, page, limit, skip } = parsePagination(req);
  const filter = buildAccountFilter(req);
  const sort = req.query.sort ? { [req.query.sort]: req.query.order === "asc" ? 1 : -1 } : { createdAt: -1 };

  if (!hasPagination) {
    const accounts = await Account.find(filter).sort(sort);
    return res.json(accounts);
  }

  const [accounts, total] = await Promise.all([
    Account.find(filter).sort(sort).skip(skip).limit(limit),
    Account.countDocuments(filter),
  ]);

  return res.json({
    data: accounts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
};

const getAccount = async (req, res) => {
  const account = await Account.findOne({ accountId: req.params.accountId });
  if (!account) return res.status(404).json({ message: "Account not found" });
  return res.json(account);
};

const createAccount = async (req, res) => {
  const account = new Account(req.body);
  const savedAccount = await account.save();
  return res.status(201).json(savedAccount);
};

const updateAccount = async (req, res) => {
  const account = await Account.findOneAndUpdate(
    { accountId: req.params.accountId },
    req.body,
    { new: true, runValidators: true },
  );
  if (!account) return res.status(404).json({ message: "Account not found" });
  return res.json(account);
};

const deleteAccount = async (req, res) => {
  const account = await Account.findOneAndDelete({ accountId: req.params.accountId });
  if (!account) return res.status(404).json({ message: "Account not found" });
  return res.json(account);
};

export { getAccounts, getAccount, createAccount, updateAccount, deleteAccount };
