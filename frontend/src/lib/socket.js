"use client";
import { io } from "socket.io-client";

const SOCKET_URL = (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SOCKET_URL)
  ? process.env.NEXT_PUBLIC_SOCKET_URL
  : (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : (process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"));

let socket = null;

export function getSocket() {
  if (socket) return socket;
  socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
