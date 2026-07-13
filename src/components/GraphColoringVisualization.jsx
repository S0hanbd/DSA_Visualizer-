import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GraphColoringVisualization({ nodes, edges, step, onCanvasClick, onNodePositionChange }) {
  const containerRef = useRef(null);
  
  // Pan and Zoom State
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    setScale((prevScale) => Math.min(Math.max(0.2, prevScale + delta), 3));
  };

  const handlePointerDown = (e) => {
    if (e.target.tagName !== "svg" && e.target.tagName !== "rect") return;
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!isDragging && !draggingNodeId) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    if (draggingNodeId) {
      if (onNodePositionChange) {
        onNodePositionChange(draggingNodeId, dx / scale, dy / scale);
      }
    } else {
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        setHasMoved(true);
      }
    }
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e) => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
      return;
    }
    if (isDragging && !hasMoved && onCanvasClick && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const svgX = (e.clientX - rect.left - pan.x) / scale;
        const svgY = (e.clientY - rect.top - pan.y) / scale;
        onCanvasClick({ x: svgX, y: svgY });
    }
    setIsDragging(false);
  };

  const handleNodePointerDown = (e, nodeId) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }
  }, []);

  const COLOR_PALETTE = [
    "#94a3b8", // 0 = uncolored (slate)
    "#ef4444", // 1 = red
    "#22c55e", // 2 = green
    "#3b82f6", // 3 = blue
    "#eab308", // 4 = yellow
  ];

  return (
    <div className="flex flex-col gap-6">
      <div 
        ref={containerRef}
        className="neo-panel relative h-[500px] w-full overflow-hidden bg-slate-50 dark:bg-slate-900/50"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ cursor: isDragging ? "grabbing" : draggingNodeId ? "grabbing" : "grab" }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, transformOrigin: "0 0" }}
        >
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>
          
          {/* Edges */}
          {edges.map((edge, idx) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            // Highlight attacking edges
            let isAttacking = false;
            if (step?.markers?.attacking) {
                const [attackingIdx] = step.markers.attacking;
                const checkingIdx = step.markers.checking ? step.markers.checking[0] : -1;
                const aId = nodes[attackingIdx]?.id;
                const cId = nodes[checkingIdx]?.id;
                if ((edge.source === aId && edge.target === cId) || (edge.source === cId && edge.target === aId)) {
                    isAttacking = true;
                }
            }

            return (
              <g key={idx}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isAttacking ? "#ef4444" : "#cbd5e1"}
                  strokeWidth={isAttacking ? 4 : 2}
                  className="transition-colors duration-300 dark:stroke-slate-700"
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes (HTML for framer-motion layout) */}
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, transformOrigin: "0 0", position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {nodes.map((node, i) => {
            const colorCode = step?.color ? step.color[i] : 0;
            const nodeColor = COLOR_PALETTE[colorCode];
            
            let isChecking = step?.markers?.checking && step.markers.checking[0] === i;
            let isAttacking = step?.markers?.attacking && step.markers.attacking[0] === i;
            let isColored = step?.markers?.colored && step.markers.colored[0] === i;
            let isBacktracking = step?.markers?.backtracking && step.markers.backtracking[0] === i;

            return (
              <motion.div
                key={node.id}
                initial={false}
                animate={{
                  x: node.x - 24,
                  y: node.y - 24,
                  scale: isChecking || isAttacking || isColored || isBacktracking ? 1.2 : 1,
                  backgroundColor: nodeColor,
                  borderColor: isChecking ? "#3b82f6" : isAttacking ? "#ef4444" : isColored ? "#10b981" : "#ffffff",
                  borderWidth: isChecking || isAttacking || isColored ? 4 : 2,
                }}
                onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                className="absolute flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg transition-colors cursor-grab active:cursor-grabbing"
                style={{ zIndex: isChecking ? 10 : 1, pointerEvents: 'auto' }}
              >
                {node.id}
              </motion.div>
            );
          })}
        </div>
        
        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
            +
          </button>
          <button onClick={() => setScale(s => Math.max(s - 0.2, 0.2))} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
            -
          </button>
          <button onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }} className="flex h-8 px-3 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
