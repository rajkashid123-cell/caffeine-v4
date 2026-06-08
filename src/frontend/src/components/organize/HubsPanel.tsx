import { HubNodeDiagram } from "@/components/organize/HubNodeDiagram";
import { useAppStore } from "@/store/useAppStore";
import type { Hub } from "@/types";
import { FolderOpen, Plus } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

const HUB_COLORS = [
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
];

export function HubsPanel() {
  const hubs = useAppStore((s) => s.hubs);
  const activeHubId = useAppStore((s) => s.activeHubId);
  const setActiveHub = useAppStore((s) => s.setActiveHub);
  const addHub = useAppStore((s) => s.addHub);

  const [showDiagram, setShowDiagram] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newHubName, setNewHubName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const activeHub = useMemo(
    () => hubs.find((h) => h.id === activeHubId) ?? hubs[0] ?? null,
    [hubs, activeHubId],
  );

  const handleCreateHub = useCallback(() => {
    const name = newHubName.trim();
    if (!name) return;
    const id = `hub-${Date.now()}`;
    const newHub: Hub = {
      id,
      name,
      color: HUB_COLORS[hubs.length % HUB_COLORS.length],
      projectIds: [],
      nodes: [],
      connections: [],
    };
    addHub(newHub);
    setActiveHub(id);
    setNewHubName("");
    setCreating(false);
    setShowDiagram(true);
  }, [newHubName, hubs.length, addHub, setActiveHub]);

  function handleSelectHub(hubId: string) {
    setActiveHub(hubId);
    setShowDiagram(true);
  }

  // When viewing the diagram, delegate fully to HubNodeDiagram
  if (showDiagram && activeHub) {
    return (
      <div className="flex h-full min-h-0" data-ocid="organize.hubs.panel">
        <HubNodeDiagram hub={activeHub} onBack={() => setShowDiagram(false)} />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0" data-ocid="organize.hubs.panel">
      {/* Left column — Hub list */}
      <div className="w-64 flex flex-col border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          {creating ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newHubName}
                onChange={(e) => setNewHubName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateHub();
                  if (e.key === "Escape") {
                    setCreating(false);
                    setNewHubName("");
                  }
                }}
                placeholder="Hub name…"
                className="flex-1 text-xs px-2 py-1.5 rounded-md bg-muted/60 border border-border focus:outline-none focus:ring-1 text-foreground placeholder:text-muted-foreground"
                data-ocid="organize.hubs.name_input"
              />
              <button
                type="button"
                onClick={handleCreateHub}
                className="flex-shrink-0 px-2.5 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                data-ocid="organize.hubs.create_button"
              >
                Create
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCreating(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border border-dashed border-border hover:border-foreground/30 hover:bg-muted/50 text-muted-foreground transition-colors"
              data-ocid="organize.hubs.new_hub_button"
            >
              <Plus size={12} />
              New Hub
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {hubs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <FolderOpen size={24} className="text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                No hubs yet. Create one to group related projects.
              </p>
            </div>
          ) : (
            hubs.map((hub) => {
              const isActive = hub.id === activeHub?.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => handleSelectHub(hub.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-left transition-colors ${
                    isActive
                      ? "bg-accent/10 ring-1 ring-accent"
                      : "hover:bg-muted"
                  }`}
                  data-ocid={`organize.hubs.item.${hub.id}`}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: hub.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-medium truncate ${
                        isActive ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {hub.name}
                    </p>
                  </div>
                  <span
                    className={`text-2xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                      isActive
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {hub.projectIds.length}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right column — placeholder / prompt to select */}
      <div className="flex-1 flex flex-col min-w-0 bg-background items-center justify-center">
        <div className="text-center">
          <FolderOpen
            size={32}
            className="text-muted-foreground mx-auto mb-3"
          />
          <p className="text-sm text-muted-foreground">
            {hubs.length === 0
              ? "Create a hub to group related projects visually."
              : "Select a hub to view its node diagram."}
          </p>
        </div>
      </div>
    </div>
  );
}
