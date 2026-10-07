import express from "express";
import env from "./config/env.js";
import apiRouter from "./routes/index.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/error.middleware.js";
import { connectDatabase } from "./config/database.js";

const app = express();

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
