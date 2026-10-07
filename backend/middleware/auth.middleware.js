import jwt from "jsonwebtoken";
import env from "../config/env.js";

export function authenticate(req, res, next) {
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

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    return res.status(401).json({
      error: {
        code: "INVALID_ACCESS_TOKEN",
        message: "Your access token is invalid or expired.",
      },
    });
  }
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
