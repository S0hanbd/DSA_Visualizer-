import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar.jsx";
import CodeViewer from "../components/CodeViewer.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import NQueensVisualization from "../components/NQueensVisualization.jsx";
import { buildNQueensSteps } from "../logic/nQueensSimulation.js";
import { algorithmMap } from "../data/algorithms.js";
import ComplexityCard from "../components/ComplexityCard.jsx";

const SPEED_LABELS = { 900: "Slow", 480: "Normal", 200: "Fast", 80: "Turbo" };

function SpeedControl({ speed, setSpeed }) {
  const levels = [900, 480, 200, 80];
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-slate-500">Speed</span>
      <input
        type="range"
        min={0}
        max={3}
        step={1}
        value={levels.indexOf(speed)}
        onChange={(e) => setSpeed(levels[Number(e.target.value)])}
        className="w-28 accent-blue-500 dark:accent-cyan-400"
      />
      <span className="min-w-[3rem] text-xs font-black text-slate-400">{SPEED_LABELS[speed]}</span>
    </div>
  );
}

function Playback({ isPlaying, onPlay, onPause, onPrev, onNext, onReset, speed, setSpeed, current, total, children }) {
  return (
    <div className="neo-panel flex flex-wrap items-center gap-3 p-4">
      <div className="flex items-center gap-2">
        <button onClick={onPrev} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">⏮</button>
        <button onClick={isPlaying ? onPause : onPlay} className="flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400">{isPlaying ? "⏸ Pause" : "▶ Play"}</button>
        <button onClick={onNext} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">⏭</button>
        <button onClick={onReset} className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 text-xs font-black text-slate-700 shadow transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">↺ Reset</button>
      </div>
      <SpeedControl speed={speed} setSpeed={setSpeed} />
      {children && <div className="ml-2 flex items-center gap-2 border-l border-slate-300 pl-4 dark:border-slate-700">{children}</div>}
      <div className="ml-auto text-xs font-bold text-slate-400">Step {current + 1} / {total}</div>
    </div>
  );
}

function SizeBtn({ size, activeSize, onClick }) {
  const isActive = size === activeSize;
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-black shadow transition-all duration-150 ${
        isActive 
          ? "bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100" 
          : "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      }`}
    >
      {size}x{size}
    </motion.button>
  );
}

export default function NQueensPage() {
  const algorithm = algorithmMap["n-queens"];
  
  const [boardSize, setBoardSize] = useState(4);
  const [steps, setSteps] = useState(() => buildNQueensSteps(4));
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(480);

  const handleSizeChange = (size) => {
    setBoardSize(size);
    setSteps(buildNQueensSteps(size));
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const goNext = () => setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
  const goPrev = () => setCurrentStep((s) => Math.max(0, s - 1));
  const goReset = () => { setCurrentStep(0); setIsPlaying(false); };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= steps.length - 1) {
          setIsPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, speed);
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, speed]);

  const step = steps[currentStep] || steps[0];
  const c = algorithm.complexities;

  return (
    <div className="mx-auto flex w-full gap-6 px-4 py-8">
      <Sidebar />
      <div className="min-w-0 flex-1 space-y-5">
        
        {/* Header */}
        <section className="neo-panel p-6">
          <p className="muted-label">{algorithm.category}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-black sm:text-5xl">{algorithm.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                {algorithm.description}
              </p>
            </div>
          </div>
        </section>

        {/* (Board Setup Controls moved to Playback bar) */}

        {/* (Step Explanation moved to NQueensVisualization) */}
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
          <SizeBtn size={4} activeSize={boardSize} onClick={() => handleSizeChange(4)} />
          <SizeBtn size={5} activeSize={boardSize} onClick={() => handleSizeChange(5)} />
          <SizeBtn size={6} activeSize={boardSize} onClick={() => handleSizeChange(6)} />
        </Playback>

        {/* Visualization */}
        <NQueensVisualization step={step} currentStep={currentStep} />

        {/* Code & Steps */}
        <section className="grid gap-6 lg:grid-cols-2">
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
