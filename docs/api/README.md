# Backend API Documentation

Base URL: `http://localhost:8000` (configurable via `PORT`).

## Environment variables

See `server/.env.example`.

- `MONGO_URI` - MongoDB connection string.
- `PORT` - HTTP port (default `8000`).
- `CORS_ORIGIN` - Comma-separated allowed origins (default `http://localhost:5173`).
- `JWT_SECRET` - Secret used to sign JWTs (required for auth).
- `JWT_EXPIRES_IN` - Token lifetime (default `24h`).
- `AI_PROVIDER` - AI provider selector.
- `MONGO_TEST_URI` - Optional dedicated test database.

Frontend should set `VITE_API_URL` to the backend base URL (for example `http://localhost:8000`). Frontend files are owned by Person D; this document only describes the contract.

## Authentication

`POST /api/auth/login`

Request:
```json
{ "email": "user@example.com", "password": "secret" }
```

Response `200`:
```json
{ "token": "<jwt>", "user": { "id": "...", "email": "...", "role": "analyst", "name": null, "createdAt": "...", "updatedAt": "..." } }
```

`GET /api/auth/me` (Bearer token required) returns `{ "user": { ... } }`.

JWT payload: `{ sub, email, role, iat, exp }`. Roles: `admin`, `analyst`, `viewer`.

Error statuses: `400` missing fields, `401` invalid/expired/missing token or credentials, `403` insufficient role.

## Accounts

- `GET /api/accounts` - list; optional filters `accountId`, `accountType`, `country`, `customerName`; optional pagination `page`, `limit`; optional `sort`, `order`.
- `GET /api/accounts/:accountId`
- `POST /api/accounts`
- `PUT /api/accounts/:accountId`
- `DELETE /api/accounts/:accountId`

Without `page`/`limit`, responses are arrays (backward compatible). With pagination, response is `{ data, pagination }`.

## Transactions

- `GET /api/transactions` - filters `transactionId`, `fromAccount`, `toAccount`, `currency`, `minAmount`, `maxAmount`; pagination/sort as above.
- `GET /api/transactions/:transactionId`
- `POST /api/transactions`
- `PUT /api/transactions/:transactionId`
- `DELETE /api/transactions/:transactionId`

## Flags

- `GET /api/flags` - filters `pattern`, `riskLevel`, `accountId`, `scenarioKey`; pagination.

Flags are the detection output and also serve as the alert record. No separate Alert entity is introduced to avoid duplicating detection results.

## Detection

- `POST /api/detect` - run detection (body optional: transaction array or `{ transactionIds }`; otherwise loads from MongoDB).
- `GET/POST /api/detection` - compatibility alias reusing the same controller.

## Cases

All case endpoints require authentication.

- `GET /api/cases` - filters `status`, `priority`, `accountId`, `flagKey`; pagination.
- `GET /api/cases/:caseId`
- `POST /api/cases` - `{ title, description?, status?, priority?, accountIds?, flagKeys?, transactionIds?, assignedTo?, notes? }`
- `PUT/PATCH /api/cases/:caseId`
- `DELETE /api/cases/:caseId` - admin only.

Cases link to flags via `flagKeys` and accounts via `accountIds`.

## AI

- `POST /api/ai/explanation` - unchanged (Person C).

## Notes / unresolved decisions

- Role names and registration endpoint are not yet agreed with Person D; only login is implemented. User creation for tests is done via the model.
- Case status/priority enums are defined in `server/src/models/Case.js`; confirm with Person C/D if additional workflow states are required.
- Alert is represented by the existing Flag model; confirm with Person C whether explanation fields need persistence on flags/cases.
