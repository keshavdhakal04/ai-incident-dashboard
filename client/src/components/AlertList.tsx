import type { Alert, Severity, AlertStatus } from "../types";
import { AlertCard } from "./AlertCard";
import { LoadingSpinner } from "./LoadingSpinner";

type Props = {
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
  selectedId: string | null;
  newAlertIds: Set<string>;
  onSelect: (id: string) => void;
  filterSeverity: Severity | "all";
  filterStatus: AlertStatus | "all";
  onFilterSeverity: (f: Severity | "all") => void;
  onFilterStatus: (f: AlertStatus | "all") => void;
};

const severityFilters: Array<Severity | "all"> = ["all", "high", "medium", "low"];
const statusFilters: Array<AlertStatus | "all"> = ["all", "open", "accepted", "rejected"];

export const AlertList = ({
  alerts,
  isLoading,
  error,
  selectedId,
  newAlertIds,
  onSelect,
  filterSeverity,
  filterStatus,
  onFilterSeverity,
  onFilterStatus,
}: Props) => {
  const filtered = alerts.filter((a) => {
    const sevMatch = filterSeverity === "all" || a.severity === filterSeverity;
    const statusMatch = filterStatus === "all" || a.status === filterStatus;
    return sevMatch && statusMatch;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      <div className="p-3 border-b border-surface-border space-y-2 shrink-0">
        <div className="flex gap-1">
          {severityFilters.map((f) => (
            <button
              key={f}
              onClick={() => onFilterSeverity(f)}
              className={`px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wide transition-all
                ${filterSeverity === f
                  ? "bg-accent-blue text-surface font-semibold"
                  : "text-gray-500 hover:text-gray-300 hover:bg-surface-tertiary"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => onFilterStatus(f)}
              className={`px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wide transition-all
                ${filterStatus === f
                  ? "bg-surface-tertiary text-white border border-surface-border"
                  : "text-gray-600 hover:text-gray-400"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alert count */}
      <div className="px-4 py-2 shrink-0">
        <span className="text-xs font-mono text-gray-600">
          {filtered.length} ALERT{filtered.length !== 1 ? "S" : ""}
        </span>
      </div>

      {/* List body */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner message="Loading alerts..." />
          </div>
        )}

        {error && (
          <div className="m-4 p-3 rounded-lg bg-accent-red/10 border border-accent-red/20">
            <p className="text-accent-red text-sm font-mono">{error}</p>
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <span className="text-2xl">🛡️</span>
            <p className="text-gray-600 font-mono text-sm">No alerts match filters</p>
          </div>
        )}

        {!isLoading &&
          filtered.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              isSelected={alert.id === selectedId}
              isNew={newAlertIds.has(alert.id)}
              onClick={() => onSelect(alert.id)}
            />
          ))}
      </div>
    </div>
  );
};