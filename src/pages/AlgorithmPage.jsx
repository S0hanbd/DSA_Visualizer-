import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useIsPresent } from "framer-motion";
import CodeViewer from "../components/CodeViewer.jsx";
import ComplexityCard from "../components/ComplexityCard.jsx";
import Controls from "../components/Controls.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import Sidebar from "../components/Sidebar.jsx";
import StatsPanel from "../components/StatsPanel.jsx";
import StepExplanation from "../components/StepExplanation.jsx";
import VisualizationBars from "../components/VisualizationBars.jsx";
import { algorithmMap } from "../data/algorithms.js";
import { createRandomArray } from "../logic/bubbleSortSimulation.js";
import { buildSimulationSteps } from "../logic/simulations.js";

const defaultArray = [42, 18, 73, 29, 64, 11, 90, 37, 56];

export default function AlgorithmPage() {
  const { slug } = useParams();
  const location = useLocation();
  const isPresent = useIsPresent();

  // Freeze route params when exiting to prevent blank screen transition glitches
  const activeSlugRef = useRef(slug);
  if (isPresent && slug && slug !== activeSlugRef.current) {
    activeSlugRef.current = slug;
  }
  const activeSlug = activeSlugRef.current || slug;
  const algorithm = algorithmMap[activeSlug];
  const [array, setArray] = useState(defaultArray);
  const [input, setInput] = useState(defaultArray.join(", "));
  const [target, setTarget] = useState(defaultArray[0]);
  const [inputError, setInputError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(640);

  const steps = useMemo(() => (algorithm ? buildSimulationSteps(array, algorithm, Number(target)) : []), [algorithm, array, target]);
  const step = steps[currentStep] || steps[0];

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [location.pathname, array, target, isPresent]);

  useEffect(() => {
    if (!isPlaying || !isPresent) return undefined;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setCurrentStep((value) => Math.min(value + 1, steps.length - 1)), speed);
    return () => window.clearTimeout(timer);
  }, [currentStep, isPlaying, speed, steps.length, isPresent]);

  if (!algorithm) return <Navigate to="/" replace />;

  const setCustomArray = () => {
    const parsed = input
      .split(/[,\s]+/)
      .map((item) => Number(item.trim()))
      .filter((number) => Number.isFinite(number) && number > 0 && number <= 999)
      .slice(0, 20);

    if (parsed.length < 2) {
      setInputError("Enter at least 2 numbers between 1 and 999.");
      return;
    }

    setInputError("");
    setArray(parsed);
  };

  const randomize = () => {
    const next = createRandomArray(9);
    setArray(next);
    setInput(next.join(", "));
  };

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Sidebar />
      <div className="min-w-0 flex-1 space-y-7">
        <section className="neo-panel p-6">
          <p className="muted-label">{algorithm.category}</p>
          <div className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-black sm:text-5xl">{algorithm.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">{algorithm.description}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ComplexityCard label="Best Case" value={algorithm.complexities.best} tone="green" />
          <ComplexityCard label="Average Case" value={algorithm.complexities.average} tone="blue" />
          <ComplexityCard label="Worst Case" value={algorithm.complexities.worst} tone="red" />
          <ComplexityCard label="Space Complexity" value={algorithm.complexities.space} tone="orange" />
        </section>

        <VisualizationBars step={step} algorithm={algorithm} />
        <StatsPanel step={step} totalSteps={steps.length} currentStep={currentStep} />
        <StepExplanation step={step} />
        <Controls
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onPrev={() => setCurrentStep((value) => Math.max(0, value - 1))}
          onNext={() => setCurrentStep((value) => Math.min(steps.length - 1, value + 1))}
          onReset={() => {
            setCurrentStep(0);
            setIsPlaying(false);
          }}
          onRandom={randomize}
          input={input}
          setInput={setInput}
          onSetArray={setCustomArray}
          speed={speed}
          setSpeed={setSpeed}
          inputError={inputError}
        />

        {algorithm.type === "searching" && (
          <section className="neo-panel p-5">
            <p className="muted-label">Search Target</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="number"
                min="1"
                max="999"
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                className="neo-inset w-full bg-transparent px-4 py-3 text-sm font-semibold outline-none sm:max-w-56"
              />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                The searching simulation uses this value as the student-selected target.
              </p>
            </div>
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <CodeViewer code={algorithm.code} activeLine={step.line} language={algorithm.language} />
          <ExecutionSteps steps={steps} currentStep={currentStep} />
        </section>
      </div>
    </div>
  );
}
