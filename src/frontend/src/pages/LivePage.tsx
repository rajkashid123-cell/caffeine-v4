import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AccessPanel } from "@/components/manage/AccessPanel";
import CyclesPanel from "@/components/manage/CyclesPanel";
import { DeployPanel } from "@/components/manage/DeployPanel";
import OperationsPanel from "@/components/manage/OperationsPanel";
import { SettingsPanel } from "@/components/manage/SettingsPanel";
import { UsersPanel } from "@/components/manage/UsersPanel";
import {
  INITIAL_ACCESS_LOGS,
  INITIAL_USERS,
  LIVE_APPS,
} from "@/components/manage/data";
import type {
  LiveApp,
  LogEntry,
  TabName,
  UserEntry,
} from "@/components/manage/types";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Activity,
  AlertTriangle,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Key,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { BreadcrumbHeader } from "../components/layout/BreadcrumbHeader";
import { ModeCard } from "../components/layout/ModeCard";
import { ModeHeader } from "../components/layout/ModeHeader";
import { PageWrapper } from "../components/layout/PageWrapper";

const TABS: TabName[] = [
  "Operations",
  "Go Live",
  "Access",
  "Users",
  "Settings",
  "Credits & Cost",
];

const TAB_ICONS: Record<TabName, React.ElementType> = {
  Operations: Activity,
  "Go Live": Zap,
  Access: Key,
  Users: Users,
  Settings: Settings,
  "Credits & Cost": Zap,
};

type SortKey =
  | "name"
  | "health"
  | "users"
  | "dailyUsage"
  | "cost"
  | "lastUpdate";
type SortDir = "asc" | "desc";

function getHealthOrder(health: string): number {
  if (health === "ok") return 0;
  if (health === "warn") return 1;
  return 2;
}

function getCostPerDay(app: LiveApp): number {
  return app.burnRateNum * 0.00000001;
}

function formatCost(costOrApp: LiveApp | number): string {
  const cost =
    typeof costOrApp === "number" ? costOrApp : getCostPerDay(costOrApp);
  if (cost < 0.01) return "<$0.01";
  return `${cost.toFixed(2)}`;
}

function SortIcon({
  col,
  sortKey,
  sortDir,
}: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey)
    return (
      <ArrowUpDown size={12} className="ml-1 text-muted-foreground/50 inline" />
    );
  return sortDir === "asc" ? (
    <ChevronUp
      size={12}
      className="ml-1 inline"
      style={{ color: "var(--live-accent)" }}
    />
  ) : (
    <ChevronDown
      size={12}
      className="ml-1 inline"
      style={{ color: "var(--live-accent)" }}
    />
  );
}

function HealthBadge({ health, label }: { health: string; label: string }) {
  const styles: Record<string, string> = {
    ok: "bg-[color:var(--live-health-ok-bg)] text-[color:var(--live-health-ok)] border-[color:var(--live-health-ok)]/30",
    warn: "bg-[color:var(--live-health-warn-bg)] text-[color:var(--live-health-warn)] border-[color:var(--live-health-warn)]/40",
    critical:
      "bg-[color:var(--live-health-error-bg)] text-[color:var(--live-health-error)] border-[color:var(--live-health-error)]/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium ${
        styles[health] ?? styles.ok
      }`}
    >
      {label}
    </span>
  );
}

function StatusDot({ health }: { health: string }) {
  const colors: Record<string, string> = {
    ok: "var(--live-health-ok)",
    warn: "var(--live-health-warn)",
    critical: "var(--live-health-error)",
  };
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ background: colors[health] ?? colors.ok }}
    />
  );
}

export function LivePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabName>("Operations");

  const [usersByApp, setUsersByApp] = useState<Record<string, UserEntry[]>>(
    () => ({ ...INITIAL_USERS }),
  );
  const [logsByApp, setLogsByApp] = useState<Record<string, LogEntry[]>>(
    () => ({ ...INITIAL_ACCESS_LOGS }),
  );

  function handleSelect(id: string) {
    setSelectedId(id);
    setActiveTab("Operations");
  }

  function handleBack() {
    setSelectedId(null);
  }

  function handleAddLog(appId: string, entry: LogEntry) {
    setLogsByApp((prev) => ({
      ...prev,
      [appId]: [entry, ...(prev[appId] ?? [])],
    }));
  }

  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const selectedApp = LIVE_APPS.find((a) => a.id === selectedId) ?? null;
  const attentionCount = LIVE_APPS.filter((a) => a.health !== "ok").length;
  const totalUsers = LIVE_APPS.reduce((s, a) => s + a.users, 0);
  const totalCostDay = LIVE_APPS.reduce((s, a) => s + getCostPerDay(a), 0);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedApps = [...LIVE_APPS].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") cmp = a.name.localeCompare(b.name);
    else if (sortKey === "health")
      cmp = getHealthOrder(a.health) - getHealthOrder(b.health);
    else if (sortKey === "users") cmp = a.users - b.users;
    else if (sortKey === "dailyUsage") cmp = a.burnRateNum - b.burnRateNum;
    else if (sortKey === "cost") cmp = getCostPerDay(a) - getCostPerDay(b);
    else if (sortKey === "lastUpdate")
      cmp = a.lastDeploy.localeCompare(b.lastDeploy);
    return sortDir === "asc" ? cmp : -cmp;
  });

  // ── Focus detail screen: replaces the whole view when an app is selected ──
  if (selectedApp) {
    const _isWarn =
      selectedApp.health === "warn" || selectedApp.health === "critical";

    const tabBar = (
      <div className="flex border-b border-border/50 overflow-x-auto bg-card">
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-5 h-12 text-xs whitespace-nowrap border-b-2 transition-colors duration-150 ${isActive ? "font-bold" : "font-medium hover:bg-muted/30"} ${
                isActive
                  ? "border-current"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={{
                borderBottomColor: isActive ? "var(--live-accent)" : undefined,
                color: isActive ? "var(--live-accent)" : undefined,
              }}
              data-ocid={`live.tab.${tab.toLowerCase().replace(/ /g, "_").replace(/&_/g, "")}`}
            >
              <Icon size={15} />
              {tab}
            </button>
          );
        })}
      </div>
    );

    const detailAction = (
      <span
        className="text-xs text-muted-foreground px-2.5 py-1 rounded-full border border-border bg-background"
        data-ocid="live.preview_badge"
      >
        Simulated preview
      </span>
    );

    return (
      <ErrorBoundary fallbackLabel="Live">
        <PageWrapper
          noPadding
          scrollable={false}
          header={
            <BreadcrumbHeader
              onBack={handleBack}
              backLabel="Live"
              title={selectedApp.name}
              subtitle={`${selectedApp.healthLabel} · ${selectedApp.version}`}
              action={detailAction}
              data-ocid="live.detail_page"
            />
          }
        >
          {/* Tab bar — flex-shrink-0 so it never scrolls away */}
          <div data-mode="live" className="flex flex-col h-full min-h-0">
            <div className="flex-shrink-0">{tabBar}</div>
            {/* Tab content fills remaining height */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-6">
                {activeTab === "Operations" && (
                  <OperationsPanel app={selectedApp} />
                )}
                {activeTab === "Go Live" && <DeployPanel app={selectedApp} />}
                {activeTab === "Access" && (
                  <AccessPanel logs={logsByApp[selectedApp.id] ?? []} />
                )}
                {activeTab === "Users" && (
                  <UsersPanel
                    app={selectedApp}
                    users={usersByApp[selectedApp.id] ?? []}
                    setUsers={(updater) =>
                      setUsersByApp((prev) => ({
                        ...prev,
                        [selectedApp.id]:
                          typeof updater === "function"
                            ? updater(prev[selectedApp.id] ?? [])
                            : updater,
                      }))
                    }
                    onAddLog={(entry) => handleAddLog(selectedApp.id, entry)}
                  />
                )}
                {activeTab === "Settings" && (
                  <SettingsPanel app={selectedApp} />
                )}
                {activeTab === "Credits & Cost" && (
                  <CyclesPanel app={selectedApp} />
                )}
              </div>
            </div>
          </div>
        </PageWrapper>
      </ErrorBoundary>
    );
  }

  // ── App list view ──────────────────────────────────────────────────────────
  const subtitleText =
    attentionCount > 0
      ? `${LIVE_APPS.length} apps · ${attentionCount} need attention`
      : `${LIVE_APPS.length} apps · all good`;

  return (
    <ErrorBoundary fallbackLabel="Live">
      <PageWrapper
        scrollable
        header={
          <ModeHeader
            title="Live"
            subtitle={subtitleText}
            data-ocid="live.header"
          />
        }
      >
        {LIVE_APPS.length === 0 ? (
          <div
            data-mode="live"
            data-ocid="live.page"
            className="flex-1 flex items-center justify-center p-6"
          >
            <div data-ocid="live.empty_state">
              <EmptyState
                icon={Activity}
                title="No live apps yet"
                description="Mark a project as Live in Organize to see it here."
              />
            </div>
          </div>
        ) : (
          <div
            data-mode="live"
            data-ocid="live.page"
            className="flex flex-col gap-6 p-6"
          >
            {/* Summary card */}
            <ModeCard
              className="p-6"
              style={{
                borderColor: "var(--live-accent-border)",
                background: "var(--live-accent-subtle)",
              }}
            >
              <div className="grid grid-cols-4 gap-6 divide-x divide-border/60">
                <div className="px-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Running Apps
                  </p>
                  <p className="text-2xl font-semibold text-foreground tabular-nums">
                    {LIVE_APPS.length}
                  </p>
                </div>
                <div className="pl-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Total Users
                  </p>
                  <p className="text-2xl font-semibold text-foreground tabular-nums">
                    {totalUsers.toLocaleString()}
                  </p>
                </div>
                <div className="pl-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Need Attention
                  </p>
                  <p
                    className="text-2xl font-semibold tabular-nums"
                    style={{
                      color:
                        attentionCount > 0
                          ? "var(--live-health-warn)"
                          : "var(--live-health-ok)",
                    }}
                  >
                    {attentionCount}
                  </p>
                </div>
                <div className="pl-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Est. Daily Cost
                  </p>
                  <p className="text-2xl font-semibold text-foreground tabular-nums">
                    {formatCost(totalCostDay)}/day
                  </p>
                </div>
              </div>
            </ModeCard>

            {/* Sortable table */}
            <ModeCard data-ocid="live.overview_grid">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {(
                      [
                        { label: "App", key: "name" as SortKey },
                        { label: "Status", key: null },
                        { label: "Health", key: "health" as SortKey },
                        { label: "Users", key: "users" as SortKey },
                        { label: "Daily Usage", key: "dailyUsage" as SortKey },
                        { label: "Est. Daily Cost", key: "cost" as SortKey },
                        { label: "Last Update", key: "lastUpdate" as SortKey },
                      ] as { label: string; key: SortKey | null }[]
                    ).map((col) => (
                      <th
                        key={col.label}
                        onClick={
                          col.key
                            ? () => handleSort(col.key as SortKey)
                            : undefined
                        }
                        onKeyDown={
                          col.key
                            ? (e) => {
                                if (e.key === "Enter" || e.key === " ")
                                  handleSort(col.key as SortKey);
                              }
                            : undefined
                        }
                        tabIndex={col.key ? 0 : undefined}
                        className={`px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide${col.key ? " cursor-pointer select-none hover:text-foreground transition-colors" : ""}`}
                      >
                        {col.label}
                        {col.key && (
                          <SortIcon
                            col={col.key}
                            sortKey={sortKey}
                            sortDir={sortDir}
                          />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedApps.map((app, i) => (
                    <tr
                      key={app.id}
                      onClick={() => handleSelect(app.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleSelect(app.id);
                      }}
                      tabIndex={0}
                      className="cursor-pointer hover:bg-muted/50 border-b border-border last:border-0 h-14 transition-colors"
                      data-ocid={`live.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm text-foreground">
                          {app.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {app.description}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusDot health={app.health} />
                      </td>
                      <td className="px-4 py-3">
                        <HealthBadge
                          health={app.health}
                          label={app.healthLabel}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground tabular-nums">
                        {app.users.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground tabular-nums">
                        {app.burnRateNum.toLocaleString()}
                        <span className="text-xs text-muted-foreground ml-1">
                          credits/day
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground tabular-nums">
                        {formatCost(app)}/day
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {app.lastDeploy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ModeCard>
          </div>
        )}
      </PageWrapper>
    </ErrorBoundary>
  );
}
