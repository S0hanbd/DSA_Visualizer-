import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useIsPresent, motion, AnimatePresence } from "framer-motion";
import CodeViewer from "../components/CodeViewer.jsx";
import ComplexityCard from "../components/ComplexityCard.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import StackVisualization from "../components/StackVisualization.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { algorithmMap } from "../data/algorithms.js";
import {
  buildPushSteps,
  buildPopSteps,
  buildPeekSteps,
  buildInitialStep
} from "../logic/stackInteractive.js";

const STACK_MAX = 10;

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
export default function StackPage() {
  const { slug } = useParams();
  const location = useLocation();
  const rawSlug = slug || location.pathname.split("/").filter(Boolean).pop();

  const algorithm = algorithmMap[rawSlug];

  // ── state ──────────────────────────────────────────────────────────────────
  const [liveStack, setLiveStack] = useState([]);
  const [history, setHistory] = useState([]); // array of { id, text, type }
  
  const [opValue, setOpValue] = useState("");
  const [opError, setOpError] = useState("");

  const [steps, setSteps] = useState(() => buildInitialStep([]));
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

  const handlePush = () => {
    if (isPlaying) return;
    const val = parseInt(opValue.trim(), 10);
    if (isNaN(val)) {
      setOpError("Enter a valid number.");
      return;
    }
    if (liveStack.length >= STACK_MAX) {
      setOpError(`Stack Overflow! Max capacity (${STACK_MAX}) reached.`);
      return;
    }
    
    const newSteps = buildPushSteps(liveStack, val);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    
    const finalState = newSteps[newSteps.length - 1];
    if (finalState.markers.success) {
        setLiveStack(finalState.array);
        addHistory(`Push: ${val}`, "push");
    } else {
        addHistory(`Push ${val} Failed (Overflow)`, "error");
    }
    setOpValue("");
    setOpError("");
  };

  const handlePop = () => {
    if (isPlaying) return;
    
    const newSteps = buildPopSteps(liveStack);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    
    const finalState = newSteps[newSteps.length - 1];
    if (finalState.markers.success) {
        const popped = liveStack[liveStack.length - 1];
        setLiveStack(finalState.array);
        addHistory(`Pop: ${popped}`, "pop");
    } else {
        addHistory(`Pop Failed (Empty)`, "error");
    }
    setOpError("");
  };

  const handlePeek = () => {
    if (isPlaying) return;
    
    const newSteps = buildPeekSteps(liveStack);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(true);
    
    const finalState = newSteps[newSteps.length - 1];
    if (finalState.markers.success) {
        const top = liveStack[liveStack.length - 1];
        addHistory(`Peek: ${top}`, "peek");
    } else {
        addHistory(`Peek Failed (Empty)`, "error");
    }
    setOpError("");
  };

  const handleClear = () => {
      if (isPlaying) return;
      setLiveStack([]);
      setSteps(buildInitialStep([]));
      setCurrentStep(0);
      addHistory(`Cleared`, "error");
  };

  const goNext = () => setCurrentStep(s => Math.min(steps.length - 1, s + 1));
  const goPrev = () => setCurrentStep(s => Math.max(0, s - 1));
  const goReset = () => { setCurrentStep(0); setIsPlaying(false); };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto flex w-full gap-6 px-4 py-8">
      <Sidebar />
      <div className="min-w-0 flex-1">
        {/* Header */}
      <div className="mb-8">
        <p className="font-bold tracking-widest text-emerald-500 uppercase">{algorithm.category}</p>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mt-2">{algorithm.title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {algorithm.description}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        
        {/* Left Column: Controls & History */}
        <div className="flex flex-col gap-6">
          
          {/* Stack Controls Panel */}
          <div className="neo-panel p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-5">Stack Controls</h3>
            
            <div className="flex items-center gap-3 mb-4">
              <input
                type="number"
                placeholder="Enter value"
                value={opValue}
                onChange={(e) => { setOpValue(e.target.value); setOpError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handlePush()}
                className="flex-1 capsule-input"
              />
              <OpBtn 
                label="Push" 
                onClick={handlePush} 
                disabled={liveStack.length >= STACK_MAX}
                className="bg-slate-500 hover:bg-slate-600 text-white" 
              />
            </div>
            {opError && <p className="text-xs font-bold text-red-500 mb-4">{opError}</p>}
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <OpBtn 
                label="Pop" 
                onClick={handlePop} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200" 
              />
              <OpBtn 
                label="Peek" 
                onClick={handlePeek} 
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200" 
              />
            </div>

            <OpBtn 
                label="Clear" 
                onClick={handleClear} 
                className="w-full bg-red-400 hover:bg-red-500 text-white" 
            />
          </div>

          {/* Operation History Panel */}
          <div className="neo-panel p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-xl flex-1 flex flex-col min-h-[300px]">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Operation History</h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-2">
              <AnimatePresence>
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-sm font-semibold"
                  >
                    {item.type === "push" && <span className="text-emerald-500 text-lg">↓</span>}
                    {item.type === "pop" && <span className="text-red-500 text-lg">↑</span>}
                    {item.type === "peek" && <span className="text-blue-500 text-lg">👁</span>}
                    {item.type === "error" && <span className="text-rose-500 text-lg">⨯</span>}
                    
                    <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {history.length === 0 && (
                <p className="text-slate-400 text-sm italic mt-2">No operations yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Visualization & Playback */}
        <div className="flex flex-col gap-6">
          <div className="neo-panel flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl relative overflow-hidden flex flex-col">
            
            {/* Step Explanation overlay matching the design */}
            <div className="absolute top-4 left-4 right-4 z-20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-sm font-black text-slate-500 dark:text-slate-400">
                        {currentStep + 1}/{steps.length}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{step.status}</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{step.explanation}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
            </div>

            {/* Visualizer */}
            <div className="flex-1 flex items-center justify-center p-8 mt-16">
              <StackVisualization step={step} />
            </div>

          </div>

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
          />
        </div>
      </div>

      {/* Code Viewer Section */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <CodeViewer code={algorithm.code} activeLine={step.line} language={algorithm.language} />
        <ExecutionSteps steps={steps} currentStep={currentStep} />
      </section>

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
