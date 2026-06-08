import { ITERATE_ACTIONS } from "@/lib/iterateActions";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { MessageSquare, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// Keyword → action ID mapping
const TRIGGER_MAP: { pattern: RegExp; actionId: string; label: string }[] = [
  { pattern: /visual\s*pass/i, actionId: "visual-pass", label: "Visual Pass" },
  {
    pattern: /feature\s*audit/i,
    actionId: "feature-audit",
    label: "Feature Audit",
  },
  { pattern: /simplif/i, actionId: "simplify", label: "Simplify" },
  { pattern: /tone\s*check/i, actionId: "tone-check", label: "Tone Check" },
  { pattern: /role\s*audit/i, actionId: "role-audit", label: "Role Audit" },
  {
    pattern: /clarif|clarity/i,
    actionId: "tighten-copy",
    label: "Tighten Copy",
  },
  {
    pattern: /accessib/i,
    actionId: "accessibility-audit",
    label: "Accessibility Audit",
  },
  {
    pattern: /navigation\s*audit/i,
    actionId: "navigation-audit",
    label: "Navigation Audit",
  },
  {
    pattern: /consistenc/i,
    actionId: "consistency-audit",
    label: "Consistency Audit",
  },
  {
    pattern: /generate\s*roles?|add\s*role/i,
    actionId: "add-role",
    label: "Add a Role",
  },
  {
    pattern: /generate\s*screens?|add\s*screen/i,
    actionId: "add-screen",
    label: "Add a Screen",
  },
  {
    pattern: /suggest\s*features?/i,
    actionId: "feature-audit",
    label: "Feature Audit",
  },
  {
    pattern: /performance/i,
    actionId: "performance-audit",
    label: "Performance Audit",
  },
  { pattern: /ux\s*audit|cognitive/i, actionId: "ux-audit", label: "UX Audit" },
  { pattern: /calm/i, actionId: "calm-down", label: "Calm It Down" },
  {
    pattern: /build\s*plan/i,
    actionId: "build-plan",
    label: "Generate Build Plan",
  },
];

// Command prefix pattern: "run", "do", or "apply" followed by optional "a"
const COMMAND_PREFIXES = /^(?:run|do|apply)\s+(?:a\s+)?(.+)/i;

// Known named actions for command-prefix fuzzy matching
const NAMED_ACTIONS: { name: string; actionId: string; label: string }[] = [
  { name: "visual pass", actionId: "visual-pass", label: "Visual Pass" },
  { name: "feature audit", actionId: "feature-audit", label: "Feature Audit" },
  { name: "simplify", actionId: "simplify", label: "Simplify" },
  { name: "tone check", actionId: "tone-check", label: "Tone Check" },
  { name: "role audit", actionId: "role-audit", label: "Role Audit" },
];

function detectTrigger(
  text: string,
): { actionId: string; label: string } | null {
  const trimmed = text.trim();

  // Check command prefix pattern first ("run visual pass", "do a feature audit", etc.)
  const cmdMatch = COMMAND_PREFIXES.exec(trimmed);
  if (cmdMatch) {
    const actionName = cmdMatch[1].trim().toLowerCase();
    const match = NAMED_ACTIONS.find(
      (a) =>
        actionName.startsWith(a.name) ||
        a.name.startsWith(actionName) ||
        a.name.includes(actionName),
    );
    if (match) return { actionId: match.actionId, label: match.label };
  }

  // Fall back to keyword pattern matching
  for (const entry of TRIGGER_MAP) {
    if (entry.pattern.test(trimmed))
      return { actionId: entry.actionId, label: entry.label };
  }
  return null;
}

const GENERIC_RESPONSES = [
  "Based on your spec, I'd suggest refining the audience definition to be more specific — it will sharpen every feature decision downstream.",
  "Looking at the features you've defined, there's a nice core here. Consider whether the secondary features could be deferred to a later phase.",
  "That's a useful observation. The vibe and colour choices in your spec align well with the audience — that coherence is worth preserving.",
  "Your navigation structure is clear. The role definitions suggest two distinct entry points — worth making that split explicit in the spec.",
  "The scope feels right for an MVP. I'd focus the next iteration on tightening the data model before adding more screens.",
  "Good instinct. The feature you're describing would fit well as an Iterate action — try running one of the actions from the library.",
];

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface IterateChatProps {
  projectId: string | null;
  open: boolean;
  onClose: () => void;
  onTriggerAction: (actionId: string) => void;
}

export function IterateChat({
  projectId,
  open,
  onClose,
  onTriggerAction,
}: IterateChatProps) {
  // Safe selector: always returns an array even if projectId is null or
  // chatMessages doesn't have an entry for this project yet
  const messages = useAppStore((s) =>
    projectId != null ? (s.chatMessages[projectId] ?? []) : [],
  );
  const addChatMessage = useAppStore((s) => s.addChatMessage);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Stable count ref to avoid stale closures in handleSend
  const msgCountRef = useRef(0);
  msgCountRef.current = messages.length;

  // Auto-scroll when messages change — deps are intentional
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message or typing state change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Clear AI timeout on unmount
  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, []);

  const handleSend = useCallback(() => {
    // Guard: both input and a valid projectId must exist
    if (!input.trim() || !projectId) return;
    const text = input.trim();
    addChatMessage(projectId, { role: "user", text, timestamp: Date.now() });
    setInput("");
    const trigger = detectTrigger(text);
    setIsTyping(true);
    // Use ref for count so this callback doesn't need messages in dep array
    const currentCount = msgCountRef.current;
    aiTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (trigger) {
        onTriggerAction(trigger.actionId);
        addChatMessage(projectId, {
          role: "ai",
          text: `Running ${trigger.label}…`,
          timestamp: Date.now(),
          actionChip: { actionId: trigger.actionId, label: trigger.label },
        });
      } else {
        const idx = currentCount % GENERIC_RESPONSES.length;
        addChatMessage(projectId, {
          role: "ai",
          text: GENERIC_RESPONSES[idx],
          timestamp: Date.now(),
        });
      }
    }, 900);
    // addChatMessage and projectId are stable; input changes reset the callback
  }, [input, projectId, addChatMessage, onTriggerAction]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 z-20 flex flex-col bg-card border-t border-border shadow-xl transition-transform duration-200 ease-out",
        open ? "translate-y-0" : "translate-y-full",
      )}
      style={{ minHeight: "280px", maxHeight: "340px" }}
      data-ocid="iterate.chat_panel"
    >
      {/* Header */}
      <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <MessageSquare size={13} className="text-accent" />
          <span className="text-xs-plus uppercase tracking-widest font-semibold text-accent/70">
            Chat
          </span>
          <span className="text-2xs text-muted-foreground/50 italic">
            simulated
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="iterate.chat.close_button"
          aria-label="Close chat"
        >
          <X size={14} />
        </button>
      </div>
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0"
      >
        {messages.length === 0 && !isTyping && (
          <p className="text-xs-plus text-muted-foreground text-center mt-6">
            Ask me anything about this spec…
          </p>
        )}
        {messages.map((msg, i) => (
          <MessageBubble
            key={`${msg.timestamp}-${i}`}
            msg={msg}
            index={i}
            onTriggerAction={onTriggerAction}
          />
        ))}
        {isTyping && <TypingIndicator />}
      </div>
      {/* Input — pinned to bottom */}
      <div className="flex-shrink-0 p-3 border-t border-border/60 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            projectId
              ? "Ask about your spec or mention an action…"
              : "Select a project first"
          }
          disabled={!projectId}
          className="flex-1 text-xs px-3 py-2 rounded-md bg-muted/40 border border-border focus:outline-none focus:ring-1 focus:ring-accent/50 text-foreground placeholder:text-muted-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          data-ocid="iterate.chat.input"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim() || !projectId}
          className="px-3 py-2 rounded-md text-xs font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          data-ocid="iterate.chat.send_button"
        >
          Send
        </button>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface ExtendedChatMessage {
  role: "user" | "ai";
  text: string;
  timestamp: number;
  actionChip?: { actionId: string; label: string };
}

function MessageBubble({
  msg,
  index,
  onTriggerAction,
}: {
  msg: ExtendedChatMessage;
  index: number;
  onTriggerAction: (actionId: string) => void;
}) {
  const [showTime, setShowTime] = useState(false);
  const isUser = msg.role === "user";

  // Verify the action exists in the library
  const actionExists = msg.actionChip
    ? ITERATE_ACTIONS.some((a) => a.id === msg.actionChip?.actionId)
    : false;

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isUser ? "items-end" : "items-start",
      )}
      data-ocid={`iterate.chat.message.${index + 1}`}
    >
      <div
        className={cn(
          "relative text-xs rounded-xl px-3 py-2 max-w-[88%] leading-relaxed cursor-default",
          isUser
            ? "bg-accent text-accent-foreground rounded-br-sm border-r-2 border-accent"
            : "bg-muted text-foreground rounded-bl-sm",
        )}
        onMouseEnter={() => setShowTime(true)}
        onMouseLeave={() => setShowTime(false)}
      >
        {msg.text}
        {showTime && (
          <span
            className={cn(
              "absolute -bottom-4 text-2xs text-muted-foreground whitespace-nowrap",
              isUser ? "right-0" : "left-0",
            )}
          >
            {formatTime(msg.timestamp)}
          </span>
        )}
      </div>
      {/* Action chip */}
      {!isUser && msg.actionChip && actionExists && (
        <button
          type="button"
          onClick={() => onTriggerAction(msg.actionChip!.actionId)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold bg-accent text-accent-foreground transition-opacity hover:opacity-85"
          data-ocid={`iterate.chat.run_action.${msg.actionChip.actionId}`}
        >
          <Play size={9} />
          Run {msg.actionChip.label}
        </button>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start">
      <div className="bg-muted rounded-xl rounded-bl-sm px-3 py-2.5 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
            style={{
              animationDelay: `${i * 150}ms`,
              animationDuration: "900ms",
            }}
          />
        ))}
      </div>
    </div>
  );
}
