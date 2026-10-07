import mongoose from "mongoose";
import env from "./env.js";

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongodbUri, {
      autoIndex: env.nodeEnv !== "production",
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
