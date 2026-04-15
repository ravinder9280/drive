import "dotenv/config";

import * as http from "node:http";

import app from "./app";
import { connectDb } from "./config/db";

const port = Number(process.env.PORT) || 3001;

const init = async (): Promise<void> => {
  await connectDb();
  const server = http.createServer(app);

  server.listen(port, "::", () => {
    console.log(`API http server running on port ${port}`);
  });
};


init().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
