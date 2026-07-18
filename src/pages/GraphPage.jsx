import { useState, useEffect } from "react";
import { useParams, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import GraphVisualization from "../components/GraphVisualization.jsx";
import CodeViewer from "../components/CodeViewer.jsx";
import ComplexityCard from "../components/ComplexityCard.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import { algorithmMap } from "../data/algorithms.js";
import { EXAMPLE_GRAPH, EXAMPLE_GRAPH_2, EXAMPLE_GRAPH_3, EXAMPLE_GRAPH_4, buildDijkstraSteps, buildBfsSteps, buildDfsSteps, buildPrimSteps, buildKruskalSteps } from "../logic/graphInteractive.js";

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

export default function GraphPage() {
  const { slug } = useParams();
  const location = useLocation();
  const rawSlug = slug || location.pathname.split("/").filter(Boolean).pop();
  const algorithm = algorithmMap[rawSlug];

  const [activeTab, setActiveTab] = useState("Algorithm"); // "Build Graph" | "Algorithm"
  
  // Graph State
  const [nodes, setNodes] = useState(EXAMPLE_GRAPH.nodes);
  const [edges, setEdges] = useState(EXAMPLE_GRAPH.edges);
  
  // Builder State
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [weight, setWeight] = useState("");
  const [isPlacingNode, setIsPlacingNode] = useState(false);

  // Algorithm State
  const [startNode, setStartNode] = useState("A");
  const [endNode, setEndNode] = useState("F");
  const [steps, setSteps] = useState([{ status: "Idle", explanation: "Ready to run algorithm.", markers: {} }]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStep(s => s + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  if (!algorithm) return <Navigate to="/" replace />;

  const handleRunAlgorithm = () => {
    let newSteps = [];
    if (rawSlug === "dijkstra") {
      if (!startNode || !endNode) return;
      newSteps = buildDijkstraSteps(nodes, edges, startNode, endNode);
    } else if (rawSlug === "bfs") {
      if (!startNode || !endNode) return;
      newSteps = buildBfsSteps(nodes, edges, startNode, endNode);
    } else if (rawSlug === "dfs") {
      if (!startNode || !endNode) return;
      newSteps = buildDfsSteps(nodes, edges, startNode, endNode);
    } else if (rawSlug === "prim") {
      if (!startNode) return;
      newSteps = buildPrimSteps(nodes, edges, startNode);
    } else if (rawSlug === "kruskal") {
      newSteps = buildKruskalSteps(nodes, edges);
    }
    
    setSteps([{ status: "Init", explanation: "Algorithm Ready", markers: {} }, ...newSteps]);
    setCurrentStep(0);
    setIsPlaying(true);
  };

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
    if (!sourceId || !targetId || !weight) return;
    if (!nodes.find(n => n.id === sourceId) || !nodes.find(n => n.id === targetId)) {
        alert("Source or Target node does not exist!");
        return;
    }
    setEdges([...edges, { source: sourceId, target: targetId, weight: parseInt(weight, 10) }]);
    setSourceId("");
    setTargetId("");
    setWeight("");
  };

  const handleClearGraph = () => {
    setNodes([]);
    setEdges([]);
    setSteps([{ status: "Idle", explanation: "Graph cleared.", markers: {} }]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const activeStepObj = steps[currentStep] || steps[0];

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
                          let selectedGraph = null;
                          if (val === "example1") selectedGraph = EXAMPLE_GRAPH;
                          if (val === "example2") selectedGraph = EXAMPLE_GRAPH_2;
                          if (val === "example3") selectedGraph = EXAMPLE_GRAPH_3;
                          if (val === "example4") selectedGraph = EXAMPLE_GRAPH_4;
                          
                          if (selectedGraph) {
                              setNodes(selectedGraph.nodes);
                              setEdges(selectedGraph.edges);
                              setSteps([{ status: "Idle", explanation: "Loaded example graph.", markers: {} }]);
                              setCurrentStep(0);
                          }
                      }}
                    >
                      <option value="example1">Example Graph 1</option>
                      <option value="example2">Example Graph 2</option>
                      <option value="example3">Example Graph 3</option>
                      <option value="example4">Large Complex Graph</option>
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
                      <input type="text" placeholder="Source node ID" value={sourceId} onChange={e => setSourceId(e.target.value.toUpperCase())} className="capsule-input w-full" />
                      <input type="text" placeholder="Target node ID" value={targetId} onChange={e => setTargetId(e.target.value.toUpperCase())} className="capsule-input w-full" />
                    </div>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Edge weight" value={weight} onChange={e => setWeight(e.target.value)} className="flex-1 capsule-input" />
                      <ControlsButton label="Add Edge" onClick={handleAddEdge} className="bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Algorithm" && (
                <div className="space-y-6 flex-1">
                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Run Algorithm</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Execute the graph algorithm</p>
                    
                    {(rawSlug !== "kruskal") && (
                      <div className={`grid ${["prim"].includes(rawSlug) ? "grid-cols-1" : "grid-cols-2"} gap-4 mb-4`}>
                        <div>
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">Start Node</label>
                          <input type="text" value={startNode} onChange={e => setStartNode(e.target.value.toUpperCase())} className="w-full capsule-input" />
                        </div>
                        {!["prim"].includes(rawSlug) && (
                          <div>
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">End Node</label>
                            <input type="text" value={endNode} onChange={e => setEndNode(e.target.value.toUpperCase())} className="w-full capsule-input" />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <ControlsButton 
                      label={`Run ${algorithm.title}`} 
                      onClick={handleRunAlgorithm} 
                      className="w-full bg-slate-900 hover:bg-slate-950 text-white dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white mb-3" 
                    />

                    <div className="grid grid-cols-3 gap-2">
                        <ControlsButton 
                          label="Previous" 
                          onClick={() => { setIsPlaying(false); setCurrentStep(s => Math.max(0, s - 1)); }} 
                          disabled={currentStep === 0}
                          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50" 
                        />
                        <ControlsButton 
                          label={isPlaying ? "⏸" : "▶"} 
                          onClick={() => setIsPlaying(!isPlaying)} 
                          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50" 
                        />
                        <ControlsButton 
                          label="Next" 
                          onClick={() => { setIsPlaying(false); setCurrentStep(s => Math.min(steps.length - 1, s + 1)); }} 
                          disabled={currentStep === steps.length - 1}
                          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50" 
                        />
                    </div>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Current Path</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Path details and distance</p>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Path:</span>
                      <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                         {activeStepObj.markers?.path ? activeStepObj.markers.path.join(" → ") : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Total Distance:</span>
                      <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {activeStepObj.markers?.distances && endNode && activeStepObj.markers.distances[endNode] !== undefined && activeStepObj.markers.distances[endNode] !== Infinity ? activeStepObj.markers.distances[endNode] : "-"}
                      </span>
                    </div>
                  </div>

                  {rawSlug === "dijkstra" && activeStepObj.markers?.distances && (
                    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 overflow-x-auto">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Dijkstra State</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Current distances and parents</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <table className="w-full text-xs text-left">
                            <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                              <tr>
                                <th className="pb-1">Node</th>
                                <th className="pb-1 text-right">Distance</th>
                              </tr>
                            </thead>
                            <tbody className="font-mono">
                              {Object.entries(activeStepObj.markers.distances).map(([nodeId, dist]) => (
                                <tr key={`dist-${nodeId}`} className="border-b border-slate-200 dark:border-slate-800/50">
                                  <td className="py-1 font-bold text-slate-700 dark:text-slate-300">{nodeId}</td>
                                  <td className="py-1 text-right text-emerald-600 dark:text-emerald-400">
                                    {dist === Infinity ? "∞" : dist}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div>
                          <table className="w-full text-xs text-left">
                            <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                              <tr>
                                <th className="pb-1">Node</th>
                                <th className="pb-1 text-right">Parent</th>
                              </tr>
                            </thead>
                            <tbody className="font-mono">
                              {Object.entries(activeStepObj.markers.parents || {}).map(([nodeId, parent]) => (
                                <tr key={`parent-${nodeId}`} className="border-b border-slate-200 dark:border-slate-800/50">
                                  <td className="py-1 font-bold text-slate-700 dark:text-slate-300">{nodeId}</td>
                                  <td className="py-1 text-right text-blue-600 dark:text-blue-400">
                                    {parent === null ? "-" : parent}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              <ControlsButton 
                label="Clear Graph" 
                onClick={handleClearGraph} 
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white" 
              />
            </div>

            {/* Code Viewer (only when Algorithm is selected and code exists) */}
            {activeTab === "Algorithm" && algorithm.code && (
              <CodeViewer code={algorithm.code} language={algorithm.language} />
            )}

          </div>

          {/* Visualization Canvas */}
          <div className="flex flex-col gap-4 overflow-hidden">
            <GraphVisualization 
              nodes={nodes} 
              edges={edges} 
              step={activeStepObj} 
              onCanvasClick={handleCanvasClick} 
              onNodePositionChange={handleNodePositionChange} 
            />
            
            <div className="neo-panel p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
               <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{activeStepObj.status}</p>
               <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{activeStepObj.explanation}</p>
            </div>

            {/* Algorithm Steps List */}
            {activeTab === "Algorithm" && (
                <ExecutionSteps steps={steps} currentStep={currentStep} />
            )}
          </div>

        </div>

        <section className="grid gap-4 grid-cols-2 sm:grid-cols-4 mt-6">
          {algorithm.complexities.best && (
            <ComplexityCard label="Best Case" value={algorithm.complexities.best} tone="green" />
          )}
          {algorithm.complexities.average && (
            <ComplexityCard label="Average Case" value={algorithm.complexities.average} tone="orange" />
          )}
          {algorithm.complexities.worst && (
            <ComplexityCard label="Worst Case" value={algorithm.complexities.worst} tone="red" />
          )}
          {algorithm.complexities.space && (
            <ComplexityCard label="Space Complexity" value={algorithm.complexities.space} tone="blue" />
          )}
        </section>

      </div>
    </div>
  );
}
