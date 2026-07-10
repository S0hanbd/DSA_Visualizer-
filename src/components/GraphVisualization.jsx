import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function GraphVisualization({ nodes, edges, step, onCanvasClick, onNodePositionChange }) {
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
    // Only pan if it's the canvas background (not clicking a node)
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

  const markers = step?.markers || {};
  const activeNode = markers.activeNode;
  const checkingNode = markers.checkingNode;
  const updatedNode = markers.updatedNode;
  const path = markers.path || [];
  const mstEdges = markers.mstEdges || [];
  const visibleEdges = markers.visibleEdges || [];
  const visited = new Set(markers.visited || []);
  const activeEdge = markers.activeEdge; // { source, target }
  const hideUnused = markers.hideUnused || false;

  // Check if an edge is part of the final path or MST
  const isPathEdge = (source, target) => {
    if (path && path.length >= 2) {
      for (let i = 0; i < path.length - 1; i++) {
        if ((path[i] === source && path[i + 1] === target) ||
            (path[i] === target && path[i + 1] === source)) {
          return true;
        }
      }
    }
    if (mstEdges && mstEdges.length > 0) {
      for (let edge of mstEdges) {
        if ((edge.source === source && edge.target === target) ||
            (edge.source === target && edge.target === source)) {
          return true;
        }
      }
    }
    return false;
  };

  // Check if an edge is currently being evaluated
  const isCheckingEdge = (source, target) => {
    if (!activeEdge) return false;
    return (activeEdge.source === source && activeEdge.target === target) ||
           (activeEdge.source === target && activeEdge.target === source);
  };

  const isVisibleEdge = (source, target) => {
    if (visibleEdges.length > 0) {
      for (let edge of visibleEdges) {
        if ((edge.source === source && edge.target === target) ||
            (edge.source === target && edge.target === source)) {
          return true;
        }
      }
    }
    return false;
  };

  const visibleNodes = new Set();
  if (hideUnused) {
    if (markers.visibleNodes) {
      markers.visibleNodes.forEach(n => visibleNodes.add(n));
    } else {
      edges.forEach(edge => {
        if (isPathEdge(edge.source, edge.target) || isCheckingEdge(edge.source, edge.target) || isVisibleEdge(edge.source, edge.target)) {
          visibleNodes.add(edge.source);
          visibleNodes.add(edge.target);
        }
      });
    }
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-[600px] relative overflow-hidden bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg width="100%" height="100%">
        {/* Dotted Background Pattern */}
        <defs>
          <pattern id="dotted-pattern" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform={`translate(${pan.x % 20}, ${pan.y % 20}) scale(${scale})`}>
            <circle cx="10" cy="10" r="1" className="fill-slate-300 dark:fill-slate-700" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotted-pattern)" />

        {/* Graph Content */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
          
          {/* Edges */}
          {edges.map((edge, idx) => {
            const srcNode = nodes.find(n => n.id === edge.source);
            const tgtNode = nodes.find(n => n.id === edge.target);
            if (!srcNode || !tgtNode) return null;

            const inPath = isPathEdge(edge.source, edge.target);
            const isChecking = isCheckingEdge(edge.source, edge.target);
            const isVisible = isVisibleEdge(edge.source, edge.target);
            
            if (hideUnused && !inPath && !isChecking && !isVisible) return null;

            const strokeColor = inPath 
              ? "rgb(16, 185, 129)" // Emerald-500
              : isChecking 
                ? "rgb(59, 130, 246)" // Blue-500
                : "rgba(148, 163, 184, 0.4)"; // Slate-400 transparent

            const strokeWidth = inPath || isChecking ? 4 : 2;

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={srcNode.x}
                  y1={srcNode.y}
                  x2={tgtNode.x}
                  y2={tgtNode.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className="transition-colors duration-300"
                />
                <rect
                  x={(srcNode.x + tgtNode.x) / 2 - 12}
                  y={(srcNode.y + tgtNode.y) / 2 - 10}
                  width="24"
                  height="20"
                  rx="4"
                  className={`fill-white dark:fill-slate-900 border ${
                    inPath ? "border-emerald-500" : isChecking ? "border-blue-500" : "border-slate-300 dark:border-slate-700"
                  }`}
                />
                <text
                  x={(srcNode.x + tgtNode.x) / 2}
                  y={(srcNode.y + tgtNode.y) / 2 + 4}
                  textAnchor="middle"
                  className={`text-[10px] font-bold ${
                    inPath ? "fill-emerald-600 dark:fill-emerald-400" : isChecking ? "fill-blue-600 dark:fill-blue-400" : "fill-slate-600 dark:fill-slate-400"
                  }`}
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            if (hideUnused && !visibleNodes.has(node.id)) return null;

            let bgColor = "fill-blue-500";
            if (path.includes(node.id)) bgColor = "fill-emerald-500";
            else if (activeNode === node.id) bgColor = "fill-amber-500";
            else if (checkingNode === node.id || updatedNode === node.id) bgColor = "fill-purple-500";
            else if (visited.has(node.id)) bgColor = "fill-blue-600";
            else bgColor = "fill-slate-400 dark:fill-slate-600";

            return (
              <motion.g 
                key={node.id}
                initial={false}
                animate={{ x: node.x, y: node.y }}
                transition={draggingNodeId === node.id ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 25 }}
                onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                className={draggingNodeId === node.id ? "cursor-grabbing" : "cursor-grab"}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={22}
                  className={`${bgColor} stroke-2 stroke-white dark:stroke-slate-900 shadow-lg transition-colors duration-300`}
                />
                <text
                  x={0}
                  y={4}
                  textAnchor="middle"
                  className="fill-white font-black text-sm pointer-events-none"
                >
                  {node.id}
                </text>
                
                {/* Distance Label below node */}
                {markers.distances && (
                  <text
                    x={0}
                    y={36}
                    textAnchor="middle"
                    className="fill-slate-600 dark:fill-slate-400 text-[11px] font-bold"
                  >
                    {markers.distances[node.id] === Infinity ? "∞" : markers.distances[node.id]}
                  </text>
                )}
              </motion.g>
            );
          })}

        </g>
      </svg>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 right-4 flex gap-2">
         <button 
           onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(3, s + 0.2)); }}
           className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/90 dark:bg-slate-800/90 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
         >
           +
         </button>
         <button 
           onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(0.2, s - 0.2)); }}
           className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/90 dark:bg-slate-800/90 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
         >
           -
         </button>
         <button 
           onClick={(e) => { e.stopPropagation(); setScale(1); setPan({x:0, y:0}); }}
           className="px-3 h-8 flex items-center justify-center rounded-lg bg-white/90 dark:bg-slate-800/90 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-xs font-bold"
         >
           Reset
         </button>
      </div>
    </div>
  );
}
