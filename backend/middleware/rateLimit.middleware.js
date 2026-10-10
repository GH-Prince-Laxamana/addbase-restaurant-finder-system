import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { createHash } from "node:crypto";

// Each app instance owns its counters. Use a shared store before scaling to
// multiple processes (see SECURITY.md).
export function createSecurityLimiters(overrides = {}) {
  const create = (identifier, limit, windowMs, options = {}) =>
    rateLimit({
      identifier,
      windowMs,
      limit,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Too many requests. Please try again later.",
        },
      },
      ...options,
      ...overrides[identifier],
    });
  const quarterHour = 15 * 60 * 1000;
  return {
    api: create("api", 300, quarterHour),
    loginIp: create("login-ip", 20, quarterHour, {
      skipSuccessfulRequests: true,
    }),
    loginAccount: create("login-account", 10, quarterHour, {
      skipSuccessfulRequests: true,
      keyGenerator: (req) =>
        typeof req.body?.email === "string"
          ? createHash("sha256")
              .update(req.body.email.trim().toLowerCase())
              .digest("hex")
          : ipKeyGenerator(req.ip),
    }),
    registration: create("registration", 5, 60 * 60 * 1000),
    refresh: create("refresh", 60, quarterHour),
    writes: create("writes", 60, quarterHour, {
      keyGenerator: (req) => req.user?.id ?? ipKeyGenerator(req.ip),
    }),
  };
}
