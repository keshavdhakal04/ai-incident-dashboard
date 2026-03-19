import { v4 as uuidv4 } from "uuid";
import { Alert, Severity, AlertStatus } from "../types";

const now = new Date().toISOString();

const makeAlert = (
  overrides: Partial<Alert> & {
    title: string;
    description: string;
    severity: Severity;
    source: string;
  }
): Alert => ({
  id: uuidv4(),
  status: "open" as AlertStatus,
  createdAt: now,
  updatedAt: now,
  ...overrides,
});

export const seedAlerts: Alert[] = [
  makeAlert({
    title: "Brute Force Attack Detected",
    description:
      "Multiple failed SSH login attempts from IP 203.0.113.42. 47 attempts in 2 minutes.",
    severity: "high",
    source: "Auth Service",
    ipAddress: "203.0.113.42",
    affectedSystem: "prod-server-01",
  }),
  makeAlert({
    title: "Unusual Data Exfiltration",
    description:
      "Outbound traffic spike detected. 2.3GB transferred to unknown external endpoint.",
    severity: "high",
    source: "Network Monitor",
    ipAddress: "198.51.100.77",
    affectedSystem: "db-server-02",
  }),
  makeAlert({
    title: "Suspicious Port Scan",
    description:
      "Sequential port scanning detected from internal IP. Possible lateral movement.",
    severity: "medium",
    source: "IDS",
    ipAddress: "10.0.0.45",
    affectedSystem: "internal-network",
  }),
  makeAlert({
    title: "SSL Certificate Expiring",
    description:
      "Production SSL certificate expires in 7 days. Renewal required to avoid downtime.",
    severity: "medium",
    source: "Certificate Monitor",
    affectedSystem: "api.company.com",
  }),
  makeAlert({
    title: "Failed API Authentication",
    description:
      "API key used from unrecognized geographic location (Nigeria). Normal location: Canada.",
    severity: "medium",
    source: "API Gateway",
    ipAddress: "41.203.64.1",
    affectedSystem: "api-gateway",
  }),
  makeAlert({
    title: "Disk Usage Warning",
    description:
      "Server disk usage at 87%. If it reaches 95%, services may begin failing.",
    severity: "low",
    source: "System Monitor",
    affectedSystem: "prod-server-03",
  }),
  makeAlert({
    title: "Dependency Vulnerability Found",
    description:
      "CVE-2024-1234 found in lodash@4.17.20. CVSS score: 6.5. Patch available.",
    severity: "low",
    source: "Dependency Scanner",
    affectedSystem: "frontend-app",
  }),
];

export let alertStore: Alert[] = [...seedAlerts];

export const resetStore = () => {
  alertStore = [...seedAlerts];
};