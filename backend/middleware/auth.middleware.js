import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/User.js";

export async function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: {
        code: "AUTHENTICATION_REQUIRED",
        message: "Authentication is required.",
      },
    });
  }

  const token = authorization.slice(7);

  let payload;
  try {
    payload = jwt.verify(token, env.jwtAccessSecret, { algorithms: ["HS256"] });
    if (
      typeof payload !== "object" ||
      !/^[a-f\d]{24}$/i.test(payload.sub) ||
      !["user", "admin"].includes(payload.role)
    )
      throw new Error("Invalid token claims");
  } catch {
    return res.status(401).json({
      error: {
        code: "INVALID_ACCESS_TOKEN",
        message: "Your access token is invalid or expired.",
      },
    });
  }
  if (!payload) return;
  try {
    const user = await User.findById(payload.sub).select("role").lean();
    if (!user)
      return res
        .status(401)
        .json({
          error: {
            code: "INVALID_ACCESS_TOKEN",
            message: "Your access token is invalid or expired.",
          },
        });
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (error) {
    next(error);
  }
}

export function limitWrites(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  return req.app.locals.writeLimiter(req, res, next);
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      error: {
        code: "ADMIN_ACCESS_REQUIRED",
        message: "Administrator access is required.",
      },
    });
  }

  next();
}
