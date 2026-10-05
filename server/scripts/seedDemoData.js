import { readFile } from "node:fs/promises";
import mongoose from "mongoose";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import connectDB from "../src/config/db.js";
import Account from "../src/models/Account.js";
import Transaction from "../src/models/Transaction.js";

async function readJsonArray(fileUrl, label) {
  const contents = await readFile(fileUrl, "utf8");
  const data = JSON.parse(contents);

  if (!Array.isArray(data)) {
    throw new Error(`${label} seed data must be a JSON array`);
  }

  return data;
}

async function loadGeneratedData() {
  const [accounts, transactions] = await Promise.all([
    readJsonArray(
      new URL("../../data/output/accounts.json", import.meta.url),
      "Account",
    ),
    readJsonArray(
      new URL("../../data/output/transactions.json", import.meta.url),
      "Transaction",
    ),
  ]);

  return { accounts, transactions };
}

async function seedDemoData(data) {
  const seedData = data ?? (await loadGeneratedData());
  const { accounts, transactions } = seedData;

  if (!Array.isArray(accounts) || !Array.isArray(transactions)) {
    throw new Error("Seed data must contain accounts[] and transactions[]");
  }

  if (accounts.length > 0) {
    await Account.bulkWrite(
      accounts.map((account) => ({
        updateOne: {
          filter: { accountId: account.accountId },
          update: { $set: account },
          upsert: true,
        },
      })),
      { ordered: true },
    );
  }

  if (transactions.length > 0) {
    await Transaction.bulkWrite(
      transactions.map((transaction) => ({
        updateOne: {
          filter: { transactionId: transaction.transactionId },
          update: { $set: transaction },
          upsert: true,
        },
      })),
      { ordered: true },
    );
  }

  return {
    accountCount: accounts.length,
    transactionCount: transactions.length,
  };
}

async function runSeedScript() {
  try {
    await connectDB();
    const { accountCount, transactionCount } = await seedDemoData();
    console.log(
      `Seeded ${accountCount} accounts and ${transactionCount} transactions. ` +
        "Existing matching demo records were updated; other records were kept.",
    );
  } finally {
    await mongoose.disconnect();
  }
}

const isMainModule =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMainModule) {
  runSeedScript().catch((error) => {
    console.error("Demo seed failed:", error.message);
    process.exitCode = 1;
  });
}

export { loadGeneratedData, seedDemoData };
