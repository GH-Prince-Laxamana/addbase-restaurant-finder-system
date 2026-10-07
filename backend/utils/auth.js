import crypto from "node:crypto";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export async function hashPassword(password) {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
}

export async function verifyPassword(password, passwordHash) {
  return argon2.verify(passwordHash, password);
}

export function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    env.jwtAccessSecret,
    {
      expiresIn: env.accessTokenExpiresIn,
    },
  );
}

export function createRefreshToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
    },
    env.jwtRefreshSecret,
    {
      expiresIn: env.refreshTokenExpiresIn,
    },
  );
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
