import { useState, useEffect } from "react";
import { useParams, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import GraphColoringVisualization from "../components/GraphColoringVisualization.jsx";
import CodeViewer from "../components/CodeViewer.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import { algorithmMap } from "../data/algorithms.js";
import { buildGraphColoringSteps } from "../logic/graphColoringSimulation.js";

// Example graph specifically suited for coloring
const INITIAL_NODES = [
  { id: "A", x: 400, y: 150 },
  { id: "B", x: 250, y: 250 },
  { id: "C", x: 550, y: 250 },
  { id: "D", x: 400, y: 350 },
];
const INITIAL_EDGES = [
  { source: "A", target: "B" },
  { source: "A", target: "C" },
  { source: "B", target: "C" },
  { source: "B", target: "D" },
  { source: "C", target: "D" },
];

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

  const [activeTab, setActiveTab] = useState("Algorithm"); // "Build Graph" | "Algorithm"

  // Graph State
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);

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
  const handleAddRandomNode = () => {
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
    
    const x = Math.floor(Math.random() * 600) + 100;
    const y = Math.floor(Math.random() * 400) + 100;
    
    setNodes([...nodes, { id: newId, x, y }]);
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
    <div className="mx-auto flex w-full gap-6 px-4 py-8 flex-col lg:flex-row">
      <Sidebar />
      <div className="min-w-0 flex-1 space-y-7">
        
        {/* Header */}
        <section className="neo-panel p-6 mb-8">
          <p className="muted-label">{algorithm.category}</p>
          <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-black sm:text-5xl">{algorithm.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">{algorithm.description}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="neo-panel p-5">
              <h3 className="font-bold text-lg mb-4 dark:text-white">Graph Builder</h3>
              <div className="space-y-4">
                <ControlsButton 
                  label="Add Node" 
                  onClick={handleAddRandomNode}
                  className="w-full bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" 
                />
                
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-bold text-slate-500 mb-2">Connect Nodes</p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Src" value={sourceId} onChange={e => setSourceId(e.target.value.toUpperCase())} className="w-1/2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white" />
                    <input type="text" placeholder="Tgt" value={targetId} onChange={e => setTargetId(e.target.value.toUpperCase())} className="w-1/2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white" />
                  </div>
                  <ControlsButton 
                    label="Add Edge" 
                    onClick={handleAddEdge}
                    className="w-full mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50" 
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                   <ControlsButton 
                      label="Clear Graph" 
                      onClick={handleClearGraph}
                      className="w-full bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50" 
                    />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <GraphColoringVisualization nodes={nodes} edges={edges} step={step} />
            
            {/* Playback Controls & Settings */}
            <div className="neo-panel flex items-center justify-between p-4 flex-wrap gap-4">
              <div className="flex gap-2">
                <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="rounded-lg bg-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                  ⏮
                </button>
                {isPlaying ? (
                  <button onClick={() => setIsPlaying(false)} className="rounded-lg bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-600 shadow-md">
                    ⏸ Pause
                  </button>
                ) : (
                  <button onClick={() => setIsPlaying(true)} disabled={currentStep >= steps.length - 1} className="rounded-lg bg-emerald-500 px-6 py-2 font-bold text-white hover:bg-emerald-600 shadow-md disabled:bg-emerald-500/50">
                    ▶ Play
                  </button>
                )}
                <button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep >= steps.length - 1} className="rounded-lg bg-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                  ⏭
                </button>
                <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="ml-2 rounded-lg bg-slate-200 px-4 py-2 font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                  Reset
                </button>
              </div>

              <div className="flex items-center gap-4 ml-auto flex-wrap">
                <div className="flex items-center gap-3 md:border-r-2 md:pr-4 border-slate-200 dark:border-slate-700">
                  <label className="text-sm font-bold text-slate-500">Speed</label>
                  <input type="range" min="80" max="900" step="10" value={1000 - speed} onChange={(e) => setSpeed(1000 - Number(e.target.value))} className="w-24 accent-emerald-500" />
                </div>
                
                <div className="flex items-center gap-2">
                  {[2, 3, 4].map(c => (
                    <button
                      key={c}
                      onClick={() => setNumColors(c)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${numColors === c ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md scale-105" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"}`}
                    >
                      {c} Colors
                    </button>
                  ))}
                </div>

                <div className="text-sm font-bold text-slate-400 min-w-[90px] text-right ml-4">
                  Step {currentStep + 1} / {steps.length}
                </div>
              </div>
            </div>

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
