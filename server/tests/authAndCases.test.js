import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { app } from "../src/server.js";
import Account from "../src/models/Account.js";
import Flag from "../src/models/Flag.js";
import Transaction from "../src/models/Transaction.js";
import User from "../src/models/User.js";
import Case from "../src/models/Case.js";
import connectDB from "../src/config/db.js";

process.env.JWT_SECRET = "test-secret-for-jest";
process.env.JWT_EXPIRES_IN = "1h";

jest.setTimeout(30_000);

const databaseIntegration = process.env.MONGO_TEST_URI ? describe : describe.skip;

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return { status: response.status, body };
}

databaseIntegration("Auth, cases, and pagination", () => {
  let httpServer;
  let baseUrl;

  beforeAll(async () => {
    await connectDB(process.env.MONGO_TEST_URI);
    await Promise.all([
      Account.init(),
      Transaction.init(),
      Flag.init(),
      User.init(),
      Case.init(),
    ]);

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
      User.deleteMany({}),
      Case.deleteMany({}),
    ]);
  });

  afterAll(async () => {
    if (httpServer) await new Promise((resolve) => httpServer.close(resolve));
    await mongoose.disconnect();
  });

  async function createUser(email, password, role = "analyst") {
    const passwordHash = await User.hashPassword(password);
    return User.create({ email, passwordHash, role });
  }

  async function login(email, password) {
    return request(baseUrl, "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }

  test("login succeeds with correct credentials and rejects bad ones", async () => {
    await createUser("analyst@example.com", "password123", "analyst");

    const ok = await login("analyst@example.com", "password123");
    expect(ok.status).toBe(200);
    expect(typeof ok.body.token).toBe("string");
    expect(ok.body.user.email).toBe("analyst@example.com");
    expect(ok.body.user).not.toHaveProperty("passwordHash");

    const wrong = await login("analyst@example.com", "wrong");
    expect(wrong.status).toBe(401);

    const missing = await request(baseUrl, "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "analyst@example.com" }),
    });
    expect(missing.status).toBe(400);
  });

  test("protected routes reject missing/invalid/expired tokens and enforce roles", async () => {
    await createUser("admin@example.com", "password123", "admin");
    await createUser("viewer@example.com", "password123", "viewer");

    const adminLogin = await login("admin@example.com", "password123");
    const viewerLogin = await login("viewer@example.com", "password123");
    const adminToken = adminLogin.body.token;
    const viewerToken = viewerLogin.body.token;

    const noToken = await request(baseUrl, "/api/cases");
    expect(noToken.status).toBe(401);

    const badToken = await request(baseUrl, "/api/cases", {
      headers: { Authorization: "Bearer not-a-token" },
    });
    expect(badToken.status).toBe(401);

    // expired token
    const jwt = (await import("jsonwebtoken")).default;
    const expired = jwt.sign(
      { sub: "000000000000000000000000", email: "x@y.com", role: "viewer", exp: Math.floor(Date.now() / 1000) - 10 },
      "test-secret-for-jest",
    );
    const expiredRes = await request(baseUrl, "/api/cases", {
      headers: { Authorization: `Bearer ${expired}` },
    });
    expect(expiredRes.status).toBe(401);

    // viewer cannot delete (admin only)
    const created = await request(baseUrl, "/api/cases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ title: "Case 1" }),
    });
    expect(created.status).toBe(201);
    const caseId = created.body.caseId;

    const forbidden = await request(baseUrl, `/api/cases/${caseId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${viewerToken}` },
    });
    expect(forbidden.status).toBe(403);

    const allowed = await request(baseUrl, `/api/cases/${caseId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(allowed.status).toBe(200);
  });

  test("case CRUD, relationships, validation, and pagination", async () => {
    await createUser("analyst@example.com", "password123", "analyst");
    const l = await login("analyst@example.com", "password123");
    const token = l.body.token;
    const auth = { Authorization: `Bearer ${token}` };

    const created = await request(baseUrl, "/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...auth },
      body: JSON.stringify({
        title: "Investigate ring",
        accountIds: ["ACC_A", "ACC_A", "ACC_B"],
        flagKeys: ["FLAG_1"],
        transactionIds: ["TX_1"],
        priority: "HIGH",
      }),
    });
    expect(created.status).toBe(201);
    expect(created.body.accountIds).toEqual(["ACC_A", "ACC_B"]);
    expect(created.body.flagKeys).toEqual(["FLAG_1"]);

    const list = await request(baseUrl, "/api/cases", { headers: auth });
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.data)).toBe(true);
    expect(list.body.data).toHaveLength(1);

    const got = await request(baseUrl, `/api/cases/${created.body.caseId}`, {
      headers: auth,
    });
    expect(got.status).toBe(200);

    const updated = await request(baseUrl, `/api/cases/${created.body.caseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...auth },
      body: JSON.stringify({ status: "IN_REVIEW", flagKeys: ["FLAG_1", "FLAG_2"] }),
    });
    expect(updated.status).toBe(200);
    expect(updated.body.status).toBe("IN_REVIEW");
    expect(updated.body.flagKeys).toEqual(["FLAG_1", "FLAG_2"]);

    const invalid = await request(baseUrl, "/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...auth },
      body: JSON.stringify({}),
    });
    expect(invalid.status).toBe(400);

    const missing = await request(baseUrl, "/api/cases/NOPE", { headers: auth });
    expect(missing.status).toBe(404);
  });

  test("pagination and filters for accounts/transactions/flags", async () => {
    await createUser("analyst@example.com", "password123", "analyst");
    const l = await login("analyst@example.com", "password123");
    const token = l.body.token;
    // accounts/transactions/flags remain public; auth not required
    await Account.create([
      { accountId: "A1", customerName: "Alice", accountType: "savings", country: "IN", createdAt: new Date() },
      { accountId: "A2", customerName: "Bob", accountType: "current", country: "US", createdAt: new Date() },
    ]);

    const all = await request(baseUrl, "/api/accounts");
    expect(all.status).toBe(200);
    expect(all.body).toHaveLength(2);

    const filtered = await request(baseUrl, "/api/accounts?country=IN");
    expect(filtered.status).toBe(200);
    expect(filtered.body).toHaveLength(1);

    const page = await request(baseUrl, "/api/accounts?page=1&limit=1");
    expect(page.status).toBe(200);
    expect(page.body.data).toHaveLength(1);
    expect(page.body.pagination.total).toBe(2);
  });
});
