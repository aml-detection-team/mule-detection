import Flag from "../models/Flag.js";

const parsePagination = (req) => {
  const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const rawLimit = Number.parseInt(req.query.limit, 10);
  const limit = Math.min(100, Math.max(1, Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 20));
  return { hasPagination, page, limit, skip: (page - 1) * limit };
};

const buildFlagFilter = (req) => {
  const filter = {};
  if (req.query.pattern) filter.pattern = req.query.pattern;
  if (req.query.riskLevel) filter.riskLevel = req.query.riskLevel;
  if (req.query.accountId) filter.accountId = req.query.accountId;
  if (req.query.scenarioKey) filter.scenarioKey = req.query.scenarioKey;
  return filter;
};

const getFlags = async (req, res) => {
  const { hasPagination, page, limit, skip } = parsePagination(req);
  const filter = buildFlagFilter(req);

  if (!hasPagination) {
    const flags = await Flag.find(filter).sort({ createdAt: -1 });
    return res.json(flags);
  }

  const [flags, total] = await Promise.all([
    Flag.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Flag.countDocuments(filter),
  ]);

  return res.json({
    data: flags,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
};

export { getFlags };
