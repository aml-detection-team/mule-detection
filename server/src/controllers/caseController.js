import mongoose from "mongoose";
import Case from "../models/Case.js";

const uniqueStrings = (values) => {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((v) => typeof v === "string" && v.trim()).map((v) => v.trim()))];
};

const parsePagination = (req) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const rawLimit = Number.parseInt(req.query.limit, 10);
  const limit = Math.min(100, Math.max(1, Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 20));
  return { page, limit, skip: (page - 1) * limit };
};

const getCases = async (req, res) => {
  const { page, limit, skip } = parsePagination(req);
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;
  if (req.query.accountId) filter.accountIds = req.query.accountId;
  if (req.query.flagKey) filter.flagKeys = req.query.flagKey;

  const [cases, total] = await Promise.all([
    Case.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Case.countDocuments(filter),
  ]);

  return res.json({
    data: cases,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
};

const getCase = async (req, res) => {
  const caseRecord = await Case.findOne({ caseId: req.params.caseId });
  if (!caseRecord) {
    return res.status(404).json({ message: "Case not found" });
  }
  return res.json(caseRecord);
};

const createCase = async (req, res) => {
  const { title, description, status, priority, accountIds, flagKeys, transactionIds, assignedTo, notes } =
    req.body || {};

  if (!title || typeof title !== "string") {
    return res.status(400).json({ message: "title is required" });
  }

  const caseRecord = new Case({
    title: title.trim(),
    description: typeof description === "string" ? description : "",
    status,
    priority,
    accountIds: uniqueStrings(accountIds),
    flagKeys: uniqueStrings(flagKeys),
    transactionIds: uniqueStrings(transactionIds),
    assignedTo: assignedTo || null,
    createdBy: req.user?._id || null,
    notes: Array.isArray(notes)
      ? notes
          .filter((n) => n && typeof n.text === "string")
          .map((n) => ({ author: req.user?._id || null, text: n.text }))
      : [],
  });

  const saved = await caseRecord.save();
  return res.status(201).json(saved);
};

const updateCase = async (req, res) => {
  const caseRecord = await Case.findOne({ caseId: req.params.caseId });
  if (!caseRecord) {
    return res.status(404).json({ message: "Case not found" });
  }

  const allowed = ["title", "description", "status", "priority", "assignedTo"];
  for (const field of allowed) {
    if (req.body?.[field] !== undefined) {
      caseRecord[field] = req.body[field];
    }
  }

  if (req.body?.accountIds !== undefined) {
    caseRecord.accountIds = uniqueStrings(req.body.accountIds);
  }
  if (req.body?.flagKeys !== undefined) {
    caseRecord.flagKeys = uniqueStrings(req.body.flagKeys);
  }
  if (req.body?.transactionIds !== undefined) {
    caseRecord.transactionIds = uniqueStrings(req.body.transactionIds);
  }
  if (Array.isArray(req.body?.notes)) {
    const newNotes = req.body.notes
      .filter((n) => n && typeof n.text === "string")
      .map((n) => ({ author: req.user?._id || null, text: n.text }));
    caseRecord.notes = [...caseRecord.notes, ...newNotes];
  }

  const saved = await caseRecord.save();
  return res.json(saved);
};

const deleteCase = async (req, res) => {
  const deleted = await Case.findOneAndDelete({ caseId: req.params.caseId });
  if (!deleted) {
    return res.status(404).json({ message: "Case not found" });
  }
  return res.json({ message: "Case deleted" });
};

export { getCases, getCase, createCase, updateCase, deleteCase };
