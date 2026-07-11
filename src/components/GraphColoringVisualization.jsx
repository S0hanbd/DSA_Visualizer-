import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GraphColoringVisualization({ nodes, edges, step }) {
  const containerRef = useRef(null);
  
  // Pan and Zoom State (reuse from GraphVisualization if needed, but we can simplify here)
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

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
        className="neo-panel relative h-[500px] w-full overflow-hidden cursor-grab active:cursor-grabbing bg-slate-50 dark:bg-slate-900/50"
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
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, transformOrigin: "0 0", position: 'absolute', inset: 0 }}>
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
                className="absolute flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg transition-colors"
                style={{ zIndex: isChecking ? 10 : 1 }}
              >
                {node.id}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Solutions Snapshots */}
      {step?.solutions?.length > 0 && (
        <div className="neo-panel p-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
            Solutions Found: {step.solutions.length}
          </h3>
          <div className="flex flex-wrap gap-6 max-h-[300px] overflow-y-auto pr-2">
            {step.solutions.map((sol, solIdx) => (
              <div key={solIdx} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
                <span className="text-sm font-bold text-slate-500 mb-2">Solution {solIdx + 1}</span>
                <div className="relative w-32 h-32">
                   {/* Mini graph render */}
                   <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 600">
                      {edges.map((edge, idx) => {
                        const s = nodes.find(n => n.id === edge.source);
                        const t = nodes.find(n => n.id === edge.target);
                        return s && t ? <line key={idx} x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke="#cbd5e1" strokeWidth={4} /> : null;
                      })}
                      {nodes.map((n, i) => (
                        <circle key={i} cx={n.x} cy={n.y} r={30} fill={COLOR_PALETTE[sol[i]]} />
                      ))}
                   </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
