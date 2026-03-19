import { Server as SocketIOServer, Socket } from "socket.io";
import { alertStore } from "../data/mockAlerts";
import { generateSuggestion, generateRandomAlert } from "../services/aiService";
import { Alert } from "../types";
import { v4 as uuidv4 } from "uuid";

let simulationInterval: NodeJS.Timeout | null = null;

export const initializeSocket = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    socket.emit("alerts:count", { count: alertStore.length });

    socket.on("alert:requestSuggestion", async (alertId: string) => {
      const alert = alertStore.find((a) => a.id === alertId);
      if (!alert) return;

      const suggestion = await generateSuggestion(alert);
      const index = alertStore.findIndex((a) => a.id === alertId);
      alertStore[index] = {
        ...alertStore[index],
        suggestion,
        updatedAt: new Date().toISOString(),
      };

      io.emit("alert:updated", alertStore[index]);
    });

    socket.on(
      "alert:updateStatus",
      ({ alertId, status }: { alertId: string; status: string }) => {
        const index = alertStore.findIndex((a) => a.id === alertId);
        if (index === -1) return;

        alertStore[index] = {
          ...alertStore[index],
          status: status as Alert["status"],
          updatedAt: new Date().toISOString(),
        };

        io.emit("alert:updated", alertStore[index]);
        console.log(`📋 Alert ${alertId} status → ${status}`);
      }
    );

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  if (!simulationInterval) {
    simulationInterval = setInterval(async () => {
      if (io.engine.clientsCount === 0) return;

      const newAlertData = generateRandomAlert();
      const now = new Date().toISOString();
      const newAlert: Alert = {
        id: uuidv4(),
        ...newAlertData,
        suggestion: undefined,
        createdAt: now,
        updatedAt: now,
      };

      newAlert.suggestion = await generateSuggestion(newAlert);
      alertStore.unshift(newAlert);
      io.emit("alert:new", newAlert);
      console.log(`🚨 New simulated alert: ${newAlert.title}`);
    }, 30000);
  }
};
