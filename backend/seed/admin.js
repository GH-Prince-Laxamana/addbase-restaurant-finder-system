import mongoose from "mongoose";
import env from "../config/env.js";
import User from "../models/User.js";
import { hashPassword } from "../utils/auth.js";

async function run() {
  try {
    const name = env.adminName?.trim();
    const email = env.adminEmail?.trim().toLowerCase();
    const password = env.adminPassword;

    if (!name || !email || !password) {
      throw new Error(
        "ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required.",
      );
    }

    if (password.length < 8) {
      throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
    }

    await mongoose.connect(env.mongodbUri);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role !== "admin") {
        throw new Error("A regular user already exists with this email.");
      }

      console.log("Admin account already exists.");
      return;
    }

    const passwordHash = await hashPassword(password);

    await User.create({
      name,
      email,
      passwordHash,
      role: "admin",
    });

    console.log("Admin account created.");
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
