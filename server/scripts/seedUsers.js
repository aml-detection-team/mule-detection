import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import User from "../src/models/User.js";

const users = [
  {
    email: "admin@mule.local",
    name: "Admin",
    role: "admin",
    password: "Admin@123",
  },
  {
    email: "analyst@mule.local",
    name: "Analyst",
    role: "analyst",
    password: "Analyst@123",
  },
  {
    email: "viewer@mule.local",
    name: "Viewer",
    role: "viewer",
    password: "Viewer@123",
  },
];

await connectDB();

for (const { password, ...rest } of users) {
  const passwordHash = await User.hashPassword(password);
  await User.findOneAndUpdate(
    { email: rest.email },
    { ...rest, passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log(`Seeded ${rest.role}: ${rest.email}`);
}

await mongoose.disconnect();
