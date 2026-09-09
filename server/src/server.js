import express from "express";
import aiRoutes from "./routes/aiRoutes.js";
import detectTransactions from "./controllers/detectionController.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Mule Detection API is running"
    });
});

app.post("/api/detect", detectTransactions);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.use(
    "/api/ai",
    aiRoutes
);