import {
  Variant_idea_defining_live_building_exploring,
  Variant_low_high_medium,
  Variant_notDeployed_live_failed,
} from "@/backend";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { SortBy } from "@/types";
import type { OrganizeFilters } from "@/types";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useRef, useState } from "react";

const PRIORITY_OPTIONS = [
  { value: Variant_low_high_medium.high, label: "High" },
  { value: Variant_low_high_medium.medium, label: "Medium" },
  { value: Variant_low_high_medium.low, label: "Low" },
];

const MATURITY_OPTIONS = [
  { value: Variant_idea_defining_live_building_exploring.idea, label: "Idea" },
  {
    value: Variant_idea_defining_live_building_exploring.exploring,
    label: "Exploring",
  },
  {
    value: Variant_idea_defining_live_building_exploring.defining,
    label: "Defining",
  },
  {
    value: Variant_idea_defining_live_building_exploring.building,
    label: "Building",
  },
  { value: Variant_idea_defining_live_building_exploring.live, label: "Live" },
];

const STATUS_OPTIONS = [
  { value: Variant_notDeployed_live_failed.notDeployed, label: "Draft" },
  { value: "deploying" as Variant_notDeployed_live_failed, label: "Deploying" },
  { value: Variant_notDeployed_live_failed.live, label: "Live" },
  { value: Variant_notDeployed_live_failed.failed, label: "Failed" },
];

const SORT_OPTIONS: { value: SortBy | "burn-rate"; label: string }[] = [
  { value: SortBy.updatedAt, label: "Last edited" },
  { value: SortBy.createdAt, label: "Date created" },
  { value: SortBy.name, label: "Name A–Z" },
  { value: SortBy.priority, label: "Priority" },
  { value: "burn-rate", label: "Burn rate" },
];

type FilterDropdown =
  | "priority"
  | "maturity"
  | "status"
  | "sort"
  | "tags"
  | null;

interface FilterBarProps {
  resultCount: number;
  allTags: string[];
}

function DropdownButton({
  label,
  active,
  open,
  onClick,
  ocid,
}: {
  label: string;
  active?: boolean;
  open: boolean;
  onClick: () => void;
  ocid: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 text-sm-minus px-2.5 py-1 rounded-md border transition-colors",
        active
          ? "border-accent/60 text-accent bg-accent/8"
          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
        open && "border-accent/60 text-accent",
      )}
      data-ocid={ocid}
    >
      {label}
      <ChevronDown
        size={11}
        className={cn("transition-transform", open && "rotate-180")}
      />
    </button>
  );
}

export function FilterBar({ resultCount, allTags }: FilterBarProps) {
  const filters = useAppStore((s) => s.organizeFilters);
  const setFilters = useAppStore((s) => s.setOrganizeFilters);
  const sortBy = useAppStore((s) => s.organizeSortBy);
  const setSortBy = useAppStore((s) => s.setOrganizeSortBy);

  const [openDropdown, setOpenDropdown] = useState<FilterDropdown>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function toggleDropdown(d: FilterDropdown) {
    setOpenDropdown((prev) => (prev === d ? null : d));
  }

  function clearAll() {
    setFilters({
      tags: [],
      priority: undefined,
      maturity: undefined,
      deploymentStatus: undefined,
    });
  }

  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.priority != null ||
    filters.maturity != null ||
    filters.deploymentStatus != null;

  const priorityLabel = filters.priority
    ? PRIORITY_OPTIONS.find((o) => o.value === filters.priority)?.label
    : undefined;
  const maturityLabel = filters.maturity
    ? MATURITY_OPTIONS.find((o) => o.value === filters.maturity)?.label
    : undefined;
  const statusLabel = filters.deploymentStatus
    ? STATUS_OPTIONS.find((o) => o.value === filters.deploymentStatus)?.label
    : undefined;
  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Sort";

  return (
    <div
      ref={containerRef}
      className="sticky top-0 z-10 bg-card/50 backdrop-blur-sm"
      data-ocid="organize.filter_bar"
    >
      <div className="flex items-center gap-3 px-6 py-2.5 flex-wrap h-16">
        {/* Filter icon */}
        <SlidersHorizontal
          size={13}
          className="text-muted-foreground flex-shrink-0"
        />

        {/* Priority dropdown */}
        <div className="relative">
          <DropdownButton
            label={priorityLabel ? `Priority: ${priorityLabel}` : "Priority"}
            active={!!filters.priority}
            open={openDropdown === "priority"}
            onClick={() => toggleDropdown("priority")}
            ocid="organize.filter.priority_button"
          />
          {openDropdown === "priority" && (
            <DropdownMenu onClose={() => setOpenDropdown(null)}>
              {PRIORITY_OPTIONS.map((opt) => (
                <DropdownItem
                  key={opt.value}
                  label={opt.label}
                  active={filters.priority === opt.value}
                  onClick={() => {
                    setFilters({
                      priority:
                        filters.priority === opt.value ? undefined : opt.value,
                    });
                    setOpenDropdown(null);
                  }}
                />
              ))}
            </DropdownMenu>
          )}
        </div>

        {/* Maturity dropdown */}
        <div className="relative">
          <DropdownButton
            label={maturityLabel ? `Maturity: ${maturityLabel}` : "Maturity"}
            active={!!filters.maturity}
            open={openDropdown === "maturity"}
            onClick={() => toggleDropdown("maturity")}
            ocid="organize.filter.maturity_button"
          />
          {openDropdown === "maturity" && (
            <DropdownMenu onClose={() => setOpenDropdown(null)}>
              {MATURITY_OPTIONS.map((opt) => (
                <DropdownItem
                  key={opt.value}
                  label={opt.label}
                  active={filters.maturity === opt.value}
                  onClick={() => {
                    setFilters({
                      maturity:
                        filters.maturity === opt.value ? undefined : opt.value,
                    });
                    setOpenDropdown(null);
                  }}
                />
              ))}
            </DropdownMenu>
          )}
        </div>

        {/* Status dropdown */}
        <div className="relative">
          <DropdownButton
            label={statusLabel ? `Status: ${statusLabel}` : "Status"}
            active={!!filters.deploymentStatus}
            open={openDropdown === "status"}
            onClick={() => toggleDropdown("status")}
            ocid="organize.filter.status_button"
          />
          {openDropdown === "status" && (
            <DropdownMenu onClose={() => setOpenDropdown(null)}>
              {STATUS_OPTIONS.map((opt) => (
                <DropdownItem
                  key={opt.value}
                  label={opt.label}
                  active={filters.deploymentStatus === opt.value}
                  onClick={() => {
                    setFilters({
                      deploymentStatus:
                        filters.deploymentStatus === opt.value
                          ? undefined
                          : opt.value,
                    });
                    setOpenDropdown(null);
                  }}
                />
              ))}
            </DropdownMenu>
          )}
        </div>

        {/* Tags dropdown — only show if there are tags in use */}
        {allTags.length > 0 && (
          <div className="relative">
            <DropdownButton
              label={
                filters.tags.length > 0
                  ? `Tags (${filters.tags.length})`
                  : "Tags"
              }
              active={filters.tags.length > 0}
              open={openDropdown === "tags"}
              onClick={() => toggleDropdown("tags")}
              ocid="organize.filter.tags_button"
            />
          </div>
        )}

        {/* Divider */}
        <span className="w-px h-4 bg-border mx-0.5 flex-shrink-0" />

        {/* Sort dropdown */}
        <div className="relative">
          <DropdownButton
            label={sortLabel}
            open={openDropdown === "sort"}
            onClick={() => toggleDropdown("sort")}
            ocid="organize.sort_button"
          />
          {openDropdown === "sort" && (
            <DropdownMenu onClose={() => setOpenDropdown(null)}>
              {SORT_OPTIONS.map((opt) => (
                <DropdownItem
                  key={opt.value}
                  label={opt.label}
                  active={sortBy === opt.value}
                  onClick={() => {
                    setSortBy(opt.value);
                    setOpenDropdown(null);
                  }}
                />
              ))}
            </DropdownMenu>
          )}
        </div>

        {/* Active filter chips */}
        {filters.tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            active
            onRemove={() =>
              setFilters({ tags: filters.tags.filter((t) => t !== tag) })
            }
          />
        ))}

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs-plus text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="organize.clear_filters_button"
          >
            <X size={10} />
            Clear
          </button>
        )}

        {/* Spacer + count */}
        <span className="ml-auto text-xs-plus text-muted-foreground">
          {resultCount} project{resultCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function DropdownMenu({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-20"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-hidden
      />
      <div className="absolute left-0 top-full mt-1 min-w-[140px] bg-popover border border-border rounded-lg shadow-elevated z-30 py-1">
        {children}
      </div>
    </>
  );
}

function DropdownItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left text-sm-minus px-3 py-1.5 transition-colors",
        active
          ? "text-accent bg-accent/10"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
      )}
    >
      {active && <span className="mr-1.5">✓</span>}
      {label}
    </button>
  );
}
