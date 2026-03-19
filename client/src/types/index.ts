// ─── Severity Levels ────────────────────────────────────────────────────────
export type Severity = "low" | "medium" | "high";

// ─── Alert Status ───────────────────────────────────────────────────────────
export type AlertStatus = "open" | "accepted" | "rejected" | "overridden";

// ─── AI Suggestion ──────────────────────────────────────────────────────────
export interface AISuggestion {
  id: string;
  action: string;
  reasoning: string;
  confidence: number;
  createdAt: string;
}

// ─── Security Alert ─────────────────────────────────────────────────────────
export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: AlertStatus;
  source: string;
  ipAddress?: string;
  affectedSystem?: string;
  suggestion?: AISuggestion;
  createdAt: string;
  updatedAt: string;
}

// ─── WebSocket Event Types ───────────────────────────────────────────────────
export type SocketEvent =
  | { type: "alert:new"; payload: Alert }
  | { type: "alert:updated"; payload: Alert }
  | { type: "alert:deleted"; payload: { id: string } };

// ─── API Response Wrappers ──────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

// ─── UI State ───────────────────────────────────────────────────────────────
export interface DashboardState {
  selectedAlertId: string | null;
  filterSeverity: Severity | "all";
  filterStatus: AlertStatus | "all";
  isConnected: boolean;
}
