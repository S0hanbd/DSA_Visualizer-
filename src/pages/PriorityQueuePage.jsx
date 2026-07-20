import { useCallback, useEffect, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CodeViewer from "../components/CodeViewer.jsx";
import ComplexityCard from "../components/ComplexityCard.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import TreeVisualization from "../components/TreeVisualization.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { algorithmMap } from "../data/algorithms.js";
import {
  buildPQInsertSteps,
  buildPQExtractSteps,
  buildPQInitialStep
} from "../logic/priorityQueueInteractive.js";

const MAX_ELEMENTS = 15;

// ─── Playback Component ──────────────────────────────────────────────────────
function Playback({ isPlaying, onPlay, onPause, onPrev, onNext, onReset, speed, setSpeed, current, total }) {
  return (
    <div className="neo-panel flex items-center justify-between p-4 flex-wrap gap-4">
      <div className="flex gap-2">
        <button onClick={onPrev} disabled={current === 0} className="rounded-lg bg-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          ⏮
        </button>
        {isPlaying ? (
          <button onClick={onPause} className="rounded-lg bg-red-500 px-6 py-2 font-bold text-white hover:bg-red-600 shadow-md">
            ⏸ Pause
          </button>
        ) : (
          <button onClick={onPlay} disabled={current >= total - 1} className="rounded-lg bg-emerald-500 px-6 py-2 font-bold text-white hover:bg-emerald-600 shadow-md disabled:bg-emerald-500/50">
            ▶ Play
          </button>
        )}
        <button onClick={onNext} disabled={current >= total - 1} className="rounded-lg bg-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-300 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          ⏭
        </button>
        <button onClick={onReset} className="ml-2 rounded-lg bg-slate-200 px-4 py-2 font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
          Reset
        </button>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-sm font-bold text-slate-500">Speed</label>
        <input 
            type="range" min="80" max="900" step="10" 
            value={1000 - speed} 
            onChange={(e) => setSpeed(1000 - Number(e.target.value))}
            className="w-24 accent-emerald-500"
        />
      </div>
      <div className="text-sm font-bold text-slate-400">
        Step {current + 1} / {total}
      </div>
    </div>
  );
}

// ─── Button Component ────────────────────────────────────────────────────────
function OpBtn({ label, onClick, disabled = false, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {label}
    </button>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function PriorityQueuePage() {
  const { slug } = useParams();
  const location = useLocation();
  const rawSlug = slug || location.pathname.split("/").filter(Boolean).pop();

  const algorithm = algorithmMap[rawSlug];

  // ── state ──────────────────────────────────────────────────────────────────
  const [liveQueue, setLiveQueue] = useState([]); // array of {id, val}
  const [history, setHistory] = useState([]);
  const [isMax, setIsMax] = useState(true);
  
  const [opValue, setOpValue] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const [opError, setOpError] = useState("");

  const [steps, setSteps] = useState(() => buildPQInitialStep());
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(480);

  const step = steps[currentStep] || steps[0];

  // ── animation loop ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentStep(s => s + 1);
    }, speed);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  if (!algorithm) return <Navigate to="/" replace />;

  // ── operations ─────────────────────────────────────────────────────────────
  const addHistory = (text, type) => {
    setHistory(prev => [{ id: Date.now() + Math.random(), text, type }, ...prev].slice(0, 15));
  };

  const parseValues = (str) => {
    return str
      .split(/[,\s]+/)
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n >= 0 && n <= 9999);
  };

  const handleInsert = (isBulk = false) => {
    if (isPlaying) return;
    const valStr = isBulk ? bulkValue : opValue;
    const values = parseValues(valStr);
    
    if (values.length === 0) {
      setOpError("Enter valid number(s).");
      return;
    }
    
    if (liveQueue.length + values.length > MAX_ELEMENTS) {
      setOpError(`Exceeds max capacity (${MAX_ELEMENTS}).`);
      return;
    }
    
    const newSteps = buildPQInsertSteps(liveQueue, values, isMax);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    
    const finalState = newSteps[newSteps.length - 1];
    setLiveQueue([...finalState.array]);
    addHistory(`Enqueued: ${values.join(", ")}`, "enqueue");
    
    setOpValue("");
    setBulkValue("");
    setOpError("");
  };

  const handleExtract = () => {
    if (isPlaying) return;
    
    if (liveQueue.length === 0) {
        setOpError("Queue is empty!");
        return;
    }
    
    const newSteps = buildPQExtractSteps(liveQueue, isMax);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    
    const finalState = newSteps[newSteps.length - 1];
    setLiveQueue([...finalState.array]);
    addHistory(`Extracted ${isMax ? 'Max' : 'Min'}`, "dequeue");
    
    setOpError("");
  };

  const handleClear = () => {
    setLiveQueue([]);
    setSteps(buildPQInitialStep());
    setCurrentStep(0);
    setIsPlaying(false);
    setHistory([]);
    setOpError("");
    setOpValue("");
    setBulkValue("");
  };

  const toggleMaxMin = () => {
      setIsMax(!isMax);
      handleClear();
  };

  // ── layout ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 max-w-7xl mx-auto p-4 lg:p-8">
        
        {/* Header */}
        <div className="mb-8 mt-4 text-center lg:mt-0 lg:text-left">
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl">
            {algorithm.title}
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            {algorithm.description}
          </p>
        </div>

        {/* Main Workspace */}
        <div className="flex flex-col gap-6 lg:flex-row">
          
          {/* LEFT: Controls & History */}
          <div className="flex flex-col gap-6 lg:w-80 shrink-0">
            
            {/* Controls */}
            <div className="neo-panel p-6 space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">
                            Queue Controls
                        </h3>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={toggleMaxMin}>
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isMax ? 'bg-slate-800 dark:bg-slate-200' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white dark:bg-slate-900 transition-transform ${isMax ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                                {isMax ? 'Max PQ' : 'Min PQ'}
                            </span>
                        </div>
                    </div>
                    
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Single Insert</label>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="number"
                            placeholder="Value"
                            className="w-full capsule-input"
                            value={opValue}
                            onChange={(e) => setOpValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleInsert(false)}
                            disabled={isPlaying}
                        />
                        <OpBtn 
                            label="Enqueue" 
                            onClick={() => handleInsert(false)}
                            disabled={isPlaying || !opValue.trim()} 
                            className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                        />
                    </div>
                    
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Bulk Insert (comma-separated)</label>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="e.g., 10, 5, 20"
                            className="w-full capsule-input"
                            value={bulkValue}
                            onChange={(e) => setBulkValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleInsert(true)}
                            disabled={isPlaying}
                        />
                        <OpBtn 
                            label="Enqueue All" 
                            onClick={() => handleInsert(true)}
                            disabled={isPlaying || !bulkValue.trim()} 
                            className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shrink-0"
                        />
                    </div>
                    
                    {opError && (
                        <div className="mb-4 text-sm font-bold text-red-500 animate-pulse">
                            {opError}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <OpBtn 
                            label="Dequeue" 
                            onClick={handleExtract} 
                            disabled={isPlaying || liveQueue.length === 0} 
                            className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        />
                        <OpBtn 
                            label="Clear" 
                            onClick={handleClear} 
                            disabled={isPlaying || liveQueue.length === 0} 
                            className="w-full bg-red-500 text-white hover:bg-red-600"
                        />
                    </div>
                </div>
            </div>

            {/* Array Representation */}
            <div className="neo-panel p-6">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4">
                    Array Representation
                </h3>
                <div className="flex flex-wrap gap-2 items-end min-h-[64px]">
                    <AnimatePresence mode="popLayout">
                        {(step.array || []).map((node, i) => {
                            const isSwapping = step.markers?.swapping?.includes(node.id);
                            const isComparing = step.markers?.comparing?.includes(node.id);
                            
                            let bgClass = "bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300";
                            if (isSwapping) bgClass = "bg-amber-100 border-amber-400 text-amber-800 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-300";
                            else if (isComparing) bgClass = "bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300";

                            return (
                                <motion.div 
                                    key={node.id} 
                                    layout
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <span className="text-[10px] text-slate-400 font-medium">{i}</span>
                                    <div className={`w-12 h-12 flex items-center justify-center font-bold text-lg rounded-xl border-2 shadow-sm ${bgClass}`}>
                                        {node.val}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    {(!step.array || step.array.length === 0) && (
                        <div className="text-sm text-slate-500 italic flex items-center h-12">
                            Queue is empty
                        </div>
                    )}
                </div>
            </div>

            {/* History */}
            <div className="neo-panel flex-1 p-6 flex flex-col min-h-[250px]">
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-4">
                    Operation History
                </h3>
                <div className="flex-1 overflow-auto space-y-2 relative">
                    <AnimatePresence>
                        {history.length === 0 && (
                            <div className="text-slate-400 dark:text-slate-500 text-sm font-medium italic absolute top-0">
                                No operations yet.
                            </div>
                        )}
                        {history.map((h, i) => (
                            <motion.div
                                key={h.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-sm font-medium"
                            >
                                {h.type === "enqueue" ? (
                                    <span className="text-emerald-500">→</span>
                                ) : h.type === "dequeue" ? (
                                    <span className="text-rose-500">←</span>
                                ) : (
                                    <span className="text-red-500">!</span>
                                )}
                                <span className="text-slate-700 dark:text-slate-300">
                                    {h.text}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
          </div>

          {/* RIGHT: Visualizer & Code */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            
            {/* Playback Controls */}
            <Playback 
                isPlaying={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onPrev={() => setCurrentStep(s => Math.max(0, s - 1))}
                onNext={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
                onReset={() => {
                    setIsPlaying(false);
                    setCurrentStep(0);
                }}
                speed={speed}
                setSpeed={setSpeed}
                current={currentStep}
                total={steps.length}
            />

            {/* Visualization Area */}
            <div className="neo-panel bg-slate-50 dark:bg-[#0B1120] relative flex flex-col min-h-[500px]">
                {/* Tree Visualization */}
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    {/* Floating Explanation */}
                    <div className="absolute top-4 left-0 w-full flex justify-center z-10 pointer-events-none">
                        <div className="bg-slate-800 text-slate-200 px-4 py-2 rounded-full text-sm font-medium shadow-md">
                            {step.explanation}
                        </div>
                    </div>
                    <TreeVisualization tree={step.tree} markers={step.markers} type="heap" height="h-[500px]" embedded={true} />
                </div>
            </div>

            {/* Code & Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CodeViewer code={algorithm.code} activeLine={step.line} />
                <ExecutionSteps 
                    steps={steps} 
                    currentStep={currentStep} 
                    onStepClick={(idx) => {
                        setIsPlaying(false);
                        setCurrentStep(idx);
                    }} 
                />
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
      </div>
    </div>
  );
}
