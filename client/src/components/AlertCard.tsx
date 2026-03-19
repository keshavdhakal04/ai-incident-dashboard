import type { Alert } from "../types";

type Props = {
  alert: Alert;
  isSelected: boolean;
  onClick: () => void;
};

const severityDot: Record<Alert["severity"], string> = {
  high: "bg-accent-red",
  medium: "bg-accent-yellow",
  low: "bg-accent-green",
};

const statusStyles: Record<Alert["status"], string> = {
  open: "text-gray-400",
  accepted: "text-accent-green",
  rejected: "text-accent-red",
  overridden: "text-accent-purple",
};

const formatTime = (iso: string) => {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const AlertCard = ({ alert, isSelected, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-b border-surface-border transition-all duration-150
        hover:bg-surface-tertiary focus:outline-none
        ${isSelected ? "bg-surface-tertiary border-l-2 border-l-accent-blue" : "border-l-2 border-l-transparent"}
      `}
    >
      {/* Top row: severity dot + title + time */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${severityDot[alert.severity]}`} />
          <span className="text-sm font-medium text-white truncate">
            {alert.title}
          </span>
        </div>
        <span className="text-xs text-gray-600 font-mono shrink-0">
          {formatTime(alert.createdAt)}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 line-clamp-2 mb-3 pl-4">
        {alert.description}
      </p>

      {/* Bottom row: severity badge + source + status */}
      <div className="flex items-center justify-between pl-4">
        <div className="flex items-center gap-2">
          <span className={`severity-${alert.severity}`}>
            {alert.severity}
          </span>
          <span className="text-xs text-gray-600 font-mono">
            {alert.source}
          </span>
        </div>
        <span className={`text-xs font-mono uppercase ${statusStyles[alert.status]}`}>
          {alert.status}
        </span>
      </div>
    </button>
  );
};