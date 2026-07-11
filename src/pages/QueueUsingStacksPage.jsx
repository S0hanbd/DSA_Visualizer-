import { useEffect, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import CodeViewer from "../components/CodeViewer.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import QueueUsingStacksVisualization from "../components/QueueUsingStacksVisualization.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { algorithmMap } from "../data/algorithms.js";
import {
  buildEnqueueSteps,
  buildDequeueSteps
} from "../logic/queueUsingStacksSimulation.js";

const STACK_MAX = 6;

// ─── Playback Component ──────────────────────────────────────────────────────
function Playback({ isPlaying, onPlay, onPause, onPrev, onNext, onReset, speed, setSpeed, current, total, children }) {
  return (
    <div className="neo-panel flex items-center justify-between p-4 flex-wrap gap-4">
      {children && (
        <div className="flex items-center gap-2 md:border-r-2 md:pr-4 border-slate-200 dark:border-slate-700">
          {children}
        </div>
      )}

      <div className="flex items-center gap-4 ml-auto flex-wrap justify-end">
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
        <div className="text-sm font-bold text-slate-400 min-w-[90px] text-right">
          Step {current + 1} / {total}
        </div>
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
export default function QueueUsingStacksPage() {
  const { slug } = useParams();
  const location = useLocation();
  const rawSlug = slug || location.pathname.split("/").filter(Boolean).pop();

  const algorithm = algorithmMap[rawSlug];

  // ── state ──────────────────────────────────────────────────────────────────
  const [liveStack1, setLiveStack1] = useState([]);
  const [liveStack2, setLiveStack2] = useState([]);
  const [history, setHistory] = useState([]); 
  
  const [opValue, setOpValue] = useState("");
  const [opError, setOpError] = useState("");

  const initialStep = {
      stack1: [],
      stack2: [],
      status: "Idle",
      explanation: "Queue initialized. Stack 1 handles enqueue, Stack 2 handles dequeue.",
      line: null,
      markers: {}
  };

  const [steps, setSteps] = useState([initialStep]);
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

  const addHistory = (text, type) => {
    setHistory(h => [...h, { id: Date.now(), text, type }]);
  };

  const goPrev = () => { setIsPlaying(false); setCurrentStep(s => Math.max(0, s - 1)); };
  const goNext = () => { setIsPlaying(false); setCurrentStep(s => Math.min(steps.length - 1, s + 1)); };
  const goReset = () => { 
    setIsPlaying(false); 
    setLiveStack1([]);
    setLiveStack2([]);
    setSteps([initialStep]); 
    setCurrentStep(0); 
    setHistory([]);
    setOpValue("");
    setOpError("");
  };

  // ── Operations ──────────────────────────────────────────────────────────────
  const handleEnqueue = () => {
    if (isPlaying) return;
    const val = parseInt(opValue);
    if (isNaN(val)) {
      setOpError("Enter a valid integer.");
      return;
    }
    if (liveStack1.length >= STACK_MAX) {
      setOpError(`Input Stack Overflow! Max capacity (${STACK_MAX}) reached.`);
      return;
    }
    
    const newSteps = buildEnqueueSteps(liveStack1, liveStack2, val);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    
    const finalState = newSteps[newSteps.length - 1];
    setLiveStack1(finalState.stack1);
    setLiveStack2(finalState.stack2);
    addHistory(`Enqueue: ${val} to S1`, "push");
    
    setOpValue("");
    setOpError("");
  };

  const handleDequeue = () => {
    if (isPlaying) return;
    
    const newSteps = buildDequeueSteps(liveStack1, liveStack2);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    
    const finalState = newSteps[newSteps.length - 1];
    
    if (finalState.markers.error) {
        addHistory(`Dequeue Failed (Queue Empty)`, "error");
    } else {
        const popped = finalState.markers.dequeued;
        setLiveStack1(finalState.stack1);
        setLiveStack2(finalState.stack2);
        addHistory(`Dequeue: ${popped}`, "pop");
    }
    setOpError("");
  };

  if (!algorithm) return <Navigate to="/queue/linear-queue" replace />;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-auto p-4 lg:p-8">
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

        {/* Error Notification */}
        {opError && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm font-bold text-red-600 border border-red-300 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {opError}
          </div>
        )}

        {/* Playback Controls & Operations */}
        <div className="mb-6">
            <Playback
                isPlaying={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onPrev={goPrev}
                onNext={goNext}
                onReset={goReset}
                speed={speed}
                setSpeed={setSpeed}
                current={currentStep}
                total={steps.length}
            >
              <input 
                type="number"
                value={opValue}
                onChange={e => setOpValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEnqueue()}
                placeholder="Enter value"
                className="w-24 rounded-lg border-2 border-slate-200 bg-slate-50 px-2 py-2 text-sm font-bold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              <OpBtn 
                label="Enqueue" 
                onClick={handleEnqueue} 
                disabled={isPlaying || !opValue}
                className="bg-blue-500 text-white hover:bg-blue-600 px-3"
              />
              <OpBtn 
                label="Dequeue" 
                onClick={handleDequeue} 
                disabled={isPlaying || (liveStack1.length === 0 && liveStack2.length === 0)}
                className="bg-purple-500 text-white hover:bg-purple-600 px-3"
              />
            </Playback>
        </div>

        {/* Visualization & Code Viewer */}
        <section className="mb-6 grid gap-6 lg:grid-cols-2">
            <QueueUsingStacksVisualization step={step} currentStep={currentStep} />
            <CodeViewer code={algorithm.code} activeLine={step.line} language={algorithm.language} />
        </section>

        {/* Execution Steps */}
        <section>
          <ExecutionSteps steps={steps} currentStep={currentStep} />
        </section>

      </div>
    </div>
  );
}
