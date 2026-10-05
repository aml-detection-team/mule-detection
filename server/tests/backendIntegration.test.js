import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { app } from "../src/server.js";
import Account from "../src/models/Account.js";
import Flag from "../src/models/Flag.js";
import Transaction from "../src/models/Transaction.js";
import connectDB from "../src/config/db.js";
import { seedDemoData } from "../scripts/seedDemoData.js";

jest.setTimeout(30_000);

const databaseIntegration = process.env.MONGO_TEST_URI
  ? describe
  : describe.skip;

const seededAccounts = [
  {
    accountId: "ACC_TEST_A",
    customerName: "Test Account A",
    accountType: "savings",
    country: "IN",
    createdAt: "2026-09-01T10:00:00.000Z",
  },
  {
    accountId: "ACC_TEST_B",
    customerName: "Test Account B",
    accountType: "current",
    country: "IN",
    createdAt: "2026-09-01T10:00:00.000Z",
  },
  {
    accountId: "ACC_TEST_C",
    customerName: "Test Account C",
    accountType: "savings",
    country: "IN",
    createdAt: "2026-09-01T10:00:00.000Z",
  },
];

const seededTransactions = [
  {
    transactionId: "TX_TEST_001",
    fromAccount: "ACC_TEST_A",
    toAccount: "ACC_TEST_B",
    amount: 50000,
    currency: "INR",
    timestamp: "2026-09-01T10:05:00.000Z",
  },
  {
    transactionId: "TX_TEST_002",
    fromAccount: "ACC_TEST_B",
    toAccount: "ACC_TEST_C",
    amount: 50000,
    currency: "INR",
    timestamp: "2026-09-01T10:10:00.000Z",
  },
  {
    transactionId: "TX_TEST_003",
    fromAccount: "ACC_TEST_C",
    toAccount: "ACC_TEST_A",
    amount: 50000,
    currency: "INR",
    timestamp: "2026-09-01T10:15:00.000Z",
  },
];

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  return {
    status: response.status,
    body: await response.json(),
  };
}

databaseIntegration(
  "MongoDB backend integration (set MONGO_TEST_URI to a dedicated test database)",
  () => {
    let httpServer;
    let baseUrl;

    beforeAll(async () => {
      // This URI is explicit so tests never accidentally clear the demo DB.
      await connectDB(process.env.MONGO_TEST_URI);
      await Promise.all([Account.init(), Transaction.init(), Flag.init()]);

      httpServer = await new Promise((resolve, reject) => {
        const server = app.listen(0, "127.0.0.1", () => resolve(server));
        server.once("error", reject);
      });
      baseUrl = `http://127.0.0.1:${httpServer.address().port}`;
    });

    beforeEach(async () => {
      await Promise.all([
        Account.deleteMany({}),
        Transaction.deleteMany({}),
        Flag.deleteMany({}),
      ]);
    });

    afterAll(async () => {
      if (httpServer) {
        await new Promise((resolve) => httpServer.close(resolve));
      }

      await mongoose.disconnect();
    });

    test("connects to MongoDB and exposes account and transaction reads", async () => {
      expect(mongoose.connection.readyState).toBe(1);

      const initialAccounts = await request(baseUrl, "/api/accounts");
      const initialTransactions = await request(baseUrl, "/api/transactions");
      expect(initialAccounts.status).toBe(200);
      expect(initialAccounts.body).toEqual([]);
      expect(initialTransactions.status).toBe(200);
      expect(initialTransactions.body).toEqual([]);

      await seedDemoData({
        accounts: seededAccounts,
        transactions: seededTransactions,
      });

      const accounts = await request(baseUrl, "/api/accounts");
      const transactions = await request(baseUrl, "/api/transactions");
      const transaction = await request(
        baseUrl,
        "/api/transactions/TX_TEST_001",
      );

      expect(accounts.status).toBe(200);
      expect(accounts.body).toHaveLength(3);
      expect(transactions.status).toBe(200);
      expect(transactions.body).toHaveLength(3);
      expect(transaction.status).toBe(200);
      expect(transaction.body.transactionId).toBe("TX_TEST_001");

      // Re-seeding matching IDs refreshes records rather than duplicating them.
      await seedDemoData({
        accounts: seededAccounts,
        transactions: seededTransactions,
      });
      expect(await Account.countDocuments()).toBe(3);
      expect(await Transaction.countDocuments()).toBe(3);
    });

    test("loads seeded transactions, detects a scenario, and upserts flags", async () => {
      await seedDemoData({
        accounts: seededAccounts,
        transactions: seededTransactions,
      });

      // No transaction array is sent: /api/detect gets records from MongoDB.
      const firstRun = await request(baseUrl, "/api/detect", {
        method: "POST",
      });

      expect(firstRun.status).toBe(200);
      expect(firstRun.body.detections).toHaveLength(1);
      expect(firstRun.body.detections[0].pattern).toBe("circular_flow");
      expect(firstRun.body.riskResult.riskLevel).toBe("HIGH");
      expect(firstRun.body.accountRisks).toHaveLength(3);
      expect(firstRun.body.flagCount).toBe(3);
      expect(firstRun.body.flags).toHaveLength(3);

      const listedFlags = await request(baseUrl, "/api/flags");
      expect(listedFlags.status).toBe(200);
      expect(listedFlags.body).toHaveLength(3);
      expect(listedFlags.body.map((flag) => flag.accountId).sort()).toEqual([
        "ACC_TEST_A",
        "ACC_TEST_B",
        "ACC_TEST_C",
      ]);
      expect(listedFlags.body[0]).toMatchObject({
        pattern: "circular_flow",
        riskLevel: "HIGH",
        riskScore: 60,
      });

      const secondRun = await request(baseUrl, "/api/detect", {
        method: "POST",
      });
      expect(secondRun.status).toBe(200);
      expect(await Flag.countDocuments()).toBe(3);
    });

    test("preserves the existing direct transaction-array detection request", async () => {
      const result = await request(baseUrl, "/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seededTransactions),
      });

      expect(result.status).toBe(200);
      expect(result.body.detections[0].pattern).toBe("circular_flow");
      expect(await Flag.countDocuments()).toBe(3);
    });
  },
);
