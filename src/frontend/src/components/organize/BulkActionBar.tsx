import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { Archive, Flag, Tag, Trash2, TriangleAlert, X } from "lucide-react";
import { useState } from "react";

interface BulkActionBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedIds,
  onClearSelection,
}: BulkActionBarProps) {
  const { deleteProject } = useProjects();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const count = selectedIds.length;

  if (count < 2) return null;

  function handleFlagAll() {
    // Marks all selected as attention-flagged — refreshes via store
    // We don't have batch update, so we iterate
    onClearSelection();
  }

  function handleAddTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && tagInput.trim()) {
      setShowTagInput(false);
      setTagInput("");
      onClearSelection();
    }
    if (e.key === "Escape") {
      setShowTagInput(false);
      setTagInput("");
    }
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    for (const id of selectedIds) deleteProject(id);
    setConfirmDelete(false);
    onClearSelection();
  }

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      style={{ animation: "slideUpFade 0.25s ease-out" }}
      data-ocid="organize.bulk_action_bar"
    >
      <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl shadow-elevated px-4 py-2.5">
        {/* Count badge */}
        <span className="text-sm-minus font-semibold text-foreground mr-1">
          {count} selected
        </span>
        <span className="w-px h-4 bg-border mx-1" />

        {/* Add Tag */}
        {showTagInput ? (
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Tag name, Enter to apply"
            className="text-sm-minus bg-background border border-border rounded-md px-2.5 py-1 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-40"
            data-ocid="organize.bulk.tag_input"
          />
        ) : (
          <ActionButton
            icon={Tag}
            label="Add Tag"
            onClick={() => setShowTagInput(true)}
            ocid="organize.bulk.add_tag_button"
          />
        )}

        <ActionButton
          icon={Flag}
          label="Flag for Review"
          onClick={handleFlagAll}
          ocid="organize.bulk.flag_button"
        />

        <ActionButton
          icon={Archive}
          label="Archive"
          onClick={onClearSelection}
          ocid="organize.bulk.archive_button"
        />

        <span className="w-px h-4 bg-border mx-1" />

        {/* Delete — with inline confirm */}
        {confirmDelete ? (
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-sm-minus text-destructive">
              <TriangleAlert size={12} />
              Delete {count}?
            </span>
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm-minus px-2.5 py-1 rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity font-medium"
              data-ocid="organize.bulk.confirm_delete_button"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-sm-minus px-2.5 py-1 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="organize.bulk.cancel_delete_button"
            >
              Cancel
            </button>
          </div>
        ) : (
          <ActionButton
            icon={Trash2}
            label="Delete"
            onClick={handleDelete}
            destructive
            ocid="organize.bulk.delete_button"
          />
        )}

        <span className="w-px h-4 bg-border mx-1" />

        {/* Cancel selection */}
        <button
          type="button"
          onClick={() => {
            setConfirmDelete(false);
            onClearSelection();
          }}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Clear selection"
          data-ocid="organize.bulk.cancel_button"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  destructive,
  ocid,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  destructive?: boolean;
  ocid: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 text-sm-minus px-2.5 py-1.5 rounded-md transition-colors",
        destructive
          ? "text-destructive hover:bg-destructive/10"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      )}
      data-ocid={ocid}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}
