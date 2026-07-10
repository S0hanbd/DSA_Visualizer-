import { motion } from "framer-motion";

export default function TreeVisualization({ tree, markers, type }) {
  // We need to render the edges (lines) first so they are behind the nodes.
  const edges = [];
  const nodes = [];

  const traverse = (node) => {
    if (!node) return;
    nodes.push(node);
    if (node.left) {
      edges.push({ source: node, target: node.left });
      traverse(node.left);
    }
    if (node.right) {
      edges.push({ source: node, target: node.right });
      traverse(node.right);
    }
  };

  traverse(tree);

  // Find bounding box to center the tree
  let minX = 0, maxX = 0, maxY = 0;
  nodes.forEach(n => {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y > maxY) maxY = n.y;
  });

  const width = Math.max(600, maxX - minX + 200);
  const height = Math.max(400, maxY + 150);
  
  // Offset to center the root which is at x=0
  const offsetX = width / 2;
  const offsetY = 50;

  return (
    <div className="relative w-full h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-auto custom-scrollbar shadow-sm">
      {/* Dotted background pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" className="fill-slate-300 dark:fill-slate-700" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>

      <div className="relative" style={{ width, height, minWidth: "100%", minHeight: "100%" }}>
        {/* EDGES */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
          {edges.map((edge, i) => {
            const sx = edge.source.x + offsetX;
            const sy = edge.source.y + offsetY;
            const tx = edge.target.x + offsetX;
            const ty = edge.target.y + offsetY;
            // Bezier curve for edges
            const path = `M ${sx} ${sy + 20} C ${sx} ${sy + 40}, ${tx} ${ty - 40}, ${tx} ${ty - 20}`;
            return (
              <motion.path
                key={`${edge.source.id}-${edge.target.id}`}
                d={path}
                fill="none"
                strokeWidth="2"
                className="stroke-slate-400 dark:stroke-slate-600"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            );
          })}
        </svg>

        {/* NODES */}
        {nodes.map(node => {
          const isComparing = markers?.comparing?.includes(node.id);
          const isSwapping = markers?.swapping?.includes(node.id);
          const isInserted = markers?.inserted === node.id;
          const isActive = markers?.active === node.id;
          
          let bgColor = "bg-slate-700 dark:bg-slate-600"; // Default dark circle
          if (isActive || isComparing) bgColor = "bg-blue-600";
          if (isSwapping) bgColor = "bg-amber-600";
          if (isInserted) bgColor = "bg-emerald-600";

          return (
            <motion.div
              key={node.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: node.x + offsetX - 24, y: node.y + offsetY - 24 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md z-10 ${bgColor}`}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              {node.val}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
