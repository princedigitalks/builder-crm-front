import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    let socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    
    // To prevent "Invalid namespace" error, extract only the origin from the URL.
    // If the URL is "http://domain.com/api", io() will try to connect to namespace "/api".
    try {
      const url = new URL(socketUrl);
      socketUrl = url.origin; // This gives http://localhost:5000 or https://di.co.in
    } catch (e) {
      console.error("[Socket] Invalid URL in NEXT_PUBLIC_SOCKET_URL:", socketUrl);
    }

    console.log("[Socket] Initializing connection to:", socketUrl, "with path: /api/socket.io");
    
    socket = io(socketUrl, {
      path: "/api/socket.io",
      transports: ["websocket", "polling"], // Ensure compatibility
    });

    socket.on("connect", () => {
      console.log(">>> [Socket] CONNECTED SUCCESS:", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });
  }
  return socket;
};
