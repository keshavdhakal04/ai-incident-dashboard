import type { Alert } from "../types";

type Props = {
  alerts: Alert[];
};

export const StatsBar = ({ alerts }: Props) => {
  const total = alerts.length;
  const high = alerts.filter((a) => a.severity === "high" && a.status === "open").length;
  const medium = alerts.filter((a) => a.severity === "medium" && a.status === "open").length;
  const low = alerts.filter((a) => a.severity === "low" && a.status === "open").length;
  const resolved = alerts.filter((a) => a.status !== "open").length;

  const stats = [
    { label: "CRITICAL", value: high, color: "text-accent-red", bg: "bg-accent-red" },
    { label: "MEDIUM", value: medium, color: "text-accent-yellow", bg: "bg-accent-yellow" },
    { label: "LOW", value: low, color: "text-accent-green", bg: "bg-accent-green" },
    { label: "RESOLVED", value: resolved, color: "text-gray-400", bg: "bg-gray-400" },
  ];

  return (
    <div className="h-10 bg-surface-tertiary border-b border-surface-border flex items-center px-6 gap-6 shrink-0">
      {/* Total */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-gray-600 uppercase">Total</span>
        <span className="text-xs font-mono font-bold text-white">{total}</span>
      </div>

      <div className="w-px h-4 bg-surface-border" />

      {/* Per-severity stats */}
      {stats.map(({ label, value, color, bg }) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${bg}`} />
          <span className="text-xs font-mono text-gray-600">{label}</span>
          <span className={`text-xs font-mono font-bold ${color}`}>{value}</span>
        </div>
      ))}

      {/* Right side: last updated */}
      <div className="ml-auto">
        <span className="text-xs font-mono text-gray-700">
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
};