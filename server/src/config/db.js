import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "node:url";

// Load server/.env even when the backend is started from the repository root.
dotenv.config({
  path: fileURLToPath(new URL("../../.env", import.meta.url)),
  quiet: true,
});

const connectDB = async (uri = process.env.MONGO_URI) => {
  if (!uri) {
    throw new Error(
      "MONGO_URI is not set. Add it to server/.env or the process environment.",
    );
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
    return mongoose.connection;
  } catch (error) {
    // Do not log the connection string; it may contain credentials.
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
