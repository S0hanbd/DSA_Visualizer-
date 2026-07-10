import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useIsPresent, motion, AnimatePresence } from "framer-motion";
import CodeViewer from "../components/CodeViewer.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import QueueVisualization from "../components/QueueVisualization.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { algorithmMap } from "../data/algorithms.js";
import {
  buildEnqueueSteps,
  buildDequeueSteps,
  buildInitialQueueStep
} from "../logic/queueInteractive.js";

const QUEUE_MAX = 10;

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
export default function QueuePage() {
  const { slug } = useParams();
  const location = useLocation();
  const rawSlug = slug || location.pathname.split("/").filter(Boolean).pop();

  const algorithm = algorithmMap[rawSlug];

  // ── state ──────────────────────────────────────────────────────────────────
  const [liveQueue, setLiveQueue] = useState(() => buildInitialQueueStep()[0]);
  const [history, setHistory] = useState([]); // array of { id, text, type }
  
  const [opValue, setOpValue] = useState("");
  const [opError, setOpError] = useState("");

  const [steps, setSteps] = useState(() => buildInitialQueueStep());
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

  const handleEnqueue = () => {
    if (isPlaying) return;
    const val = parseInt(opValue.trim(), 10);
    if (isNaN(val)) {
      setOpError("Enter a valid number.");
      return;
    }
    // Let the builder handle overflow logic

    
    const newSteps = buildEnqueueSteps(liveQueue, val);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    
    const finalState = newSteps[newSteps.length - 1];
    if (finalState.markers.success) {
        setLiveQueue({ array: finalState.array, front: finalState.front, rear: finalState.rear });
        addHistory(`Enqueue: ${val}`, "enqueue");
    } else {
        addHistory(`Enqueue ${val} Failed (Overflow)`, "error");
    }
    setOpValue("");
    setOpError("");
  };

  const handleDequeue = () => {
    if (isPlaying) return;
    
    const newSteps = buildDequeueSteps(liveQueue);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    
    const finalState = newSteps[newSteps.length - 1];
    if (finalState.markers.success) {
        setLiveQueue({ array: finalState.array, front: finalState.front, rear: finalState.rear });
        addHistory(`Dequeue`, "dequeue");
    } else {
        addHistory(`Dequeue Failed (Underflow)`, "error");
    }
    setOpError("");
  };

  const handleClear = () => {
    setLiveQueue(buildInitialQueueStep()[0]);
    setSteps(buildInitialQueueStep());
    setCurrentStep(0);
    setIsPlaying(false);
    setHistory([]);
    setOpError("");
    setOpValue("");
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
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-4">
                        Queue Controls
                    </h3>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="number"
                            placeholder="Value"
                            className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                            value={opValue}
                            onChange={(e) => setOpValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleEnqueue()}
                            disabled={isPlaying}
                        />
                        <OpBtn 
                            label="Enqueue" 
                            onClick={handleEnqueue}
                            disabled={isPlaying || !opValue.trim()} 
                            className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
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
                            onClick={handleDequeue} 
                            disabled={isPlaying || liveQueue.front === -1 || liveQueue.front > liveQueue.rear} 
                            className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        />
                        <OpBtn 
                            label="Clear" 
                            onClick={handleClear} 
                            disabled={isPlaying || (liveQueue.front === -1 && liveQueue.rear === -1)} 
                            className="w-full bg-red-500 text-white hover:bg-red-600"
                        />
                    </div>
                </div>
            </div>

            {/* History */}
            <div className="neo-panel flex-1 p-6 flex flex-col min-h-[300px]">
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
            <QueueVisualization step={step} algorithm={algorithm} />

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
            
          </div>
        </div>
      </div>
    </div>
  );
}
