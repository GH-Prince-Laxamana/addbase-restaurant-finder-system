import express from "express";
import env from "./config/env.js";
import apiRouter from "./routes/index.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";
import { connectDatabase } from "./config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { apiRateLimiter } from "./middleware/rateLimit.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(apiRateLimiter);

app.use(express.json());

app.use("/api/v1", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

await connectDatabase();

app.listen(env.port, () => {
  console.log(
    `Restaurant Explorer API running on http://localhost:${env.port}`,
  );
});
