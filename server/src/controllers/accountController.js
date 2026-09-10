import Account from "../models/Account.js";

const getAccounts = async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
};

const getAccount = async (req, res) => {
  const accounts = await Account.findOne({
    accountId: req.params.accountId,
  });
  res.json(accounts);
};

const createAccount = async (req, res) => {
  const account = new Account(req.body);
  const savedaccount = await account.save();
  res.json(savedaccount);
};

const updateAccount = async (req, res) => {
  const account = await Account.findOneAndUpdate(
    { accountId: req.params.accountId },
    req.body,
    { new: true },
  );

  res.json(account);
};

const deleteAccount = async (req, res) => {
  const account = await Account.findOneAndDelete({
    accountId: req.params.accountId,
  });
  res.json(account);
};
export { getAccounts, getAccount, createAccount, updateAccount, deleteAccount };
