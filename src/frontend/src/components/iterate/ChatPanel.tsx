import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { MessageSquare, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatPanelProps {
  projectId: string;
  isOpen: boolean;
  onToggle: () => void;
}

function generateAIResponse(userText: string, projectName: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes("audience") || lower.includes("user")) {
    return `That's a great point about the audience for ${projectName}. Based on your spec, I'd suggest refining the user roles section to be more specific about permissions and access levels.`;
  }
  if (lower.includes("feature") || lower.includes("function")) {
    return `Good thinking on features. For ${projectName}, consider prioritising the core flow first — the nice-to-haves can come in a later iteration. Would you like me to suggest a trimmed feature set?`;
  }
  if (
    lower.includes("design") ||
    lower.includes("look") ||
    lower.includes("ui")
  ) {
    return `The visual direction for ${projectName} is coming together. One suggestion: ensure the colour contrast meets WCAG AA for accessibility, especially if you're targeting a broad audience.`;
  }
  if (
    lower.includes("long") ||
    lower.includes("too much") ||
    lower.includes("complex")
  ) {
    return `I agree — ${projectName} feels like it could be simplified. Let's focus on the single most important user journey and strip away anything that doesn't directly support it.`;
  }
  if (lower.includes("missing") || lower.includes("need")) {
    return `Noted. For ${projectName}, a common gap is the error-handling and empty-state flows. Would you like me to audit the spec for missing edge cases?`;
  }
  return `Thanks for that feedback on ${projectName}. I've noted it in the project context. When you're ready, try running an audit or visual pass to see specific suggestions.`;
}

export function ChatPanel({ projectId, isOpen, onToggle }: ChatPanelProps) {
  const chatMessages = useAppStore((s) => s.chatMessages[projectId] ?? []);
  const addChatMessage = useAppStore((s) => s.addChatMessage);
  const projects = useAppStore((s) => s.projects);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  function handleSend() {
    if (!input.trim() || !project) return;
    const userMsg = input.trim();
    addChatMessage(projectId, {
      role: "user",
      text: userMsg,
      timestamp: Date.now(),
    });
    setInput("");
    setTyping(true);

    setTimeout(
      () => {
        const response = generateAIResponse(userMsg, project.name);
        addChatMessage(projectId, {
          role: "ai",
          text: response,
          timestamp: Date.now(),
        });
        setTyping(false);
      },
      1200 + Math.random() * 800,
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col border-t border-border/60 bg-card transition-all duration-300 ease-out origin-bottom",
        isOpen ? "h-80 opacity-100" : "h-10 opacity-100",
      )}
      data-ocid="iterate.chat_panel"
    >
      {/* Header bar — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between px-4 h-16 flex-shrink-0 w-full text-left hover:bg-muted/40 transition-colors"
        data-ocid="iterate.chat_toggle"
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={13} className="text-accent" />
          <span className="text-xs-plus uppercase tracking-widest font-semibold text-accent/70">
            Chat
          </span>
          {chatMessages.length > 0 && (
            <span className="text-2xs text-muted-foreground">
              {chatMessages.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xs text-muted-foreground/50 italic">
            simulated
          </span>
          {isOpen ? <X size={12} className="text-muted-foreground" /> : null}
        </div>
      </button>

      {/* Messages area */}
      {isOpen && (
        <>
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0"
          >
            {chatMessages.length === 0 && (
              <div className="text-center py-6">
                <MessageSquare
                  size={20}
                  className="mx-auto text-muted-foreground/30 mb-2"
                />
                <p className="text-xs-plus text-muted-foreground">
                  Say something specific about your spec — too long, missing a
                  section, wrong tone.
                </p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div
                key={`${msg.timestamp}-${i}`}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "text-xs rounded-lg px-3 py-2 max-w-4/5 leading-relaxed",
                    msg.role === "user"
                      ? "bg-accent/15 text-foreground"
                      : "bg-muted text-muted-foreground border border-border/40",
                  )}
                  data-ocid={`iterate.chat.message.${i + 1}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="text-xs rounded-lg px-3 py-2 bg-muted text-muted-foreground border border-border/40">
                  <span className="inline-flex gap-1">
                    <span
                      className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="flex-shrink-0 px-4 py-3 border-t border-border/60 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type feedback on your spec…"
              className="flex-1 text-xs px-3 py-2 rounded-md bg-background border border-border focus:outline-none focus:ring-1 focus:ring-accent/50 text-foreground placeholder:text-muted-foreground"
              data-ocid="iterate.chat.input"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-3 py-2 rounded-md text-xs font-medium bg-accent/90 text-accent-fg hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              data-ocid="iterate.chat.send_button"
            >
              <Send size={11} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
