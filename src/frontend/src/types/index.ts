// Backend types re-exported with local aliases
export type {
  Project as _Project,
  ProjectMetadata,
  ProjectVersion,
  SpecSection,
  UIState,
  OrganizeFilters,
  MetadataUpdate,
  ProjectId,
  Timestamp,
} from "@/backend";

import type { Project as BackendProject, SpecSection } from "@/backend";

// Extend Project with burn-rate fields (not in backend.d.ts)
export interface ProjectBurnRate {
  burnRate?: number;
  burnRateBaseline?: number;
  burnRateStatus?: BurnRateStatus;
}

// ─── Localization ──────────────────────────────────────────────────────────
export type SupportedLocale = "en" | "pt" | "es" | "fr" | "de" | "ja" | "zh";

export const SUPPORTED_LOCALES: { id: SupportedLocale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "pt", label: "Português" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
  { id: "de", label: "Deutsch" },
  { id: "ja", label: "日本語" },
  { id: "zh", label: "简体中文" },
];

// ─── Safe customization layer (cloned apps) ─────────────────────────────────
export interface CustomizationConfig {
  appName: string;
  brandColor: string;
  theme: "light" | "dark" | "system";
  locale: SupportedLocale;
}

// ─── Creator update tracking (cloned apps) ─────────────────────────────────
export interface PendingUpdate {
  version: string;
  timestamp: number;
  changeSummary: string;
  newFeatures: string[];
  changedSections: string[];
  fixes: string[];
}

export interface ProjectUpdateTracking {
  creatorUpdateAvailable: boolean;
  lastCreatorUpdate: number | null;
  updateConflict: boolean;
  pendingUpdate: PendingUpdate | null;
}

export type Project = BackendProject &
  ProjectBurnRate &
  Partial<ProjectUpdateTracking> & {
    customizationConfig?: CustomizationConfig;
    isSample?: boolean;
  };

export {
  AppCategory,
  BuilderMode,
  SortBy,
} from "@/backend";

// Enums not directly exposed as named exports in backend.d.ts
export type Priority = "low" | "medium" | "high";
export type Maturity = "idea" | "exploring" | "defining" | "building" | "live";
export type DeploymentStatus = "notDeployed" | "deploying" | "live" | "failed";
export type BurnRateStatus = "normal" | "elevated" | "critical";

// Market
export type MarketAppTag = "original" | "template" | "white-label" | "cloned";

export interface MarketApp {
  id: string;
  name: string;
  author: string;
  description: string;
  tags: MarketAppTag[];
  category: string;
  features: string[];
  colorDirection: string;
  vibe: string;
  audience: string;
  icon: string;
  iconColor: string;
  cloneCount: number;
  publishedAt: string;
  rating: number;
  usedByCount: number;
  specSections?: SpecSection[];
  lastUpdated: number; // epoch ms
  updateFrequency: "Weekly" | "Monthly" | "Quarterly";
}

// Specialization flow (clone → make it yours)
export type SpecializationStep =
  | "rename"
  | "audience"
  | "features"
  | "branding"
  | "complete";

export interface SpecializationState {
  sourceApp: MarketApp;
  currentStep: SpecializationStep;
  name: string;
  audience: string;
  selectedFeatures: string[];
  colorDirection: string;
  vibe: string;
}

// Dev mode — role-switching preview within a draft
export interface DevModeState {
  enabled: boolean;
  selectedRole: string;
}

// Design flow answers for the 18-step visual spec flow
export interface DesignFlowAnswers {
  // Phase 1 — What are you making?
  appType?: string;
  audience?: string[];
  closestExample?: string;
  // Phase 2 — The feel
  vibe?: string;
  colorDirection?: string;
  typographyFeel?: string;
  cornerDensity?: string;
  // Phase 3 — The shape
  shellLayout?: string;
  headerFooterPlacement?: string;
  lightDarkDefault?: string;
  // Phase 4 — What it does
  appScope?: string; // 'mvp' | 'full' — controls feature depth and data model step
  coreFeatures?: string[];
  rolesAccess?: string[];
  keyScreens?: string[];
  // Phase 5 — Specifics
  dataContent?: string[];
  motionRegister?: string;
  platformScope?: string;
  // Phase 6 — Review (no answer needed, just display)
  projectName?: string;
  // Landing screen design (inserted between shape and features phases)
  landingLayoutPattern?: string;
  landingHeroContentType?: string;
  landingHeadlineTone?: string;
  landingCTAStyle?: string;
}

// Icon color palette for project icons
export const ICON_COLORS = [
  { id: "teal", label: "Teal", value: "#4DB6AC" },
  { id: "violet", label: "Violet", value: "#9575CD" },
  { id: "amber", label: "Amber", value: "#FFB300" },
  { id: "rose", label: "Rose", value: "#E57373" },
  { id: "sky", label: "Sky", value: "#4FC3F7" },
  { id: "emerald", label: "Emerald", value: "#66BB6A" },
  { id: "orange", label: "Orange", value: "#FF7043" },
] as const;

export type IconColorId = (typeof ICON_COLORS)[number]["id"];

// Hub types
export interface HubNode {
  projectId: string;
  x: number;
  y: number;
}

export interface HubConnection {
  from: string;
  to: string;
}

export interface Hub {
  id: string;
  name: string;
  color: string;
  projectIds: string[];
  nodes: HubNode[];
  connections: HubConnection[];
}

// Chat message
export interface ChatMessage {
  role: "user" | "ai";
  text: string;
  timestamp: number;
  actionChip?: { actionId: string; label: string };
}
