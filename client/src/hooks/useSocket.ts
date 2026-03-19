import { useEffect, useRef } from "react";
import type { Alert } from "../types";
import { getSocket, disconnectSocket } from "../services/socket";

type UseSocketProps = {
  onNewAlert: (alert: Alert) => void;
  onAlertUpdated: (alert: Alert) => void;
  onConnected: () => void;
  onDisconnected: () => void;
};

export const useSocket = ({
  onNewAlert,
  onAlertUpdated,
  onConnected,
  onDisconnected,
}: UseSocketProps) => {
  // Use refs so event handlers always have fresh callbacks
  // without needing to re-register listeners on every render
  const onNewAlertRef = useRef(onNewAlert);
  const onAlertUpdatedRef = useRef(onAlertUpdated);
  const onConnectedRef = useRef(onConnected);
  const onDisconnectedRef = useRef(onDisconnected);

  // Keep refs in sync with latest callbacks
  useEffect(() => {
    onNewAlertRef.current = onNewAlert;
    onAlertUpdatedRef.current = onAlertUpdated;
    onConnectedRef.current = onConnected;
    onDisconnectedRef.current = onDisconnected;
  });

  useEffect(() => {
    const socket = getSocket();

    // ── Connection events ────────────────────────────────────────────
    const handleConnect = () => {
      console.log("🟢 WebSocket connected:", socket.id);
      onConnectedRef.current();
    };

    const handleDisconnect = (reason: string) => {
      console.log("🔴 WebSocket disconnected:", reason);
      onDisconnectedRef.current();
    };

    const handleConnectError = (err: Error) => {
      console.error("WebSocket connection error:", err.message);
      onDisconnectedRef.current();
    };

    // ── Alert events ─────────────────────────────────────────────────
    const handleNewAlert = (alert: Alert) => {
      console.log("🚨 New alert received:", alert.title);
      onNewAlertRef.current(alert);
    };

    const handleAlertUpdated = (alert: Alert) => {
      console.log("📋 Alert updated:", alert.id);
      onAlertUpdatedRef.current(alert);
    };

    // ── Register listeners ───────────────────────────────────────────
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("alert:new", handleNewAlert);
    socket.on("alert:updated", handleAlertUpdated);

    // If already connected when hook mounts, fire immediately
    if (socket.connected) {
      onConnectedRef.current();
    }

    // ── Cleanup: remove listeners on unmount ─────────────────────────
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("alert:new", handleNewAlert);
      socket.off("alert:updated", handleAlertUpdated);
    };
  }, []); // Empty deps — only runs once on mount/unmount
};