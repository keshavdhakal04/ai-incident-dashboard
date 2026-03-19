import { Router, Request, Response } from "express";
import { alertStore } from "../data/mockAlerts";
import { generateSuggestion } from "../services/aiService";
import { AlertStatus } from "../types";
import { Server as SocketIOServer } from "socket.io";

// io is injected when we create the router
export const createAlertRouter = (io: SocketIOServer) => {
  const router = Router();

  router.get("/", (_req: Request, res: Response) => {
    const sorted = [...alertStore].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json({ success: true, data: sorted, total: sorted.length });
  });

  router.get("/:id", (req: Request, res: Response) => {
    const alert = alertStore.find((a) => a.id === req.params.id);
    if (!alert) {
      res.status(404).json({ success: false, message: "Alert not found" });
      return;
    }
    res.json({ success: true, data: alert });
  });

  router.post("/:id/suggestion", async (req: Request, res: Response) => {
  const index = alertStore.findIndex((a) => a.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, message: "Alert not found" });
    return;
  }
  const suggestion = await generateSuggestion(alertStore[index]);
  alertStore[index] = {
    ...alertStore[index],
    suggestion,
    updatedAt: new Date().toISOString(),
  };
  res.json({ success: true, data: alertStore[index] });
});

  router.patch("/:id/status", (req: Request, res: Response) => {
    const { status } = req.body as { status: AlertStatus };
    const validStatuses: AlertStatus[] = [
      "open", "accepted", "rejected", "overridden",
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: "Invalid status value" });
      return;
    }

    const index = alertStore.findIndex((a) => a.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ success: false, message: "Alert not found" });
      return;
    }

    alertStore[index] = {
      ...alertStore[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    // ✅ Broadcast to ALL connected clients
    io.emit("alert:updated", alertStore[index]);
    console.log(`📋 Broadcast status update: ${alertStore[index].title} → ${status}`);

    res.json({ success: true, data: alertStore[index] });
  });

  return router;
};