import { useState } from "react";
import type { Severity, AlertStatus } from "./types";
import { useAlerts } from "./hooks/useAlerts";
import { Header } from "./components/Header";
import { AlertList } from "./components/AlertList";
import { AlertDetail } from "./components/AlertDetail";

function App() {
  const { alerts, isLoading, error, updateAlert} = useAlerts();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<Severity | "all">("all");
  const [filterStatus, setFilterStatus] = useState<AlertStatus | "all">("all");

  const selectedAlert = alerts.find((a) => a.id === selectedId) ?? null;

  return (
    <div className="flex flex-col h-screen bg-surface overflow-hidden">
      {/* Top header bar */}
      <Header
        alertCount={alerts.length}
        isConnected={false}
      />

      {/* Main content: two-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Alert list */}
        <div className="w-full max-w-sm border-r border-surface-border flex flex-col shrink-0">
          <AlertList
            alerts={alerts}
            isLoading={isLoading}
            error={error}
            selectedId={selectedId}
            onSelect={setSelectedId}
            filterSeverity={filterSeverity}
            filterStatus={filterStatus}
            onFilterSeverity={setFilterSeverity}
            onFilterStatus={setFilterStatus}
          />
        </div>

        {/* Right panel: Alert detail */}
        <div className="flex-1 glass-panel rounded-none border-0">
          <AlertDetail
            alert={selectedAlert}
            onAlertUpdated={updateAlert}
          />
        </div>
      </div>
    </div>
  );
}

export default App;