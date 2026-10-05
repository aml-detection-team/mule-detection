import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";

import aiRoutes from "./routes/aiRoutes.js";
import detectTransactions from "./controllers/detectionController.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import detectionRoutes from "./routes/detection.js";

const app = express();

// Allow requests from the React/Vite frontend.
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

// Your existing detection endpoint.
app.post("/api/detect", detectTransactions);

// B's detection API.
app.use("/api/detection", detectionRoutes);

const PORT = 8000;

app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
