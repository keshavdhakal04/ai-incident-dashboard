import { v4 as uuidv4 } from "uuid";
import { Alert, AISuggestion, Severity } from "../types";

type SuggestionTemplate = {
  action: string;
  reasoning: string;
  confidence: number;
};

type TemplateMap = {
  high: SuggestionTemplate[];
  medium: SuggestionTemplate[];
  low: SuggestionTemplate[];
};

const suggestionTemplates: TemplateMap = {
  high: [
    {
      action: "Immediately block source IP at firewall level",
      reasoning: "High-frequency attack pattern detected. Immediate IP block prevents ongoing damage.",
      confidence: 94,
    },
    {
      action: "Isolate affected system from network",
      reasoning: "Possible active compromise. Network isolation contains blast radius and prevents lateral movement.",
      confidence: 89,
    },
    {
      action: "Trigger incident response protocol and page on-call engineer",
      reasoning: "Severity and attack pattern match criteria for P1 incident. Human review required within 15 minutes.",
      confidence: 97,
    },
  ],
  medium: [
    {
      action: "Rate-limit requests from source IP for 1 hour",
      reasoning: "Suspicious but not confirmed malicious. Temporary rate-limiting reduces risk.",
      confidence: 78,
    },
    {
      action: "Enable enhanced logging on affected system",
      reasoning: "Additional telemetry needed to confirm threat. Logging increase aids forensic analysis.",
      confidence: 85,
    },
    {
      action: "Notify security team and schedule review within 4 hours",
      reasoning: "Medium severity warrants timely human review. Not urgent enough for immediate page.",
      confidence: 80,
    },
  ],
  low: [
    {
      action: "Log and monitor — no immediate action required",
      reasoning: "Low severity event within normal operational variance. Continue monitoring for escalation.",
      confidence: 72,
    },
    {
      action: "Add to weekly security review queue",
      reasoning: "Non-critical finding that benefits from aggregated pattern analysis in weekly review.",
      confidence: 68,
    },
    {
      action: "Auto-resolve and update runbook documentation",
      reasoning: "Known low-risk pattern. Documenting for future automated handling.",
      confidence: 75,
    },
  ],
};

export const generateSuggestion = (alert: Alert): AISuggestion => {
  const templates = suggestionTemplates[alert.severity];
  const index = alert.id.charCodeAt(0) % templates.length;
  const template = templates[index];
  return {
    id: uuidv4(),
    action: template.action,
    reasoning: template.reasoning,
    confidence: template.confidence,
    createdAt: new Date().toISOString(),
  };
};

type NewAlert = {
  title: string;
  description: string;
  severity: Severity;
  source: string;
  ipAddress?: string;
  affectedSystem?: string;
  status: "open";
};

export const generateRandomAlert = (): NewAlert => {
  const r = Math.floor(Math.random() * 255);
  const scenarios: NewAlert[] = [
    {
      title: "New Malware Signature Detected",
      description: "Endpoint protection flagged suspicious executable matching known ransomware pattern.",
      severity: "high",
      source: "Endpoint Protection",
      affectedSystem: "workstation-" + (Math.floor(Math.random() * 50) + 1),
      status: "open",
    },
    {
      title: "Privilege Escalation Attempt",
      description: "User account attempted to access admin resources without authorization.",
      severity: "high",
      source: "IAM Service",
      ipAddress: "192.168." + r + "." + Math.floor(Math.random() * 255),
      affectedSystem: "identity-service",
      status: "open",
    },
    {
      title: "Repeated Login Failures",
      description: (Math.floor(Math.random() * 20) + 5) + " failed login attempts detected in last 5 minutes.",
      severity: "medium",
      source: "Auth Service",
      ipAddress: "10." + r + "." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
      affectedSystem: "auth-server",
      status: "open",
    },
    {
      title: "Outdated TLS Version in Use",
      description: "Service accepting TLS 1.0 connections. Vulnerable to POODLE attack.",
      severity: "low",
      source: "Security Scanner",
      affectedSystem: "legacy-api",
      status: "open",
    },
  ];

  return scenarios[Math.floor(Math.random() * scenarios.length)];
};