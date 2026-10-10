import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import env from "../config/env.js";
import {
  createAccessToken,
  createRefreshToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from "../utils/auth.js";

function getRefreshTokenExpirationDate() {
  return new Date(Date.now() + env.refreshTokenMaxAgeMs);
}

export async function registerUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    const error = new Error("An account with that email already exists.");
    error.statusCode = 409;
    error.code = "EMAIL_ALREADY_REGISTERED";
    throw error;
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "user",
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function authenticateAdminUser({ email, password }) {
  const user = await authenticateUser({ email, password });

  if (user.role !== "admin") {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  return user;
}

export async function authenticateUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+passwordHash");

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);

  if (!passwordValid) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  return user;
}

export async function createAuthTokens(user) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: getRefreshTokenExpirationDate(),
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function refreshAuthentication(refreshToken) {
  let payload;

  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch {
    const error = new Error("Invalid or expired refresh token.");
    error.statusCode = 401;
    error.code = "INVALID_REFRESH_TOKEN";
    throw error;
  }

  const tokenHash = hashToken(refreshToken);

  const now = new Date();

  const storedToken = await RefreshToken.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
      expiresAt: { $gt: now },
    },
    {
      $set: { revokedAt: now },
    },
    {
      new: true,
    },
  );

  if (!storedToken) {
    const error = new Error("Invalid or expired refresh token.");
    error.statusCode = 401;
    error.code = "INVALID_REFRESH_TOKEN";
    throw error;
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    const error = new Error("User account no longer exists.");
    error.statusCode = 401;
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  return createAuthTokens(user);
}

export async function revokeRefreshToken(refreshToken) {
  if (!refreshToken) {
    return;
  }

  await RefreshToken.findOneAndUpdate(
    {
      tokenHash: hashToken(refreshToken),
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
    },
  );
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User account no longer exists.");
    error.statusCode = 401;
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
