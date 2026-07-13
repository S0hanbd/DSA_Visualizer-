import { useState, useEffect } from "react";
import { useParams, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import GraphColoringVisualization from "../components/GraphColoringVisualization.jsx";
import CodeViewer from "../components/CodeViewer.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import { algorithmMap } from "../data/algorithms.js";
import { buildGraphColoringSteps } from "../logic/graphColoringSimulation.js";

// Example graph specifically suited for coloring
const EXAMPLE_GRAPH_COLORING = {
  nodes: [
    { id: "A", x: 250, y: 150 },
    { id: "B", x: 150, y: 250 },
    { id: "C", x: 250, y: 350 },
    { id: "D", x: 350, y: 250 },
    { id: "E", x: 450, y: 150 },
    { id: "F", x: 550, y: 250 },
    { id: "G", x: 450, y: 350 },
  ],
  edges: [
    { source: "A", target: "B" },
    { source: "A", target: "D" },
    { source: "B", target: "C" },
    { source: "C", target: "D" },
    { source: "D", target: "E" },
    { source: "D", target: "G" },
    { source: "E", target: "F" },
    { source: "F", target: "G" },
  ]
};

const EXAMPLE_GRAPH_COLORING_2 = {
  nodes: [
    { id: "A", x: 200, y: 150 },
    { id: "B", x: 500, y: 150 },
    { id: "C", x: 350, y: 250 },
    { id: "D", x: 200, y: 350 },
    { id: "E", x: 500, y: 350 },
  ],
  edges: [
    { source: "C", target: "A" },
    { source: "C", target: "B" },
    { source: "C", target: "D" },
    { source: "C", target: "E" },
  ]
};

const EXAMPLE_GRAPH_COLORING_3 = {
  nodes: [
    { id: "A", x: 350, y: 100 },
    { id: "B", x: 200, y: 350 },
    { id: "C", x: 500, y: 350 },
    { id: "D", x: 350, y: 250 },
  ],
  edges: [
    { source: "A", target: "B" },
    { source: "A", target: "C" },
    { source: "B", target: "C" },
    { source: "A", target: "D" },
    { source: "B", target: "D" },
    { source: "C", target: "D" },
  ]
};

const COLOR_PALETTE = [
  "#94a3b8", // 0 = uncolored (slate)
  "#ef4444", // 1 = red
  "#22c55e", // 2 = green
  "#3b82f6", // 3 = blue
  "#eab308", // 4 = yellow
];

function TabButton({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
        active 
          ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-200 dark:border-slate-700" 
          : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

function ControlsButton({ label, onClick, className = "", disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {label}
    </button>
  );
}

export default function GraphColoringPage() {
  const { slug } = useParams();
  const location = useLocation();
  const rawSlug = slug || location.pathname.split("/").filter(Boolean).pop();
  const algorithm = algorithmMap[rawSlug];

  const [activeTab, setActiveTab] = useState("Build Graph"); // "Build Graph" | "Algorithm"

  // Graph State
  const [nodes, setNodes] = useState(EXAMPLE_GRAPH_COLORING.nodes);
  const [edges, setEdges] = useState(EXAMPLE_GRAPH_COLORING.edges);

  // Builder State
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [isPlacingNode, setIsPlacingNode] = useState(false);

  // Simulation State
  const [numColors, setNumColors] = useState(3);
  const [steps, setSteps] = useState([{ status: "Idle", explanation: "Ready to run algorithm.", markers: {} }]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(640);

  // Generate steps whenever graph or numColors change
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    
    if (nodes.length > 0) {
      const generatedSteps = buildGraphColoringSteps(nodes, edges, numColors);
      setSteps([{ status: "Init", explanation: "Algorithm Ready", markers: {} }, ...generatedSteps]);
    } else {
      setSteps([{ status: "Idle", explanation: "Graph is empty.", markers: {} }]);
    }
  }, [nodes, edges, numColors]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStep((s) => s + 1);
    }, speed);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  if (!algorithm) return <Navigate to="/" replace />;

  const step = steps[currentStep] || steps[0];

  // Build Graph Handlers
  const handleAddRandomNode = (xOverride, yOverride) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const existingIds = nodes.map(n => n.id);
    let newId = "";
    for (let i = 0; i < letters.length; i++) {
      if (!existingIds.includes(letters[i])) {
        newId = letters[i];
        break;
      }
    }
    if (!newId) newId = `N${nodes.length + 1}`;
    
    const x = typeof xOverride === "number" ? xOverride : Math.floor(Math.random() * 600) + 100;
    const y = typeof yOverride === "number" ? yOverride : Math.floor(Math.random() * 400) + 100;
    
    setNodes([...nodes, { id: newId, x, y }]);
  };

  const handleCanvasClick = (pos) => {
    if (activeTab === "Build Graph" && isPlacingNode) {
      handleAddRandomNode(pos.x, pos.y);
      setIsPlacingNode(false);
    }
  };

  const handleNodePositionChange = (nodeId, dx, dy) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, x: n.x + dx, y: n.y + dy } : n));
  };

  const handleAddEdge = () => {
    if (!sourceId || !targetId) return;
    if (!nodes.find(n => n.id === sourceId) || !nodes.find(n => n.id === targetId)) {
        alert("Source or Target node does not exist!");
        return;
    }
    setEdges([...edges, { source: sourceId, target: targetId }]);
    setSourceId("");
    setTargetId("");
  };

  const handleClearGraph = () => {
    setNodes([]);
    setEdges([]);
  };

  return (
    <div className="mx-auto flex w-full gap-6 px-4 py-8">
      <Sidebar />
      <div className="min-w-0 flex-1">
        
        {/* Header */}
        <div className="mb-6">
          <p className="font-bold tracking-widest text-emerald-500 uppercase">{algorithm.category}</p>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mt-2">{algorithm.title}</h1>
          <p className="mt-2 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            {algorithm.description}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          
          {/* Controls Panel */}
          <div className="flex flex-col gap-6 h-full">
            <div className="neo-panel p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl flex flex-col flex-1">
              
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-4">Controls</h2>
              
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg mb-6 border border-slate-200 dark:border-slate-800">
                <TabButton active={activeTab === "Build Graph"} label="Build Graph" onClick={() => setActiveTab("Build Graph")} />
                <TabButton active={activeTab === "Algorithm"} label="Algorithm" onClick={() => setActiveTab("Algorithm")} />
              </div>

              {activeTab === "Build Graph" && (
                <div className="space-y-6 flex-1">
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Example Graphs</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Load a predefined graph</p>
                    <select 
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-semibold outline-none"
                      onChange={(e) => {
                          const val = e.target.value;
                          if (val === "example1") {
                              setNodes(EXAMPLE_GRAPH_COLORING.nodes);
                              setEdges(EXAMPLE_GRAPH_COLORING.edges);
                          } else if (val === "example2") {
                              setNodes(EXAMPLE_GRAPH_COLORING_2.nodes);
                              setEdges(EXAMPLE_GRAPH_COLORING_2.edges);
                          } else if (val === "example3") {
                              setNodes(EXAMPLE_GRAPH_COLORING_3.nodes);
                              setEdges(EXAMPLE_GRAPH_COLORING_3.edges);
                          } else {
                              setNodes([]);
                              setEdges([]);
                          }
                      }}
                    >
                      <option value="example1">Coloring Example 1 (Hexagon)</option>
                      <option value="example2">Coloring Example 2 (Star Graph)</option>
                      <option value="example3">Coloring Example 3 (K4 Complete)</option>
                      <option value="empty">Empty Graph</option>
                    </select>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Manual Build</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Add nodes and edges</p>
                    
                    <ControlsButton 
                      label={isPlacingNode ? "Click Canvas to Place" : "Place a New Node"} 
                      onClick={() => setIsPlacingNode(!isPlacingNode)} 
                      className={`w-full mb-4 ${isPlacingNode ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600"}`}
                    />
                    
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input type="text" placeholder="Source ID" value={sourceId} onChange={e => setSourceId(e.target.value.toUpperCase())} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-semibold" />
                      <input type="text" placeholder="Target ID" value={targetId} onChange={e => setTargetId(e.target.value.toUpperCase())} className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-semibold" />
                    </div>
                    <div className="flex gap-2">
                      <ControlsButton label="Add Edge" onClick={handleAddEdge} className="w-full bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Algorithm" && (
                <div className="space-y-6 flex-1">
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Run Algorithm</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Execute Graph Coloring</p>
                    
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Number of Colors</label>
                        <div className="flex items-center gap-2">
                          {[2, 3, 4].map(c => (
                            <button
                              key={c}
                              onClick={() => { setNumColors(c); setActiveTab("Algorithm"); }}
                              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${numColors === c ? "bg-emerald-500 text-white shadow-md" : "bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400"}`}
                            >
                              {c} Colors
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <ControlsButton label="Play" onClick={() => setIsPlaying(true)} disabled={isPlaying || currentStep >= steps.length - 1} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white" />
                      <ControlsButton label="Pause" onClick={() => setIsPlaying(false)} disabled={!isPlaying} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" />
                      <ControlsButton label="Step" onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))} disabled={isPlaying || currentStep >= steps.length - 1} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" />
                    </div>
                  </div>
                  
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">Speed</span>
                      <span className="text-xs font-black text-slate-400">{1000 - speed}ms</span>
                    </div>
                    <input type="range" min="80" max="900" step="10" value={1000 - speed} onChange={(e) => setSpeed(1000 - Number(e.target.value))} className="w-full accent-emerald-500" />
                  </div>
                  
                  {/* Solutions Snapshots */}
                  {step?.solutions?.length > 0 && (
                    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3">
                        Solutions Found: {step.solutions.length}
                      </h3>
                      <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2">
                        {step.solutions.map((sol, solIdx) => (
                          <div key={solIdx} className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-500 mb-2">Solution {solIdx + 1}</span>
                            <div className="relative w-full aspect-video min-h-[120px]">
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
              )}
            </div>
            
            <ControlsButton 
              label="Clear Graph" 
              onClick={handleClearGraph}
              className="bg-red-500 hover:bg-red-600 text-white shadow-md py-3 text-lg" 
            />
          </div>

          <div className="flex flex-col gap-6 overflow-hidden">
            <GraphColoringVisualization 
              nodes={nodes} 
              edges={edges} 
              step={step} 
              onCanvasClick={handleCanvasClick}
              onNodePositionChange={handleNodePositionChange}
            />
            
            <ExecutionSteps steps={steps} currentStep={currentStep} />
            
            <div className="neo-panel overflow-hidden">
              <CodeViewer code={algorithm.code} activeLine={step?.line} language={algorithm.language} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
