import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface OrganizeFilters {
    maturity?: Variant_idea_defining_live_building_exploring;
    tags: Array<string>;
    deploymentStatus?: Variant_notDeployed_live_failed;
    priority?: Variant_low_high_medium;
}
export type Timestamp = bigint;
export interface ProjectVersion {
    specSnapshot: string;
    version: string;
    timestamp: Timestamp;
    changeSummary: string;
}
export interface ProjectMetadata {
    maturity: Maturity;
    tags: Array<string>;
    builderMode: BuilderMode;
    priority?: Priority;
    attentionFlag: boolean;
}
export interface MetadataUpdate {
    maturity: Maturity;
    tags: Array<string>;
    builderMode: BuilderMode;
    priority?: Priority;
    attentionFlag: boolean;
}
export interface SpecSection {
    content: string;
    heading: string;
}
export type ProjectId = string;
export interface UIState {
    organizeFilters: OrganizeFilters;
    sidebarCollapsed: boolean;
    activeProjectId?: string;
    activeMode: string;
    organizeSortBy: SortBy;
}
export interface Project {
    id: ProjectId;
    metadata: ProjectMetadata;
    answers: string;
    icon: string;
    name: string;
    createdAt: Timestamp;
    deploymentStatus: DeploymentStatus;
    updatedAt: Timestamp;
    iconColor: string;
    versionHistory: Array<ProjectVersion>;
    category: AppCategory;
    specSections: Array<SpecSection>;
}
export enum AppCategory {
    dashboard = "dashboard",
    marketplace = "marketplace",
    clubManager = "clubManager",
    social = "social",
    other = "other",
    internalTool = "internalTool",
    contentCms = "contentCms",
    booking = "booking",
    tracker = "tracker"
}
export enum BuilderMode {
    feel = "feel",
    guided = "guided",
    standard = "standard"
}
export enum SortBy {
    name = "name",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    priority = "priority"
}
export enum Variant_idea_defining_live_building_exploring {
    idea = "idea",
    defining = "defining",
    live = "live",
    building = "building",
    exploring = "exploring"
}
export enum Variant_low_high_medium {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum Variant_notDeployed_live_failed {
    notDeployed = "notDeployed",
    live = "live",
    failed = "failed"
}
export interface backendInterface {
    createProject(name: string, icon: string, iconColor: string, category: AppCategory): Promise<Project>;
    deleteProject(id: ProjectId): Promise<boolean>;
    duplicateProject(id: ProjectId, newName: string): Promise<Project | null>;
    getProject(id: ProjectId): Promise<Project | null>;
    getUIState(): Promise<UIState | null>;
    isOnboardingComplete(): Promise<boolean>;
    isSampleProject(id: ProjectId): Promise<boolean>;
    listProjects(): Promise<Array<Project>>;
    markOnboardingComplete(): Promise<void>;
    saveUIState(state: UIState): Promise<void>;
    seedSampleProjects(): Promise<Array<Project>>;
    updateProjectAnswers(id: ProjectId, answers: string): Promise<Project | null>;
    updateProjectMetadata(id: ProjectId, metadata: MetadataUpdate): Promise<Project | null>;
    updateProjectSpec(id: ProjectId, sections: Array<SpecSection>): Promise<Project | null>;
}
