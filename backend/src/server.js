import { createServer } from "http";
import app from "./app.js";
import { initSocket } from "./config/socket.js";
import { env } from "./config/env.js";

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(env.PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║          WEDORA SERVER RUNNING           ║
  ║  Port: ${env.PORT}                              ║
  ║  Mode: ${env.NODE_ENV.padEnd(33)}║
  ║  http://localhost:${env.PORT}                  ║
  ╚══════════════════════════════════════════╝
  `);
});

process.on("unhandledRejection", (err) => {
  console.error("[FATAL] Unhandled rejection:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught exception:", err.message);
  process.exit(1);
});
