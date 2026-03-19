type Props = {
  alertCount: number;
  isConnected: boolean;
};

export const Header = ({ alertCount, isConnected }: Props) => {
  return (
    <header className="h-14 bg-surface-secondary border-b border-surface-border flex items-center justify-between px-6 shrink-0">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded bg-accent-red/20 border border-accent-red/40 flex items-center justify-center">
          <span className="text-accent-red text-xs font-bold font-mono">AI</span>
        </div>
        <span className="font-mono font-semibold text-white tracking-tight">
          Incident Dashboard
        </span>
        <span className="hidden sm:block text-gray-600 font-mono text-xs">
          / SOC v1.0
        </span>
      </div>

      {/* Right: Status indicators */}
      <div className="flex items-center gap-4">
        {/* Alert count */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500 font-mono text-xs">ALERTS</span>
          <span className="font-mono font-bold text-white">{alertCount}</span>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-surface-border" />

        {/* WebSocket connection status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected
                ? "bg-accent-green animate-pulse-slow"
                : "bg-accent-red"
            }`}
          />
          <span className="font-mono text-xs text-gray-500">
            {isConnected ? "LIVE" : "OFFLINE"}
          </span>
        </div>
      </div>
    </header>
  );
};