// Deploy history and rollback panel
import { CheckCircle, Rocket } from "lucide-react";
import { useState } from "react";
import { INITIAL_DEPLOY_HISTORY } from "./data";
import type { LiveApp, VersionEntry } from "./types";

export function DeployPanel({ app }: { app: LiveApp }) {
  const [history, setHistory] = useState<VersionEntry[]>(
    () => INITIAL_DEPLOY_HISTORY[app.id] ?? [],
  );
  const [rollingBack, setRollingBack] = useState<string | null>(null);
  const [rollbackProgress, setRollbackProgress] = useState(0);
  const [rolledBackTo, setRolledBackTo] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [_deployVersion, setDeployVersion] = useState("");

  const currentEntry = history.find((v) => v.active);

  async function handleDeploy() {
    const nextVersion = `v${history.length + 1}.0.0`;
    setDeployVersion(nextVersion);
    setDeploying(true);
    for (let stage = 0; stage <= 3; stage++) {
      setDeployProgress(stage);
      await new Promise((r) => setTimeout(r, 800));
    }
    const newEntry: VersionEntry = {
      id: `v${Date.now()}`,
      version: nextVersion,
      deployedAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      deployedBy: "Caffeine Designer",
      notes: "Deployed from Caffeine Designer",
      active: true,
    };
    setHistory((prev) =>
      prev.map((v) => ({ ...v, active: false })).concat(newEntry),
    );
    setDeploying(false);
    setDeployProgress(0);
  }

  async function handleRollback(version: string) {
    for (let stage = 0; stage <= 3; stage++) {
      setRollbackProgress(stage);
      await new Promise((r) => setTimeout(r, 800));
    }
    setHistory((prev) =>
      prev.map((v) => ({ ...v, active: v.version === version })),
    );
    setRolledBackTo(version);
    setRollingBack(null);
    setRollbackProgress(0);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Version History
        </h3>
        {currentEntry && (
          <span
            className="text-xs px-2 py-0.5 rounded-full text-muted-foreground"
            style={{ background: "var(--live-accent-subtle)" }}
          >
            Active: {currentEntry.version}
          </span>
        )}
      </div>

      {/* Deploy button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDeploy}
          disabled={deploying}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 disabled:opacity-50"
          style={{
            background: "var(--live-accent)",
            color: "#fff",
          }}
          data-ocid="manage.deploy_button"
        >
          <Rocket size={14} />
          {deploying ? "Going live..." : "Go live with new version"}
        </button>
        {deploying && (
          <div className="flex-1">
            <div className="h-1 rounded-full overflow-hidden bg-border">
              <div
                className="h-1 rounded-full transition-all duration-700"
                style={{
                  width: `${(deployProgress / 3) * 100}%`,
                  background: "var(--live-accent)",
                }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--live-accent)" }}>
              {deployProgress === 0 && "Preparing build..."}
              {deployProgress === 1 && "Uploading..."}
              {deployProgress === 2 && "Verifying..."}
              {deployProgress === 3 && "Now live!"}
            </p>
          </div>
        )}
      </div>

      {/* Version list */}
      <div className="space-y-2">
        {history.map((v) => (
          <div
            key={v.version}
            className="rounded-lg px-4 py-3 bg-card"
            style={{
              border: v.active
                ? "1px solid var(--live-accent-border)"
                : "1px solid var(--color-border)",
            }}
            data-ocid={`manage.deploy_version.${v.version}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-sm font-semibold px-2 py-0.5 rounded"
                    style={
                      v.active
                        ? {
                            background: "var(--live-accent-subtle)",
                            color: "var(--live-accent)",
                          }
                        : undefined
                    }
                  >
                    <span
                      className={
                        v.active
                          ? ""
                          : "text-muted-foreground bg-muted px-2 py-0.5 rounded"
                      }
                    >
                      {v.version}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {v.deployedAt}
                  </span>
                </div>
                <p className="text-xs mt-1 text-muted-foreground">{v.notes}</p>
                {rolledBackTo === v.version && rollingBack === null && (
                  <p
                    className="text-xs mt-1 font-medium"
                    style={{ color: "var(--manage-health-ok)" }}
                  >
                    ✓ Rolled back successfully
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 flex items-center">
                {v.active ? (
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--live-accent-subtle)",
                      color: "var(--live-accent)",
                    }}
                  >
                    Active
                  </span>
                ) : rollingBack === v.version ? null : rollingBack === null ? (
                  <button
                    type="button"
                    onClick={() => handleRollback(v.version)}
                    className="text-xs font-medium transition-colors duration-150 text-muted-foreground hover:text-foreground"
                    data-ocid={`manage.rollback_button.${v.version}`}
                  >
                    Rollback
                  </button>
                ) : null}
              </div>
            </div>

            {/* Inline rollback progress */}
            {rollingBack === v.version && (
              <div className="mt-3 space-y-2">
                <div className="h-1 rounded-full overflow-hidden bg-border">
                  <div
                    className="h-1 rounded-full transition-all duration-700"
                    style={{
                      width: `${(rollbackProgress / 3) * 100}%`,
                      background: "var(--live-accent)",
                    }}
                  />
                </div>
                <p className="text-xs" style={{ color: "var(--live-accent)" }}>
                  {rollbackProgress === 0 && "Preparing rollback\u2026"}
                  {rollbackProgress === 1 && `Uploading ${v.version}\u2026`}
                  {rollbackProgress === 2 && "Verifying build\u2026"}
                  {rollbackProgress === 3 && `Live on ${v.version}`}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current deploy info */}
      {currentEntry && (
        <div className="rounded-lg px-4 py-3 flex items-center gap-4 bg-card border border-border">
          <CheckCircle size={13} style={{ color: "var(--manage-health-ok)" }} />
          <div>
            <p className="text-xs font-medium text-foreground">
              {currentEntry.version} — deployed {currentEntry.deployedAt}
            </p>
            <p className="text-xs mt-0.5 text-muted-foreground">Status: Live</p>
          </div>
        </div>
      )}
    </div>
  );
}
