import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import aiRoutes from "./routes/aiRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import legacyDetectionRoutes from "./routes/detection.js";
import flagRoutes from "./routes/flagRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Mule Detection API is running",
  });
});

app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/flags", flagRoutes);

app.use("/api/detect", detectionRoutes);

// Person B's existing detection API.
app.use("/api/detection", legacyDetectionRoutes);

app.use("/api/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Central error handler.
app.use(errorHandler);

async function startServer() {
  await connectDB();

  const port = Number(process.env.PORT) || 8000;

  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
  });

  return server;
}

export { app, startServer };

const isMainModule =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMainModule) {
  startServer().catch((error) => {
    console.error("Unable to start the API:", error.message);
    process.exitCode = 1;
  });
}
