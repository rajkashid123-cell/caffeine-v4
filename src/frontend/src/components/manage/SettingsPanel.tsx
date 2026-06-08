import { Button } from "@/components/ui/button";
// App settings panel
import { Trash2 } from "lucide-react";
import { useState } from "react";
import type { LiveApp } from "./types";

export function SettingsPanel({ app }: { app: LiveApp }) {
  const [appName, setAppName] = useState(app.name);
  const [transferEmail, setTransferEmail] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="rename-input"
          className="block text-xs font-medium mb-2 text-foreground"
        >
          App name
        </label>
        <div className="flex gap-2">
          <input
            id="rename-input"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-card border border-border text-foreground outline-none"
            data-ocid="manage.rename_input"
          />
          <Button
            variant="outline"
            size="sm"
            data-ocid="manage.rename_save_button"
            type="button"
          >
            Save
          </Button>
        </div>
      </div>

      <div>
        <label
          htmlFor="transfer-input"
          className="block text-xs font-medium mb-1 text-foreground"
        >
          Transfer ownership
        </label>
        <p className="text-xs mb-2 text-muted-foreground">
          Enter the email of the new owner. This cannot be undone.
        </p>
        <div className="flex gap-2">
          <input
            id="transfer-input"
            value={transferEmail}
            onChange={(e) => setTransferEmail(e.target.value)}
            placeholder="new-owner@example.com"
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-card border border-border text-foreground outline-none"
            data-ocid="manage.transfer_input"
          />
          <Button
            variant="outline"
            size="sm"
            data-ocid="manage.transfer_button"
            type="button"
          >
            Transfer
          </Button>
        </div>
      </div>

      <div
        className="rounded-xl p-4"
        style={{
          border: "1px solid var(--live-health-error-bg)",
          background: "var(--live-health-error-bg)",
        }}
      >
        <p
          className="text-sm font-semibold mb-1"
          style={{ color: "var(--live-health-error)" }}
        >
          Delete this app
        </p>
        <p className="text-xs mb-3 text-muted-foreground">
          This is permanent. Type{" "}
          <strong className="text-foreground">{app.name}</strong> to confirm.
        </p>
        {!showDelete ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDelete(true)}
            data-ocid="manage.delete_app_button"
            type="button"
          >
            <Trash2 size={12} className="mr-1.5" /> Delete app
          </Button>
        ) : (
          <div className="flex gap-2" data-ocid="manage.delete_confirm_section">
            <input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={app.name}
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-card border border-destructive/30 text-foreground outline-none"
              data-ocid="manage.delete_confirm_input"
            />
            {deleteConfirm === app.name && (
              <Button
                variant="destructive"
                size="sm"
                data-ocid="manage.delete_confirm_button"
                type="button"
              >
                Confirm delete
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
