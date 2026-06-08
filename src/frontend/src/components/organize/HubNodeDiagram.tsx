import { useAppStore } from "@/store/useAppStore";
import type { Hub, HubConnection, HubNode } from "@/types";
import { ArrowLeft, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface HubNodeDiagramProps {
  hub: Hub;
  onBack: () => void;
}

const NODE_RADIUS = 28;
const SVG_WIDTH = 800;
const SVG_HEIGHT = 500;

function generateInitialNodes(projectIds: string[]): HubNode[] {
  const count = projectIds.length;
  if (count === 0) return [];
  const centerX = SVG_WIDTH / 2;
  const centerY = SVG_HEIGHT / 2;
  const radius = Math.min(SVG_WIDTH, SVG_HEIGHT) * 0.32;
  return projectIds.map((pid, i) => {
    const angle = (2 * Math.PI * i) / Math.max(count, 1) - Math.PI / 2;
    return {
      projectId: pid,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
}

export function HubNodeDiagram({ hub, onBack }: HubNodeDiagramProps) {
  const projects = useAppStore((s) => s.projects);
  const updateHub = useAppStore((s) => s.updateHub);
  const setActiveProject = useAppStore((s) => s.setActiveProject);
  const setMode = useAppStore((s) => s.setMode);
  const hubNodePositions = useAppStore((s) => s.hubNodePositions);
  const setHubNodePosition = useAppStore((s) => s.setHubNodePosition);

  const [nodes, setNodes] = useState<HubNode[]>(() => {
    const stored = hubNodePositions[hub.id];
    if (stored && hub.projectIds.length > 0) {
      return hub.projectIds.map((pid) => {
        const pos = stored[pid];
        if (pos) return { projectId: pid, x: pos.x, y: pos.y };
        // fallback auto-layout for nodes without stored position
        const idx = hub.projectIds.indexOf(pid);
        const centerX = SVG_WIDTH / 2;
        const centerY = SVG_HEIGHT / 2;
        const radius = Math.min(SVG_WIDTH, SVG_HEIGHT) * 0.32;
        const angle =
          (2 * Math.PI * idx) / Math.max(hub.projectIds.length, 1) -
          Math.PI / 2;
        return {
          projectId: pid,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      });
    }
    return hub.nodes.length > 0
      ? hub.nodes
      : generateInitialNodes(hub.projectIds);
  });
  const [connections, setConnections] = useState<HubConnection[]>(
    hub.connections,
  );

  // Drag state — kept local to avoid expensive store writes on every move
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [draggingPos, setDraggingPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  // Track mouse-down origin to distinguish drag from click (>4px threshold)
  const dragOriginRef = useRef<{ x: number; y: number } | null>(null);
  const didDragRef = useRef(false);

  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showAddMenu, setShowAddMenu] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Sync nodes when hub.projectIds changes — only add/remove, never reset saved positions
  useEffect(() => {
    setNodes((prev) => {
      const existingIds = new Set(prev.map((n) => n.projectId));
      const newIds = hub.projectIds.filter((id) => !existingIds.has(id));
      let updated = prev.filter((n) => hub.projectIds.includes(n.projectId));
      if (newIds.length > 0) {
        const centerX = SVG_WIDTH / 2;
        const centerY = SVG_HEIGHT / 2;
        const radius = Math.min(SVG_WIDTH, SVG_HEIGHT) * 0.32;
        const startAngle = Math.random() * 2 * Math.PI;
        const addedNodes = newIds.map((pid, i) => {
          const angle = startAngle + (i * Math.PI) / 3;
          return {
            projectId: pid,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
          };
        });
        updated = [...updated, ...addedNodes];
      }
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hub.projectIds]);

  const getSVGCoords = useCallback((e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * SVG_WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * SVG_HEIGHT,
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, projectId: string) => {
      // When connecting mode is active, handle connect on mousedown
      if (connectingFrom) {
        if (connectingFrom !== projectId) {
          const exists = connections.some(
            (c) =>
              (c.from === connectingFrom && c.to === projectId) ||
              (c.from === projectId && c.to === connectingFrom),
          );
          if (!exists) {
            setConnections((prev) => [
              ...prev,
              { from: connectingFrom, to: projectId },
            ]);
          }
        }
        setConnectingFrom(null);
        return;
      }
      // Begin potential drag — record origin for threshold check
      const coords = getSVGCoords(e);
      dragOriginRef.current = coords;
      didDragRef.current = false;
      setDraggingId(projectId);
      setDraggingPos(coords);
    },
    [connectingFrom, connections, getSVGCoords],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const coords = getSVGCoords(e);
      setMousePos(coords);

      if (draggingId && dragOriginRef.current) {
        const dx = coords.x - dragOriginRef.current.x;
        const dy = coords.y - dragOriginRef.current.y;
        // Mark as a real drag once threshold exceeded
        if (!didDragRef.current && Math.hypot(dx, dy) > 4) {
          didDragRef.current = true;
        }
        if (didDragRef.current) {
          // Update live drag position only in local state — NOT the store
          setDraggingPos(coords);
        }
      }
    },
    [draggingId, getSVGCoords],
  );

  const handleMouseUp = useCallback(() => {
    if (draggingId && didDragRef.current && draggingPos) {
      // Flush final position into nodes state and persist to store
      setNodes((prev) => {
        const updated = prev.map((n) =>
          n.projectId === draggingId
            ? { ...n, x: draggingPos.x, y: draggingPos.y }
            : n,
        );
        return updated;
      });
      setHubNodePosition(hub.id, draggingId, {
        x: draggingPos.x,
        y: draggingPos.y,
      });
    }
    dragOriginRef.current = null;
    didDragRef.current = false;
    setDraggingId(null);
    setDraggingPos(null);
  }, [draggingId, draggingPos, hub.id, setHubNodePosition]);

  // Persist connections to the hub object (node positions live in hubNodePositions)
  const persistLayout = useCallback(
    (latestNodes: HubNode[], latestConnections: HubConnection[]) => {
      updateHub({ ...hub, nodes: latestNodes, connections: latestConnections });
    },
    [hub, updateHub],
  );

  // Persist connections changes to the hub object (node positions live in hubNodePositions)
  const prevConnectionsRef = useRef(connections);

  useEffect(() => {
    if (prevConnectionsRef.current !== connections) {
      prevConnectionsRef.current = connections;
      persistLayout(nodes, connections);
    }
  }, [connections, nodes, persistLayout]);

  const handleNodeClick = useCallback(
    (projectId: string) => {
      // If a drag occurred, swallow the click
      if (didDragRef.current) return;
      if (connectingFrom) {
        if (connectingFrom !== projectId) {
          const exists = connections.some(
            (c) =>
              (c.from === connectingFrom && c.to === projectId) ||
              (c.from === projectId && c.to === connectingFrom),
          );
          if (!exists) {
            setConnections((prev) => [
              ...prev,
              { from: connectingFrom, to: projectId },
            ]);
          }
        }
        setConnectingFrom(null);
        return;
      }
      // Open project detail
      setActiveProject(projectId);
      setMode("organize");
    },
    [connectingFrom, connections, setActiveProject, setMode],
  );

  const handleNodeDoubleClick = useCallback(
    (projectId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (didDragRef.current) return; // don't start connect mode after drag
      setConnectingFrom(projectId);
    },
    [],
  );

  function handleAddProject(projectId: string) {
    if (!hub.projectIds.includes(projectId)) {
      updateHub({ ...hub, projectIds: [...hub.projectIds, projectId] });
    }
    setShowAddMenu(false);
  }

  function handleRemoveProject(projectId: string) {
    updateHub({
      ...hub,
      projectIds: hub.projectIds.filter((id) => id !== projectId),
    });
    setConnections((prev) =>
      prev.filter((c) => c.from !== projectId && c.to !== projectId),
    );
  }

  const availableProjects = projects.filter(
    (p) => !hub.projectIds.includes(p.id),
  );

  return (
    <div
      className="flex flex-col h-full min-h-0"
      data-ocid="organize.hub_diagram"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="organize.hub_diagram.back_button"
          >
            <ArrowLeft size={14} />
          </button>
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: hub.color }}
          />
          <span className="text-sm font-semibold text-foreground">
            {hub.name}
          </span>
          <span className="text-2xs text-muted-foreground">
            {hub.projectIds.length} project
            {hub.projectIds.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {connectingFrom && (
            <span className="text-xs-plus text-accent animate-pulse">
              Click another node to connect
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowAddMenu((v) => !v)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs-plus font-medium border border-border hover:border-foreground/30 transition-colors"
            data-ocid="organize.hub_diagram.add_project_button"
          >
            <Plus size={11} />
            Add project
          </button>
        </div>
      </div>

      {/* Add project menu */}
      {showAddMenu && (
        <div className="absolute right-4 top-12 z-30 w-56 rounded-lg border border-border bg-card shadow-elevated py-1">
          <div className="px-3 py-1.5 border-b border-border/40">
            <span className="text-2xs uppercase tracking-widest text-muted-foreground font-medium">
              Add to hub
            </span>
          </div>
          {availableProjects.length === 0 ? (
            <p className="px-3 py-3 text-xs-plus text-muted-foreground text-center">
              All projects are in this hub
            </p>
          ) : (
            availableProjects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleAddProject(p.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted transition-colors"
                data-ocid={`organize.hub_diagram.add_option.${p.id}`}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-2xs text-accent-foreground font-bold flex-shrink-0"
                  style={{ backgroundColor: p.iconColor }}
                >
                  {p.name.charAt(0)}
                </span>
                <span className="text-xs-plus text-foreground truncate">
                  {p.name}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {/* SVG Diagram */}
      <div className="flex-1 min-h-0 overflow-hidden bg-muted/20 relative">
        <svg
          ref={svgRef}
          role="img"
          aria-label="Hub node diagram"
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full select-none"
          style={{ cursor: draggingId ? "grabbing" : "default" }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={() => {
            setConnectingFrom(null);
            setShowAddMenu(false);
          }}
          onKeyDown={() => {}}
        >
          {/* Arrowhead marker */}
          <defs>
            <marker
              id={`arrow-${hub.id}`}
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L8,3 z" fill={hub.color} fillOpacity={0.55} />
            </marker>
          </defs>

          {/* Connection lines — use live draggingPos for endpoints when a node is being dragged */}
          {connections.map((conn) => {
            const fromNode = nodes.find((n) => n.projectId === conn.from);
            const toNode = nodes.find((n) => n.projectId === conn.to);
            if (!fromNode || !toNode) return null;
            // If one endpoint is currently being dragged, use the live position
            const x1 =
              draggingId === conn.from && draggingPos
                ? draggingPos.x
                : fromNode.x;
            const y1 =
              draggingId === conn.from && draggingPos
                ? draggingPos.y
                : fromNode.y;
            const x2 =
              draggingId === conn.to && draggingPos ? draggingPos.x : toNode.x;
            const y2 =
              draggingId === conn.to && draggingPos ? draggingPos.y : toNode.y;
            return (
              <line
                key={`${conn.from}-${conn.to}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={hub.color}
                strokeWidth={1.5}
                strokeOpacity={0.6}
                markerEnd={`url(#arrow-${hub.id})`}
              />
            );
          })}

          {/* Active connection line while dragging */}
          {connectingFrom &&
            (() => {
              const fromNode = nodes.find(
                (n) => n.projectId === connectingFrom,
              );
              if (!fromNode) return null;
              return (
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={mousePos.x}
                  y2={mousePos.y}
                  stroke={hub.color}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  strokeOpacity={0.7}
                />
              );
            })()}

          {/* Nodes — use live draggingPos for the dragged node's transform */}
          {nodes.map((node) => {
            const project = projects.find((p) => p.id === node.projectId);
            if (!project) return null;
            const isConnecting = connectingFrom === node.projectId;
            const isBeingDragged =
              draggingId === node.projectId && didDragRef.current;
            // Live position: use draggingPos while actively dragging this node
            const liveX =
              isBeingDragged && draggingPos ? draggingPos.x : node.x;
            const liveY =
              isBeingDragged && draggingPos ? draggingPos.y : node.y;

            return (
              <g
                key={node.projectId}
                transform={`translate(${liveX}, ${liveY})${isBeingDragged ? " scale(1.05)" : ""}`}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(
                    e as unknown as React.MouseEvent,
                    node.projectId,
                  );
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNodeClick(node.projectId);
                }}
                onDoubleClick={(e) =>
                  handleNodeDoubleClick(
                    node.projectId,
                    e as unknown as React.MouseEvent,
                  )
                }
                onKeyDown={() => {}}
                style={{
                  cursor: isBeingDragged
                    ? "grabbing"
                    : isConnecting
                      ? "crosshair"
                      : "grab",
                  // Disable CSS transitions on the dragged node to keep movement instant
                  transition: isBeingDragged ? "none" : "transform 0.15s ease",
                }}
                data-ocid={`organize.hub_diagram.node.${node.projectId}`}
              >
                {/* Outer ring */}
                <circle
                  r={NODE_RADIUS + 3}
                  fill="none"
                  stroke={
                    isConnecting
                      ? hub.color
                      : isBeingDragged
                        ? hub.color
                        : "transparent"
                  }
                  strokeWidth={2}
                  strokeOpacity={isBeingDragged ? 0.5 : 0.8}
                />
                {/* Drop shadow filter for dragged node */}
                {isBeingDragged && (
                  <circle
                    r={NODE_RADIUS + 2}
                    fill="black"
                    fillOpacity={0.18}
                    transform="translate(2, 3)"
                  />
                )}
                {/* Main circle */}
                <circle
                  r={NODE_RADIUS}
                  fill={project.iconColor}
                  stroke={hub.color}
                  strokeWidth={isBeingDragged ? 2.5 : 1.5}
                  strokeOpacity={isBeingDragged ? 0.7 : 0.3}
                />
                {/* Initial */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={14}
                  fontWeight={600}
                  fontFamily="var(--font-body)"
                >
                  {project.name.charAt(0)}
                </text>
                {/* Label below */}
                <text
                  y={NODE_RADIUS + 16}
                  textAnchor="middle"
                  fill="var(--color-text)"
                  fontSize={10}
                  fontFamily="var(--font-body)"
                  opacity={0.85}
                >
                  {project.name.length > 14
                    ? `${project.name.slice(0, 12)}...`
                    : project.name}
                </text>
                {/* Remove button */}
                <g
                  transform={`translate(${NODE_RADIUS - 4}, ${-NODE_RADIUS + 4})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveProject(node.projectId);
                  }}
                  onKeyDown={() => {}}
                  style={{ cursor: "pointer" }}
                  data-ocid={`organize.hub_diagram.remove_node.${node.projectId}`}
                >
                  <circle
                    r={7}
                    fill="var(--color-surface)"
                    stroke="var(--color-border)"
                    strokeWidth={1}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--color-text-muted)"
                    fontSize={8}
                  >
                    ×
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Hint */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">
              No projects in this hub yet.
              <br />
              <span className="text-xs-plus">
                Click "Add project" to get started.
              </span>
            </p>
          </div>
        )}

        <div className="absolute bottom-3 left-3 text-2xs text-muted-foreground/60">
          Drag to move · Double-click to connect · Click to open
        </div>
      </div>
    </div>
  );
}
