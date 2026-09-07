import express from "express";
import cors from "cors";
import detectionRoutes from "./routes/detection.js";

const app = express();

// Allow requests from the React/Vite frontend
app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// Detection API
app.use("/api/detection", detectionRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});