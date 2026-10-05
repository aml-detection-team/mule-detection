import Account from "../models/Account.js";

const getAccounts = async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
};

const getAccount = async (req, res) => {
  const account = await Account.findOne({
    accountId: req.params.accountId,
  });

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

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

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  return res.json(account);
};

const deleteAccount = async (req, res) => {
  const account = await Account.findOneAndDelete({
    accountId: req.params.accountId,
  });

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  return res.json(account);
};

export { getAccounts, getAccount, createAccount, updateAccount, deleteAccount };
