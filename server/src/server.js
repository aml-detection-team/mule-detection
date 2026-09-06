import express from "express";
import detectionRoutes from "./routes/detection.js";

const app = express();

app.use(express.json());

app.use("/api/detection", detectionRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});