// Access log panel
import { Clock, Copy } from "lucide-react";
import { useState } from "react";
import type { LogEntry } from "./types";

interface AccessPanelProps {
  logs: LogEntry[];
}

export function AccessPanel({ logs }: AccessPanelProps) {
  const [copied, setCopied] = useState(false);

  function handleExport() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Tab header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Access Log</h3>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-150 text-muted-foreground hover:text-foreground"
          style={{ color: copied ? "var(--manage-health-ok)" : undefined }}
          data-ocid="manage.export_log_button"
        >
          <Copy size={12} />
          {copied ? "Copied!" : "Export log"}
        </button>
      </div>

      {/* Log entries */}
      <div className="rounded-xl overflow-hidden border border-border">
        {logs.map((entry, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered log entries
            key={i}
            className={`flex items-start gap-4 px-4 py-3${i > 0 ? " border-t border-border" : ""}${
              i % 2 === 0 ? " bg-card" : ""
            }`}
            data-ocid={`manage.access_log.item.${i + 1}`}
          >
            <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
              <Clock size={11} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                {entry.timestamp}
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-xs text-muted-foreground font-mono opacity-80">
                {entry.user}
              </span>
              <span className="mx-1.5 text-muted-foreground">·</span>
              <span className="text-sm text-foreground">{entry.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
