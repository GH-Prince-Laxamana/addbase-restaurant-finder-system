import env from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { createApp } from "./app.js";
const app = createApp(env);

await connectDatabase();

const server = app.listen(env.port, () => {
  console.log(
    `Restaurant Explorer API running on http://localhost:${env.port}`,
  );
});
server.requestTimeout = 30000;
server.headersTimeout = 10000;
