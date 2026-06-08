import { Button } from "@/components/ui/AppButton";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { Hub } from "@/types";
import {
  FolderOpen,
  GitBranch,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

interface HubPanelProps {
  onSelectHub: (hub: Hub) => void;
  selectedHubId: string | null;
}

const HUB_COLORS = [
  "var(--chart-3)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
];

export function HubPanel({ onSelectHub, selectedHubId }: HubPanelProps) {
  const hubs = useAppStore((s) => s.hubs);
  const projects = useAppStore((s) => s.projects);
  const addHub = useAppStore((s) => s.addHub);
  const updateHub = useAppStore((s) => s.updateHub);
  const removeHub = useAppStore((s) => s.removeHub);

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  function handleCreate() {
    if (!newName.trim()) return;
    const hub: Hub = {
      id: `hub-${Date.now()}`,
      name: newName.trim(),
      color: HUB_COLORS[hubs.length % HUB_COLORS.length],
      projectIds: [],
      nodes: [],
      connections: [],
    };
    addHub(hub);
    setNewName("");
    setCreating(false);
  }

  function handleRename(hub: Hub) {
    if (!editName.trim()) return;
    updateHub({ ...hub, name: editName.trim() });
    setEditingId(null);
  }

  function startEdit(hub: Hub) {
    setEditingId(hub.id);
    setEditName(hub.name);
    setMenuOpenId(null);
  }

  function handleDelete(id: string) {
    removeHub(id);
    setMenuOpenId(null);
  }

  return (
    <div
      className="flex flex-col h-full min-h-0"
      data-ocid="organize.hub_panel"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 flex-shrink-0">
        <div className="flex items-center gap-2">
          <GitBranch size={14} className="text-accent" />
          <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            Hubs
          </span>
          <span className="text-2xs text-muted-foreground/60">
            {hubs.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCreating(true)}
          data-ocid="organize.hub.create_button"
        >
          <Plus size={13} />
          <span className="text-2xs">New</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {creating && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-card border border-border/60">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setCreating(false);
              }}
              placeholder="Hub name"
              className="flex-1 text-xs bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              data-ocid="organize.hub.create_input"
            />
            <button
              type="button"
              onClick={handleCreate}
              className="text-2xs font-medium text-accent hover:opacity-80"
              data-ocid="organize.hub.create_confirm"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {hubs.length === 0 && !creating && (
          <div className="text-center py-8 px-2">
            <FolderOpen
              size={20}
              className="mx-auto text-muted-foreground/40 mb-2"
            />
            <p className="text-2xs text-muted-foreground">
              No hubs yet. Create one to group related projects.
            </p>
          </div>
        )}

        {hubs.map((hub) => {
          const isSelected = selectedHubId === hub.id;
          const memberCount = hub.projectIds.length;

          return (
            <div
              key={hub.id}
              className={cn(
                "group relative rounded-lg border transition-colors duration-150",
                isSelected
                  ? "border-accent/40 bg-accent/5"
                  : "border-border/40 bg-card hover:border-border/80 shadow-sm",
              )}
              data-ocid={`organize.hub.item.${hub.id}`}
            >
              <button
                type="button"
                onClick={() => onSelectHub(hub)}
                className="w-full text-left p-3"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: hub.color }}
                  />
                  {editingId === hub.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(hub);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onBlur={() => handleRename(hub)}
                      className="flex-1 text-xs bg-transparent outline-none text-foreground"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="flex-1 text-xs font-medium text-foreground truncate">
                      {hub.name}
                    </span>
                  )}
                  <span className="text-2xs text-muted-foreground flex-shrink-0">
                    {memberCount} project{memberCount !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Mini member avatars */}
                {memberCount > 0 && (
                  <div className="flex items-center gap-1 mt-2 ml-5">
                    {hub.projectIds.slice(0, 5).map((pid) => {
                      const proj = projects.find((p) => p.id === pid);
                      if (!proj) return null;
                      return (
                        <span
                          key={pid}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-2xs text-accent-foreground font-bold"
                          style={{ backgroundColor: proj.iconColor }}
                          title={proj.name}
                        >
                          {proj.name.charAt(0)}
                        </span>
                      );
                    })}
                    {memberCount > 5 && (
                      <span className="text-2xs text-muted-foreground ml-0.5">
                        +{memberCount - 5}
                      </span>
                    )}
                  </div>
                )}
              </button>

              {/* Actions menu */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === hub.id ? null : hub.id);
                  }}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                  data-ocid={`organize.hub.menu.${hub.id}`}
                >
                  <MoreHorizontal size={12} />
                </button>
                {menuOpenId === hub.id && (
                  <div className="absolute right-0 top-6 z-20 w-32 rounded-md border border-border bg-card shadow-elevated py-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(hub);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-2xs text-foreground hover:bg-muted text-left"
                    >
                      <Pencil size={11} />
                      Rename
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(hub.id);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-2xs text-destructive hover:bg-destructive/10 text-left"
                    >
                      <Trash2 size={11} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
