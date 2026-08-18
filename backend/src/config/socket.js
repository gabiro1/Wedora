import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",").map((o) => o.trim());
  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => { if (!origin || allowedOrigins.includes(origin)) { callback(null, true); } else { callback(new Error("Not allowed by CORS")); } },
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    socket.on("join:wedding", (weddingId) => {
      socket.join(`wedding:${weddingId}`);
    });

    socket.on("join:mc", (weddingId) => {
      socket.join(`mc:${weddingId}`);
    });

    socket.on("join:wall", (weddingId) => {
      socket.join(`wall:${weddingId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};

export const emitToWedding = (weddingId, event, data) => {
  getIO().to(`wedding:${weddingId}`).emit(event, data);
};

export const emitToMC = (weddingId, event, data) => {
  getIO().to(`mc:${weddingId}`).emit(event, data);
};

export const emitToWall = (weddingId, event, data) => {
  getIO().to(`wall:${weddingId}`).emit(event, data);
};
