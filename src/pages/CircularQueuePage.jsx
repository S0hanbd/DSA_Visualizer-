import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useIsPresent, motion, AnimatePresence } from "framer-motion";
import CodeViewer from "../components/CodeViewer.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import CircularQueueVisualization from "../components/CircularQueueVisualization.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { algorithmMap } from "../data/algorithms.js";
import {
  buildCQEnqueueSteps,
  buildCQDequeueSteps,
  buildInitialCQStep
} from "../logic/circularQueueInteractive.js";

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
export default function CircularQueuePage() {
  const { slug } = useParams();
  const location = useLocation();
  const rawSlug = slug || location.pathname.split("/").filter(Boolean).pop();

  const algorithm = algorithmMap[rawSlug];

  // ── state ──────────────────────────────────────────────────────────────────
  const [liveQueue, setLiveQueue] = useState(() => buildInitialCQStep()[0]);
  const [history, setHistory] = useState([]); // array of { id, text, type }
  
  const [opValue, setOpValue] = useState("");
  const [opError, setOpError] = useState("");

  const [steps, setSteps] = useState(() => buildInitialCQStep());
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

  // sync live queue when animation finishes or stops
  useEffect(() => {
    if (!isPlaying && currentStep === steps.length - 1) {
      setLiveQueue(steps[steps.length - 1]);
    }
  }, [isPlaying, currentStep, steps]);

  if (!algorithm) return <Navigate to="/algorithms" replace />;

  const isFull = (liveQueue.front === 0 && liveQueue.rear === QUEUE_MAX - 1) || (liveQueue.front === liveQueue.rear + 1);
  const isEmpty = liveQueue.front === -1;

  // ── handlers ───────────────────────────────────────────────────────────────
  const addHistory = (text, type = "info") => {
    setHistory(prev => [{ id: Date.now() + Math.random(), text, type }, ...prev].slice(0, 50));
  };

  const handleEnqueue = () => {
    if (isPlaying) return;
    setOpError("");

    if (!opValue.trim()) {
      setOpError("Enter a value");
      return;
    }

    if (isFull) {
        addHistory("Enqueue Failed: Circular Queue Overflow", "error");
    } else {
        addHistory(`Enqueue: ${opValue}`, "success");
    }

    const newSteps = buildCQEnqueueSteps(liveQueue, opValue);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    setOpValue("");
  };

  const handleBulkEnqueue = () => {
      if (isPlaying) return;
      
      const count = Math.floor(Math.random() * 3) + 3; // 3 to 5 items
      const values = Array.from({length: count}, () => Math.floor(Math.random() * 100).toString());
      
      let currentState = liveQueue;
      let finalSteps = [makeInitialStep(currentState)];

      for (let i = 0; i < values.length; i++) {
          const newSteps = buildCQEnqueueSteps(currentState, values[i]);
          // append steps, skipping the initial copy step to avoid duplicates
          if (i === 0) finalSteps = newSteps;
          else finalSteps = [...finalSteps, ...newSteps.slice(1)];
          
          currentState = newSteps[newSteps.length - 1];
          if (currentState.markers?.success === false) {
             addHistory(`Bulk Enqueue stopped: Overflow`, "error");
             break;
          } else {
             addHistory(`Enqueue: ${values[i]}`, "success");
          }
      }

      setSteps(finalSteps);
      setCurrentStep(0);
      setIsPlaying(true);
  };
  
  function makeInitialStep(state) {
      return { ...state, explanation: "Starting bulk operation...", markers: {} };
  }

  const handleDequeue = () => {
    if (isPlaying) return;
    setOpError("");

    if (isEmpty) {
        addHistory("Dequeue Failed: Queue Underflow", "error");
    } else {
        addHistory(`Dequeue: Element removed from front`, "info");
    }

    const newSteps = buildCQDequeueSteps(liveQueue);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleClear = () => {
    if (isPlaying) setIsPlaying(false);
    const initial = buildInitialCQStep();
    setLiveQueue(initial[0]);
    setSteps(initial);
    setCurrentStep(0);
    addHistory("Queue cleared", "info");
    setOpError("");
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-auto p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3">
            {algorithm.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {algorithm.description}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
          {/* LEFT COLUMN: Controls & History */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Control Panel */}
            <div className="neo-panel p-6 flex flex-col gap-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Queue Controls
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Enqueue Element</label>
                    <div className="flex gap-2">
                    <input
                        type="text"
                        value={opValue}
                        onChange={(e) => setOpValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleEnqueue()}
                        placeholder="e.g. 42"
                        className="flex-1 capsule-input"
                        maxLength={4}
                        disabled={isPlaying}
                    />
                    <OpBtn 
                        label="Enqueue" 
                        onClick={handleEnqueue} 
                        disabled={isPlaying}
                        className="bg-emerald-500 text-white hover:bg-emerald-600"
                    />
                    </div>
                    {opError && <p className="text-red-500 text-sm font-bold">{opError}</p>}
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3">
                    <OpBtn 
                        label="Dequeue" 
                        onClick={handleDequeue} 
                        disabled={isPlaying}
                        className="bg-red-500 text-white hover:bg-red-600"
                    />
                    <OpBtn 
                        label="Bulk Insert" 
                        onClick={handleBulkEnqueue} 
                        disabled={isPlaying}
                        className="bg-purple-500 text-white hover:bg-purple-600"
                    />
                </div>
                
                <div className="pt-2">
                    <OpBtn 
                        label="Clear Queue" 
                        onClick={handleClear} 
                        disabled={isPlaying}
                        className="w-full bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300"
                    />
                </div>
              </div>
            </div>

            {/* History Panel */}
            <div className="neo-panel flex-1 min-h-[300px] flex flex-col p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300">Operation History</h3>
                </div>
                <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                    <AnimatePresence>
                        {history.length === 0 && (
                            <div className="text-slate-400 italic text-center mt-4 text-sm">No operations yet.</div>
                        )}
                        {history.map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: "auto" }}
                                className="mb-2"
                            >
                                <div className={`text-sm font-mono p-2 rounded border-l-4 ${
                                    item.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400' :
                                    item.type === 'success' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400' :
                                    'border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400'
                                }`}>
                                    {item.text}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Visualization & Code */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Visualization */}
            <CircularQueueVisualization step={step} />
            
            {/* Playback Controls */}
            <Playback 
              isPlaying={isPlaying}
              onPlay={() => {
                if (currentStep < steps.length - 1) setIsPlaying(true);
              }}
              onPause={() => setIsPlaying(false)}
              onPrev={() => {
                setIsPlaying(false);
                setCurrentStep(s => Math.max(0, s - 1));
              }}
              onNext={() => {
                setIsPlaying(false);
                setCurrentStep(s => Math.min(steps.length - 1, s + 1));
              }}
              onReset={() => {
                setIsPlaying(false);
                setCurrentStep(0);
              }}
              speed={speed}
              setSpeed={setSpeed}
              current={currentStep}
              total={steps.length}
            />

            {/* Code and Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CodeViewer 
                code={algorithm.code}
                language={algorithm.language}
                activeLine={step.line}
              />
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
      </main>
    </div>
  );
}
