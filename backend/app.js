import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import apiRouter from "./routes/index.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";
import { createSecurityLimiters } from "./middleware/rateLimit.middleware.js";
import {
  requestSecurity,
  validateRequestShape,
} from "./middleware/security.middleware.js";

export function createApp({
  clientOrigin,
  trustProxy = false,
  router = apiRouter,
  rateLimits = {},
}) {
  const app = express();
  const limits = createSecurityLimiters(rateLimits);
  app.disable("x-powered-by");
  app.set("trust proxy", trustProxy);
  app.set("query parser", "simple");
  app.use(helmet());
  app.use("/api", limits.api);
  app.use("/api", requestSecurity(clientOrigin));
  app.use(
    cors({
      origin: new URL(clientOrigin).origin,
      credentials: true,
      methods: ["GET", "HEAD", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.json({ limit: "64kb", inflate: false }));
  app.use(cookieParser());
  app.use("/api", validateRequestShape);
  app.post(
    ["/api/v1/auth/login", "/api/v1/auth/admin/login"],
    limits.loginIp,
    limits.loginAccount,
  );
  app.post("/api/v1/auth/register", limits.registration);
  app.post("/api/v1/auth/refresh", limits.refresh);
  app.locals.writeLimiter = limits.writes;
  app.use("/api/v1", router);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
