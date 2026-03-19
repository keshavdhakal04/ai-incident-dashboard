import { useState, useCallback, useEffect } from "react";
import type { Severity, AlertStatus, Alert } from "./types";
import { useAlerts } from "./hooks/useAlerts";
import { useSocket } from "./hooks/useSocket";
import { useToast } from "./hooks/useToast";
import { Header } from "./components/Header";
import { AlertList } from "./components/AlertList";
import { AlertDetail } from "./components/AlertDetail";
import { StatsBar } from "./components/StatsBar";
import { ToastContainer } from "./components/Toast";

function App() {
  const { alerts, isLoading, error, updateAlert, addAlert } = useAlerts();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<Severity | "all">("all");
  const [filterStatus, setFilterStatus] = useState<AlertStatus | "all">("all");
  const [isConnected, setIsConnected] = useState(false);
  const [newAlertIds, setNewAlertIds] = useState<Set<string>>(new Set());
  const { toasts, addToast, removeToast } = useToast();

  // ── Handle new real-time alert ─────────────────────────────────────
  const handleNewAlert = useCallback(
    (alert: Alert) => {
      addAlert(alert);
      // Track as "new" for animation
      setNewAlertIds((prev) => new Set(prev).add(alert.id));
      // Remove "new" badge after 5 seconds
      setTimeout(() => {
        setNewAlertIds((prev) => {
          const next = new Set(prev);
          next.delete(alert.id);
          return next;
        });
      }, 5000);
      addToast(`New alert: ${alert.title}`, alert.severity === "high" ? "error" : "warning");
    },
    [addAlert, addToast]
  );

  const handleAlertUpdated = useCallback(
    (alert: Alert) => updateAlert(alert),
    [updateAlert]
  );

  const handleConnected = useCallback(() => {
    setIsConnected(true);
    addToast("Connected to live feed", "success");
  }, [addToast]);

  const handleDisconnected = useCallback(() => {
    setIsConnected(false);
    addToast("Lost connection — attempting to reconnect", "error");
  }, [addToast]);

  // ── WebSocket ──────────────────────────────────────────────────────
  useSocket({
    onNewAlert: handleNewAlert,
    onAlertUpdated: handleAlertUpdated,
    onConnected: handleConnected,
    onDisconnected: handleDisconnected,
  });

  // ── Keyboard shortcut: Escape to deselect ─────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const selectedAlert = alerts.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="flex flex-col h-screen bg-surface overflow-hidden">
      {/* Header */}
      <Header alertCount={alerts.length} isConnected={isConnected} />

      {/* Stats bar */}
      <StatsBar alerts={alerts} />

      {/* Main two-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-full max-w-sm border-r border-surface-border flex flex-col shrink-0">
          <AlertList
            alerts={alerts}
            isLoading={isLoading}
            error={error}
            selectedId={selectedId}
            newAlertIds={newAlertIds}
            onSelect={setSelectedId}
            filterSeverity={filterSeverity}
            filterStatus={filterStatus}
            onFilterSeverity={setFilterSeverity}
            onFilterStatus={setFilterStatus}
          />
        </div>

        {/* Right panel */}
        <div className="flex-1 glass-panel rounded-none border-0">
          <AlertDetail
            alert={selectedAlert}
            onAlertUpdated={updateAlert}
            onAction={addToast}
          />
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;