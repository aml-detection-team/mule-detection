import connectDB from "./config/db.js";
import express from "express";
import aiRoutes from "./routes/aiRoutes.js";
import detectTransactions from "./controllers/detectionController.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Mule Detection API is running",
  });
});

app.post("/api/detect", detectTransactions);

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
