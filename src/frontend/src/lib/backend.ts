import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import type {
  Project,
  SpecSection,
  UIState,
  MetadataUpdate,
  ProjectId,
} from "@/types";
import { AppCategory, BuilderMode, SortBy } from "@/types";
import { SAMPLE_PROJECTS } from "./sampleProjects";

// Hook to get the actor instance
export function useBackendActor() {
  return useActor(createActor);
}

// ── BigInt serialization helpers ─────────────────────────────────────────────
// BigInt cannot be serialized by JSON.stringify out of the box.
// We encode them as tagged strings ("bigint:<value>") at the storage boundary
// and decode them back to BigInt on read.

export function bigintReplacer(_key: string, value: unknown): unknown {
  if (typeof value === "bigint") return `bigint:${value.toString()}`;
  // Recursively handle objects/arrays that JSON.stringify won't automatically recurse into
  // (JSON.stringify's replacer already recurses, but this guard ensures any manual
  // JSON.stringify calls in the codebase also get a safe serializer)
  return value;
}

/**
 * Deep-clone a value, converting all BigInt to tagged strings.
 * Use this before any JSON.stringify call that may not pass bigintReplacer.
 */
export function deepBigintToString(value: unknown): unknown {
  if (typeof value === "bigint") return `bigint:${value.toString()}`;
  if (Array.isArray(value)) return value.map(deepBigintToString);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = deepBigintToString(v);
    }
    return out;
  }
  return value;
}

export function bigintReviver(key: string, value: unknown): unknown {
  if (
    typeof value === "string" &&
    value.startsWith("bigint:") &&
    (key === "createdAt" || key === "updatedAt" || key === "timestamp")
  ) {
    return BigInt(value.slice(7));
  }
  return value;
}

// LocalStorage fallback for when canister is unavailable
const STORAGE_KEYS = {
  PROJECTS: "caffeine-projects",
  UI_STATE: "caffeine-ui-state",
  ONBOARDING: "caffeine-onboarding",
} as const;

function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw, bigintReviver) as T) : null;
  } catch {
    return null;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value, bigintReplacer));
  } catch {
    // ignore storage errors
  }
}

// Local fallback implementations
export const localFallback = {
  listProjects(): Project[] {
    const stored = loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS);
    if (!stored || stored.length === 0) {
      saveToStorage(STORAGE_KEYS.PROJECTS, SAMPLE_PROJECTS);
      return SAMPLE_PROJECTS;
    }
    return stored;
  },

  getProject(id: ProjectId): Project | null {
    const projects = this.listProjects();
    return projects.find((p) => p.id === id) ?? null;
  },

  createProject(
    name: string,
    icon: string,
    iconColor: string,
    category: AppCategory
  ): Project {
    const project: Project = {
      id: `project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      icon,
      iconColor,
      category,
      answers: "{}",
      deploymentStatus: "notDeployed",
      createdAt: BigInt(Date.now()),
      updatedAt: BigInt(Date.now()),
      metadata: {
        maturity: "idea",
        tags: [],
        builderMode: BuilderMode.guided,
        attentionFlag: false,
      },
      specSections: [],
      versionHistory: [],
    };
    const projects = this.listProjects();
    saveToStorage(STORAGE_KEYS.PROJECTS, [project, ...projects]);
    return project;
  },

  updateProjectAnswers(id: ProjectId, answers: string): Project | null {
    const projects = this.listProjects();
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated = {
      ...projects[idx],
      answers,
      updatedAt: BigInt(Date.now()),
    };
    projects[idx] = updated;
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    return updated;
  },

  updateProjectSpec(id: ProjectId, sections: SpecSection[]): Project | null {
    const projects = this.listProjects();
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const prev = projects[idx];
    const versionNum = prev.versionHistory.length + 1;
    const updated = {
      ...prev,
      specSections: sections,
      updatedAt: BigInt(Date.now()),
      versionHistory: [
        ...prev.versionHistory,
        {
          version: `${versionNum}.0`,
          timestamp: BigInt(Date.now()),
          changeSummary: "Spec updated",
          specSnapshot: JSON.stringify(prev.specSections),
        },
      ].slice(-20),
    };
    projects[idx] = updated;
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    return updated;
  },

  updateProjectMetadata(id: ProjectId, metadata: MetadataUpdate): Project | null {
    const projects = this.listProjects();
    const idx = projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const updated = {
      ...projects[idx],
      metadata: { ...metadata },
      updatedAt: BigInt(Date.now()),
    };
    projects[idx] = updated;
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    return updated;
  },

  deleteProject(id: ProjectId): boolean {
    const projects = this.listProjects();
    const filtered = projects.filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEYS.PROJECTS, filtered);
    return filtered.length < projects.length;
  },

  duplicateProject(id: ProjectId, newName: string): Project | null {
    const source = this.getProject(id);
    if (!source) return null;
    const copy: Project = {
      ...source,
      id: `project-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: newName,
      createdAt: BigInt(Date.now()),
      updatedAt: BigInt(Date.now()),
      versionHistory: [],
    };
    const projects = this.listProjects();
    saveToStorage(STORAGE_KEYS.PROJECTS, [copy, ...projects]);
    return copy;
  },

  getUIState(): UIState | null {
    return loadFromStorage<UIState>(STORAGE_KEYS.UI_STATE);
  },

  saveUIState(state: UIState): void {
    saveToStorage(STORAGE_KEYS.UI_STATE, state);
  },

  isOnboardingComplete(): boolean {
    return loadFromStorage<boolean>(STORAGE_KEYS.ONBOARDING) ?? false;
  },

  markOnboardingComplete(): void {
    saveToStorage(STORAGE_KEYS.ONBOARDING, true);
  },
};
