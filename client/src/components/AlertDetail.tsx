import { useState } from "react";
import type { Alert } from "../types";
import { alertsApi } from "../services/api";
import { LoadingSpinner } from "./LoadingSpinner";

type Props = {
  alert: Alert | null;
  onAlertUpdated: (alert: Alert) => void;
};

const confidenceColor = (score: number) => {
  if (score >= 85) return "text-accent-green";
  if (score >= 70) return "text-accent-yellow";
  return "text-accent-red";
};

export const AlertDetail = ({ alert, onAlertUpdated }: Props) => {
  const [isActing, setIsActing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!alert) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="w-12 h-12 rounded-full bg-surface-tertiary flex items-center justify-center">
          <span className="text-2xl">🔍</span>
        </div>
        <p className="text-gray-500 font-mono text-sm">Select an alert to investigate</p>
      </div>
    );
  }

  const handleStatusUpdate = async (status: Alert["status"]) => {
    try {
      setIsActing(true);
      setActionError(null);
      const updated = await alertsApi.updateStatus(alert.id, status);
      onAlertUpdated(updated);
    } catch {
      setActionError("Failed to update status. Please try again.");
    } finally {
      setIsActing(false);
    }
  };

  const isResolved = alert.status !== "open";

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Alert header */}
      <div className="p-6 border-b border-surface-border shrink-0">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-lg font-semibold text-white leading-tight">
            {alert.title}
          </h2>
          <span className={`severity-${alert.severity} shrink-0`}>
            {alert.severity}
          </span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          {alert.description}
        </p>
      </div>

      {/* Metadata grid */}
      <div className="p-6 border-b border-surface-border shrink-0">
        <h3 className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-3">
          Incident Details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Source", value: alert.source },
            { label: "Status", value: alert.status.toUpperCase() },
            { label: "IP Address", value: alert.ipAddress || "N/A" },
            { label: "Affected System", value: alert.affectedSystem || "N/A" },
            {
              label: "Detected",
              value: new Date(alert.createdAt).toLocaleString(),
            },
            {
              label: "Last Updated",
              value: new Date(alert.updatedAt).toLocaleString(),
            },
          ].map(({ label, value }) => (
            <div key={label} className="glass-panel p-3">
              <p className="text-xs font-mono text-gray-600 mb-1">{label}</p>
              <p className="text-sm text-gray-200 font-medium truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggestion */}
      {alert.suggestion && (
        <div className="p-6 border-b border-surface-border shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono text-gray-600 uppercase tracking-widest">
              AI Recommendation
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-gray-600">Confidence</span>
              <span className={`text-sm font-mono font-bold ${confidenceColor(alert.suggestion.confidence)}`}>
                {alert.suggestion.confidence}%
              </span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-lg">
            {/* Confidence bar */}
            <div className="w-full bg-surface h-1 rounded-full mb-4">
              <div
                className="h-1 rounded-full bg-accent-blue transition-all duration-500"
                style={{ width: `${alert.suggestion.confidence}%` }}
              />
            </div>

            <p className="text-white font-medium mb-2">
              {alert.suggestion.action}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              {alert.suggestion.reasoning}
            </p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="p-6 shrink-0">
        <h3 className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-3">
          Actions
        </h3>

        {actionError && (
          <div className="mb-3 p-3 rounded-lg bg-accent-red/10 border border-accent-red/20">
            <p className="text-accent-red text-sm font-mono">{actionError}</p>
          </div>
        )}

        {isResolved ? (
          <div className="glass-panel p-4 text-center">
            <p className="text-gray-500 font-mono text-sm uppercase tracking-wide">
              Alert {alert.status}
            </p>
            <button
              onClick={() => handleStatusUpdate("open")}
              disabled={isActing}
              className="btn-ghost mt-3 w-full"
            >
              Reopen Alert
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {isActing ? (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" message="Updating..." />
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleStatusUpdate("accepted")}
                  className="btn-primary w-full"
                >
                  ✓ Accept Recommendation
                </button>
                <button
                  onClick={() => handleStatusUpdate("rejected")}
                  className="btn-danger w-full"
                >
                  ✗ Reject Recommendation
                </button>
                <button
                  onClick={() => handleStatusUpdate("overridden")}
                  className="btn-ghost w-full"
                >
                  ↺ Override with Custom Action
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};