import { Button } from "@/components/ui/button";
// User management panel
import { Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { ROLES } from "./data";
import type { LiveApp, LogEntry, UserEntry } from "./types";

const AVATAR_COLORS: Record<string, { bg: string; fg: string }> = {
  o: { bg: "var(--live-accent-subtle)", fg: "var(--live-accent)" },
  a: { bg: "var(--color-status-ready-bg)", fg: "var(--color-status-ready)" },
  m: {
    bg: "var(--color-status-success-bg)",
    fg: "var(--color-status-success)",
  },
  j: {
    bg: "var(--color-status-building-bg)",
    fg: "var(--color-status-building)",
  },
  t: { bg: "var(--color-status-ready-bg)", fg: "var(--color-entry-build)" },
};

function avatarStyle(email: string) {
  const key = email[0]?.toLowerCase() ?? "o";
  return (
    AVATAR_COLORS[key] ?? { bg: "var(--color-border)", fg: "var(--color-text)" }
  );
}

interface UsersPanelProps {
  app: LiveApp;
  users: UserEntry[];
  setUsers: React.Dispatch<React.SetStateAction<UserEntry[]>>;
  onAddLog: (entry: LogEntry) => void;
}

export function UsersPanel({
  app: _app,
  users,
  setUsers,
  onAddLog,
}: UsersPanelProps) {
  const [inviteEmail, setInviteEmail] = useState("");

  function handleRoleChange(userId: string, newRole: string) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
    );
    onAddLog({
      id: `l${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "owner@caffeine.ai",
      action: `Changed role: ${user.email} → ${newRole}`,
      ip: "127.0.0.1",
    });
  }

  function handleRemove(userId: string) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    onAddLog({
      id: `l${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "owner@caffeine.ai",
      action: `Removed user: ${user.email}`,
      ip: "127.0.0.1",
    });
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const email = inviteEmail.trim();
    const newUser: UserEntry = {
      id: `u${Date.now()}`,
      name: email,
      email,
      role: "Viewer",
      joinedAt: new Date().toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      }),
    };
    setUsers((prev) => [...prev, newUser]);
    onAddLog({
      id: `l${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "owner@caffeine.ai",
      action: `Invited user: ${email}`,
      ip: "127.0.0.1",
    });
    setInviteEmail("");
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold text-foreground">Team Members</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-border text-muted-foreground">
          {users.length}
        </span>
      </div>

      {/* User list */}
      <div className="rounded-xl overflow-hidden border border-border">
        {users.map((user, i) => {
          const av = avatarStyle(user.email);
          return (
            <div
              key={user.id}
              className={`flex items-center justify-between gap-3 px-4 py-3 bg-card${
                i > 0 ? " border-t border-border" : ""
              }`}
              data-ocid={`manage.user.item.${i + 1}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: av.bg, color: av.fg }}
                >
                  {user.email[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-foreground">{user.name}</p>
                  <p className="text-xs truncate text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {user.role === "Owner" ? (
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--live-accent-subtle)",
                      color: "var(--color-role-owner)",
                    }}
                  >
                    Owner
                  </span>
                ) : (
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-xs rounded px-2 py-0.5 bg-card border border-border text-foreground outline-none"
                    data-ocid={`manage.role_select.${i + 1}`}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                )}
                {user.role !== "Owner" && (
                  <button
                    type="button"
                    onClick={() => handleRemove(user.id)}
                    className="p-1 rounded transition-colors duration-150 text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${user.name}`}
                    data-ocid={`manage.remove_user_button.${i + 1}`}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-px bg-border" />

      {/* Invite section */}
      <div>
        <p className="text-xs font-medium mb-2 text-foreground">
          Invite a team member
        </p>
        <form
          onSubmit={handleInvite}
          className="flex gap-2"
          data-ocid="manage.invite_form"
        >
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@example.com"
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-card border border-border text-foreground outline-none"
            data-ocid="manage.invite_email_input"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            data-ocid="manage.invite_submit_button"
          >
            <UserPlus size={13} className="mr-1.5" />
            Invite
          </Button>
        </form>
      </div>
    </div>
  );
}
