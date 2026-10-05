import Flag from "../models/Flag.js";

const getFlags = async (req, res) => {
  const flags = await Flag.find().sort({ createdAt: -1 });
  res.json(flags);
};

export { getFlags };
