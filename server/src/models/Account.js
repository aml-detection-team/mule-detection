import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
    unique: true,
  },

  customerName: {
    type: String,
    required: true,
  },

  accountType: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
  },
});
const Account = mongoose.model("Account", accountSchema);
export default Account;
