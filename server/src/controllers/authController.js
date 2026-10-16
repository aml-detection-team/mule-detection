import User from "../models/User.js";
import { signToken } from "../middleware/authMiddleware.js";

const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select(
    "+passwordHash",
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await user.verifyPassword(String(password));
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user);
  return res.json({
    token,
    user: user.toSafeObject(),
  });
};

const me = async (req, res) => {
  return res.json({ user: req.user.toSafeObject() });
};

export { login, me };
