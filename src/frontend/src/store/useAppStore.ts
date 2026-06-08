import { bigintReplacer, bigintReviver } from "@/lib/backend";
import { SAMPLE_PROJECTS } from "@/lib/sampleProjects";
import {
  type CustomizationConfig,
  HubNode,
  type PendingUpdate,
  ProjectUpdateTracking,
  SortBy,
} from "@/types";
import type {
  ChatMessage,
  DevModeState,
  Hub,
  MarketApp,
  OrganizeFilters,
  Project,
  SpecializationState,
} from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StorageValue } from "zustand/middleware";

export type AppMode = "design" | "develop" | "organize" | "live" | "market";
export type AppTheme = "classic" | "soils";

interface AppState {
  // Navigation
  activeMode: AppMode;
  sidebarCollapsed: boolean;
  // Project selection
  activeProjectId: string | null;
  // Data
  projects: Project[];
  // Organize
  organizeFilters: OrganizeFilters;
  organizeSortBy: SortBy | "burn-rate";
  organizeView: "grid" | "hubs";
  // Hubs
  hubNodePositions: Record<string, Record<string, { x: number; y: number }>>;
  hubs: Hub[];
  activeHubId: string | null;
  // Onboarding
  onboardingComplete: boolean;
  hasCompletedOnboarding: boolean;
  // Design flow — current draft answers for in-progress design session
  designFlowActive: boolean;
  designFlowProjectId: string | null;
  // Dev mode — role-switching preview
  devMode: DevModeState;
  // Specialization flow state (clone-from-market)
  specializationState: SpecializationState | null;
  // Chat messages per project
  chatMessages: Record<string, ChatMessage[]>;
  // Launcher mode — true when user entered via "Start from a template" CTA
  isLauncherMode: boolean;
  // Hydration sentinel — true once persist middleware has rehydrated from localStorage
  _hasHydrated: boolean;
  // Visual theme — 'classic' (hacker terminal) or 'soils' (clean modern)
  theme: AppTheme;
  // Dark mode toggle — independent of theme choice
  isDarkMode: boolean;
  // Safe customization for cloned apps
  customizationConfig: CustomizationConfig | null;
  // Creator update tracking for cloned apps
  creatorUpdateAvailable: boolean;
  lastCreatorUpdate: number | null;
  updateConflict: boolean;
  pendingUpdate: PendingUpdate | null;
}

interface AppActions {
  setMode: (mode: AppMode) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (val: boolean) => void;
  setActiveProject: (id: string | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  removeProject: (id: string) => void;
  setOrganizeFilters: (filters: Partial<OrganizeFilters>) => void;
  setOrganizeSortBy: (sort: SortBy | "burn-rate") => void;
  setOrganizeView: (view: "grid" | "hubs") => void;
  setHubs: (hubs: Hub[]) => void;
  addHub: (hub: Hub) => void;
  updateHub: (hub: Hub) => void;
  removeHub: (id: string) => void;
  setActiveHub: (id: string | null) => void;
  setHubNodePosition: (
    hubId: string,
    projectId: string,
    pos: { x: number; y: number },
  ) => void;
  setOnboardingComplete: (val: boolean) => void;
  setHasCompletedOnboarding: (val: boolean) => void;
  startDesignFlow: (projectId: string) => void;
  endDesignFlow: () => void;
  setDevMode: (state: Partial<DevModeState>) => void;
  setSpecializationState: (state: SpecializationState | null) => void;
  startSpecialization: (sourceApp: MarketApp) => void;
  addChatMessage: (projectId: string, message: ChatMessage) => void;
  setChatMessages: (projectId: string, messages: ChatMessage[]) => void;
  setIsLauncherMode: (val: boolean) => void;
  setHasHydrated: (val: boolean) => void;
  setCustomizationConfig: (config: CustomizationConfig | null) => void;
  setTheme: (theme: AppTheme) => void;
  toggleDarkMode: () => void;
  setCreatorUpdateAvailable: (val: boolean) => void;
  setLastCreatorUpdate: (val: number | null) => void;
  setUpdateConflict: (val: boolean) => void;
  setPendingUpdate: (update: PendingUpdate | null) => void;
}

const defaultFilters: OrganizeFilters = {
  tags: [],
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      // State
      activeMode: "design", // will be set to 'design' in store but router redirects to /dashboard after onboarding
      // Note: mode names are 'design' | 'develop' | 'organize' | 'live' | 'market'
      sidebarCollapsed: true,
      activeProjectId: null,
      projects: [],
      organizeFilters: defaultFilters,
      organizeSortBy: SortBy.updatedAt,
      organizeView: "grid",
      hubs: [
        {
          id: "hub-sample-1",
          name: "Healthcare Suite",
          color: "#4DB6AC",
          projectIds: ["sample-1", "sample-3"],
          nodes: [
            { projectId: "sample-1", x: 120, y: 100 },
            { projectId: "sample-3", x: 280, y: 180 },
          ],
          connections: [{ from: "sample-1", to: "sample-3" }],
        },
        {
          id: "hub-sample-2",
          name: "Community & Content",
          color: "#9575CD",
          projectIds: ["sample-2", "sample-5", "sample-6"],
          nodes: [
            { projectId: "sample-2", x: 100, y: 120 },
            { projectId: "sample-5", x: 250, y: 80 },
            { projectId: "sample-6", x: 200, y: 220 },
          ],
          connections: [
            { from: "sample-2", to: "sample-5" },
            { from: "sample-5", to: "sample-6" },
          ],
        },
      ],
      activeHubId: null,
      hubNodePositions: {},
      onboardingComplete: false,
      hasCompletedOnboarding: false,
      designFlowActive: false,
      designFlowProjectId: null,
      devMode: { enabled: false, selectedRole: "" },
      specializationState: null,
      chatMessages: {},
      isLauncherMode: false,
      _hasHydrated: false,
      theme: "soils",
      isDarkMode: false,
      customizationConfig: null,
      creatorUpdateAvailable: false,
      lastCreatorUpdate: null,
      updateConflict: false,
      pendingUpdate: null,

      // Actions
      setMode: (mode) => set({ activeMode: mode }),
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
      setActiveProject: (id) => set({ activeProjectId: id }),
      setProjects: (projects) => set({ projects }),
      addProject: (project) =>
        set((s) => ({ projects: [project, ...s.projects] })),
      updateProject: (project) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === project.id ? project : p)),
        })),
      removeProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
        })),
      setOrganizeFilters: (filters) =>
        set((s) => ({
          organizeFilters: { ...s.organizeFilters, ...filters },
        })),
      setOrganizeSortBy: (sort) => set({ organizeSortBy: sort }),
      setOrganizeView: (view) => set({ organizeView: view }),
      setHubs: (hubs) => set({ hubs }),
      addHub: (hub) => set((s) => ({ hubs: [...s.hubs, hub] })),
      updateHub: (hub) =>
        set((s) => ({
          hubs: s.hubs.map((h) => (h.id === hub.id ? hub : h)),
        })),
      removeHub: (id) =>
        set((s) => ({
          hubs: s.hubs.filter((h) => h.id !== id),
          activeHubId: s.activeHubId === id ? null : s.activeHubId,
        })),
      setActiveHub: (id) => set({ activeHubId: id }),
      setHubNodePosition: (hubId, projectId, pos) =>
        set((s) => ({
          hubNodePositions: {
            ...s.hubNodePositions,
            [hubId]: {
              ...s.hubNodePositions[hubId],
              [projectId]: pos,
            },
          },
        })),
      setOnboardingComplete: (val) => set({ onboardingComplete: val }),
      setHasCompletedOnboarding: (val) =>
        set({ hasCompletedOnboarding: val, onboardingComplete: val }),
      startDesignFlow: (projectId) =>
        set({ designFlowActive: true, designFlowProjectId: projectId }),
      endDesignFlow: () =>
        set({ designFlowActive: false, designFlowProjectId: null }),
      setDevMode: (partial) =>
        set((s) => ({ devMode: { ...s.devMode, ...partial } })),
      setSpecializationState: (state) => set({ specializationState: state }),
      startSpecialization: (sourceApp) =>
        set({
          specializationState: {
            sourceApp,
            currentStep: "rename",
            name: `My ${sourceApp.name}`,
            audience: sourceApp.audience,
            selectedFeatures: [...sourceApp.features],
            colorDirection: sourceApp.colorDirection,
            vibe: sourceApp.vibe,
          },
        }),
      addChatMessage: (projectId, message) =>
        set((s) => ({
          chatMessages: {
            ...s.chatMessages,
            [projectId]: [...(s.chatMessages[projectId] ?? []), message],
          },
        })),
      setChatMessages: (projectId, messages) =>
        set((s) => ({
          chatMessages: { ...s.chatMessages, [projectId]: messages },
        })),
      setIsLauncherMode: (val) => set({ isLauncherMode: val }),
      setHasHydrated: (val) => set({ _hasHydrated: val }),
      setTheme: (theme) => {
        localStorage.setItem("caffeine-theme", theme);
        set({ theme });
      },
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.isDarkMode;
          localStorage.setItem("caffeine-dark", String(next));
          return { isDarkMode: next };
        }),
      setCustomizationConfig: (config) => set({ customizationConfig: config }),
      setCreatorUpdateAvailable: (val) => set({ creatorUpdateAvailable: val }),
      setLastCreatorUpdate: (val) => set({ lastCreatorUpdate: val }),
      setUpdateConflict: (val) => set({ updateConflict: val }),
      setPendingUpdate: (update) => set({ pendingUpdate: update }),
    }),
    {
      name: "caffeine-app-state",
      storage: {
        getItem(
          name: string,
        ): StorageValue<Partial<AppState & AppActions>> | null {
          const raw = localStorage.getItem(name);
          if (!raw) return null;
          try {
            return JSON.parse(raw, bigintReviver) as StorageValue<
              Partial<AppState & AppActions>
            >;
          } catch {
            return null;
          }
        },
        setItem(
          name: string,
          value: StorageValue<Partial<AppState & AppActions>>,
        ) {
          try {
            localStorage.setItem(name, JSON.stringify(value, bigintReplacer));
          } catch {
            // ignore storage errors
          }
        },
        removeItem(name: string) {
          localStorage.removeItem(name);
        },
      },
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
      partialize: (state) => ({
        activeMode: state.activeMode,
        sidebarCollapsed: state.sidebarCollapsed,
        activeProjectId: state.activeProjectId,
        organizeFilters: state.organizeFilters,
        organizeSortBy: state.organizeSortBy,
        organizeView: state.organizeView,
        hubs: state.hubs,
        activeHubId: state.activeHubId,
        hubNodePositions: state.hubNodePositions,
        onboardingComplete: state.onboardingComplete,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        chatMessages: state.chatMessages,
        projects: state.projects,
        devMode: state.devMode,
        specializationState: state.specializationState,
        designFlowActive: state.designFlowActive,
        designFlowProjectId: state.designFlowProjectId,
        isLauncherMode: state.isLauncherMode,
        theme: state.theme,
        isDarkMode: state.isDarkMode,
        customizationConfig: state.customizationConfig,
        creatorUpdateAvailable: state.creatorUpdateAvailable,
        lastCreatorUpdate: state.lastCreatorUpdate,
        updateConflict: state.updateConflict,
        pendingUpdate: state.pendingUpdate,
      }),
    },
  ),
);

/** Selector — true once the persist layer has finished reading from localStorage */
export const selectHasHydrated = (s: AppState & AppActions) => s._hasHydrated;
export const selectIsLauncherContext = (s: AppState & AppActions) => {
  if (s.isLauncherMode) return true;
  if (!s.activeProjectId) return false;
  const activeProject = s.projects.find((p) => p.id === s.activeProjectId);
  return activeProject?.metadata.tags?.includes("cloned") ?? false;
};
