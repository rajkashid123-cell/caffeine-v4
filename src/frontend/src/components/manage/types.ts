export type Health = "ok" | "warn" | "critical";

export interface LiveApp {
  id: string;
  name: string;
  status: "live";
  health: Health;
  healthLabel: string;
  users: number;
  burnRateDisplay: string;
  burnRateNum: number;
  burnHistory: number[];
  lastDeploy: string;
  version: string;
  description: string;
  runway: string;
  runwayDays: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  ip: string;
}

export interface UserEntry {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

export interface VersionEntry {
  id: string;
  version: string;
  deployedAt: string;
  deployedBy: string;
  notes: string;
  active: boolean;
}

export interface MetricDef {
  label: string;
  value: string;
  unit: string;
  health: Health;
}

export type TabName =
  | "Operations"
  | "Go Live"
  | "Access"
  | "Users"
  | "Settings"
  | "Credits & Cost";
