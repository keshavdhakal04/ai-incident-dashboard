export type Severity = "low" | "medium" | "high";
export type AlertStatus = "open" | "accepted" | "rejected" | "overridden";

export interface AISuggestion {
  id: string;
  action: string;
  reasoning: string;
  confidence: number;
  createdAt: string;
}

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