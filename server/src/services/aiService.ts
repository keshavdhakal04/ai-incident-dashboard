import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import { Alert, AISuggestion } from "../types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const isOpenAIEnabled = !!process.env.OPENAI_API_KEY;

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

const fallbackTemplates: TemplateMap = {
  high: [
    {
      action: "Immediately block source IP at firewall level",
      reasoning: "High-frequency attack pattern detected. Immediate IP block prevents ongoing damage.",
      confidence: 94,
    },
    {
      action: "Isolate affected system from network",
      reasoning: "Possible active compromise. Network isolation contains blast radius.",
      confidence: 89,
    },
    {
      action: "Trigger incident response protocol and page on-call engineer",
      reasoning: "Severity matches criteria for P1 incident. Human review required within 15 minutes.",
      confidence: 97,
    },
  ],
  medium: [
    {
      action: "Rate-limit requests from source IP for 1 hour",
      reasoning: "Suspicious but not confirmed malicious. Rate-limiting reduces risk.",
      confidence: 78,
    },
    {
      action: "Enable enhanced logging on affected system",
      reasoning: "Additional telemetry needed to confirm threat.",
      confidence: 85,
    },
    {
      action: "Notify security team and schedule review within 4 hours",
      reasoning: "Medium severity warrants timely human review.",
      confidence: 80,
    },
  ],
  low: [
    {
      action: "Log and monitor — no immediate action required",
      reasoning: "Low severity event within normal operational variance.",
      confidence: 72,
    },
    {
      action: "Add to weekly security review queue",
      reasoning: "Non-critical finding that benefits from aggregated analysis.",
      confidence: 68,
    },
    {
      action: "Auto-resolve and update runbook documentation",
      reasoning: "Known low-risk pattern. Documenting for future automated handling.",
      confidence: 75,
    },
  ],
};

const getFallbackSuggestion = (alert: Alert): AISuggestion => {
  const templates = fallbackTemplates[alert.severity];
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

const getOpenAISuggestion = async (alert: Alert): Promise<AISuggestion> => {
  const prompt = `You are a senior cybersecurity analyst in a Security Operations Center.

Analyze this security alert and provide a recommended action:

ALERT DETAILS:
- Title: ${alert.title}
- Severity: ${alert.severity.toUpperCase()}
- Description: ${alert.description}
- Source System: ${alert.source}
${alert.ipAddress ? `- Source IP: ${alert.ipAddress}` : ""}
${alert.affectedSystem ? `- Affected System: ${alert.affectedSystem}` : ""}

Respond ONLY with a JSON object, no other text:
{
  "action": "One clear sentence describing what to do immediately",
  "reasoning": "Two to three sentences explaining why this action is appropriate",
  "confidence": <number between 60 and 99>
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 300,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from OpenAI");

  const parsed = JSON.parse(content);
  return {
    id: uuidv4(),
    action: parsed.action,
    reasoning: parsed.reasoning,
    confidence: Number(parsed.confidence),
    createdAt: new Date().toISOString(),
  };
};

export const generateSuggestion = async (alert: Alert): Promise<AISuggestion> => {
  if (!isOpenAIEnabled) {
    console.log("⚡ OpenAI not configured — using fallback");
    return getFallbackSuggestion(alert);
  }
  try {
    console.log(`🤖 Generating AI suggestion for: ${alert.title}`);
    const suggestion = await getOpenAISuggestion(alert);
    console.log(`✅ Done (confidence: ${suggestion.confidence}%)`);
    return suggestion;
  } catch (err) {
    console.error("❌ OpenAI failed, using fallback:", err);
    return getFallbackSuggestion(alert);
  }
};

type NewAlert = {
  title: string;
  description: string;
  severity: Alert["severity"];
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