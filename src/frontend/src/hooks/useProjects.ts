import { localFallback } from "@/lib/backend";
import { selectHasHydrated, useAppStore } from "@/store/useAppStore";
import type { MetadataUpdate, Project, ProjectId, SpecSection } from "@/types";
import { AppCategory, BuilderMode } from "@/types";
import { useCallback, useEffect, useState } from "react";

export function useProjects() {
  const { projects, setProjects, addProject, updateProject, removeProject } =
    useAppStore();
  const hydrated = useAppStore(selectHasHydrated);
  const [loading, setLoading] = useState(false);

  const loadProjects = useCallback(() => {
    setLoading(true);
    const data = localFallback.listProjects();
    setProjects(data);
    setLoading(false);
  }, [setProjects]);

  // Only seed from localFallback if hydration is done AND the store has no projects.
  // This avoids racing with the Zustand persist rehydration which writes to the
  // same store slice from its own storage key (caffeine-app-state).
  useEffect(() => {
    if (!hydrated) return;
    if (projects.length === 0) {
      loadProjects();
    }
  }, [hydrated, loadProjects, projects.length]);

  const createProject = useCallback(
    (
      name: string,
      icon = "Box",
      iconColor = "#4DB6AC",
      category: AppCategory = AppCategory.other,
    ): Project => {
      const project = localFallback.createProject(
        name,
        icon,
        iconColor,
        category,
      );
      addProject(project);
      return project;
    },
    [addProject],
  );

  const deleteProject = useCallback(
    (id: ProjectId): boolean => {
      const ok = localFallback.deleteProject(id);
      if (ok) removeProject(id);
      return ok;
    },
    [removeProject],
  );

  const duplicateProject = useCallback(
    (id: ProjectId, newName: string): Project | null => {
      const copy = localFallback.duplicateProject(id, newName);
      if (copy) addProject(copy);
      return copy;
    },
    [addProject],
  );

  const updateMetadata = useCallback(
    (id: ProjectId, metadata: MetadataUpdate): Project | null => {
      const updated = localFallback.updateProjectMetadata(id, metadata);
      if (updated) updateProject(updated);
      return updated;
    },
    [updateProject],
  );

  const updateSpec = useCallback(
    (id: ProjectId, sections: SpecSection[]): Project | null => {
      const updated = localFallback.updateProjectSpec(id, sections);
      if (updated) updateProject(updated);
      return updated;
    },
    [updateProject],
  );

  const updateAnswers = useCallback(
    (id: ProjectId, answers: string): Project | null => {
      const updated = localFallback.updateProjectAnswers(id, answers);
      if (updated) updateProject(updated);
      return updated;
    },
    [updateProject],
  );

  return {
    projects,
    loading,
    loadProjects,
    createProject,
    deleteProject,
    duplicateProject,
    updateMetadata,
    updateSpec,
    updateAnswers,
  };
}
