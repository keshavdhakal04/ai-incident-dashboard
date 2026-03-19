import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import alertRoutes from "./routes/alerts";
import { initializeSocket } from "./socket/alertSocket";
import { alertStore } from "./data/mockAlerts";
import { generateSuggestion } from "./services/aiService";

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH"],
  },
});

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
}));
app.use(express.json());

// Pre-generate AI suggestions for seed data
alertStore.forEach((alert, index) => {
  alertStore[index].suggestion = generateSuggestion(alert);
});

app.use("/api/alerts", alertRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "AI Incident Dashboard API is running",
    timestamp: new Date().toISOString(),
    alertCount: alertStore.length,
  });
});

initializeSocket(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`
🚀 Server running on http://localhost:${PORT}
📡 WebSocket server ready
🔍 Health check: http://localhost:${PORT}/api/health
  `);
});