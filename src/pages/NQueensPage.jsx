import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar.jsx";
import CodeViewer from "../components/CodeViewer.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import NQueensVisualization from "../components/NQueensVisualization.jsx";
import PlaybackBar from "../components/PlaybackBar.jsx";
import { buildNQueensSteps } from "../logic/nQueensSimulation.js";
import { algorithmMap } from "../data/algorithms.js";
import ComplexitySummary from "../components/ComplexitySummary.jsx";

function SizeBtn({ size, activeSize, onClick }) {
  const isActive = size === activeSize;
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-pressed={isActive}
      className={`rounded-2xl px-4 py-2.5 text-sm font-black shadow transition ${
        isActive
          ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
          : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
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

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }
    const timer = setTimeout(
      () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1)),
      speed,
    );
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  const step = steps[currentStep] || steps[0];
  return (
    <div className="mx-auto flex w-full gap-6 px-4 py-8">
      <Sidebar />
      <div className="min-w-0 flex-1 space-y-5">
        <section className="neo-panel p-6">
          <p className="muted-label">{algorithm.category}</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            {algorithm.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {algorithm.description}
          </p>
        </section>

        <PlaybackBar
          isPlaying={isPlaying}
          speed={speed}
          setSpeed={setSpeed}
          currentStep={currentStep}
          totalSteps={steps.length}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onPrevious={() => {
            setIsPlaying(false);
            goPrev();
          }}
          onNext={() => {
            setIsPlaying(false);
            goNext();
          }}
          onReset={() => {
            setIsPlaying(false);
            setCurrentStep(0);
          }}
        >
          {[4, 5, 6].map((size) => (
            <SizeBtn
              key={size}
              size={size}
              activeSize={boardSize}
              onClick={() => handleSizeChange(size)}
            />
          ))}
        </PlaybackBar>

        <NQueensVisualization step={step} currentStep={currentStep} />
        <section className="grid gap-6 lg:grid-cols-2">
          <CodeViewer
            algorithm={algorithm}
            step={step}
            code={algorithm.code}
            language={algorithm.language}
          />
          <ExecutionSteps
            steps={steps}
            currentStep={currentStep}
            onStepClick={(index) => {
              setCurrentStep(index);
              setIsPlaying(false);
            }}
          />
        </section>
        <ComplexitySummary algorithm={algorithm} />
      </div>
    </div>
  );
}
