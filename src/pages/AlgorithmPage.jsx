import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useIsPresent } from "framer-motion";
import CodeViewer from "../components/CodeViewer.jsx";
import ComplexityCard from "../components/ComplexityCard.jsx";
import Controls from "../components/Controls.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import Sidebar from "../components/Sidebar.jsx";
import StatsPanel from "../components/StatsPanel.jsx";

import VisualizationBars from "../components/VisualizationBars.jsx";
import LinkedListVisualization from "../components/LinkedListVisualization.jsx";
import { algorithmMap } from "../data/algorithms.js";
import { createRandomArray } from "../logic/bubbleSortSimulation.js";
import { buildSimulationSteps } from "../logic/simulations.js";

const LINKED_LIST_SLUGS = new Set(["singly-linked-list", "doubly-linked-list", "circular-linked-list"]);

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
  }, [location.pathname, array, target]);

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

  if (algorithm.comingSoon) {
    return (
      <div className="mx-auto flex w-full gap-6 px-4 py-8">
        <Sidebar />
        <div className="min-w-0 flex-1 space-y-7">
          <section className="neo-panel p-6">
            <p className="muted-label">{algorithm.category}</p>
            <div className="mt-3">
              <h1 className="text-4xl font-black sm:text-5xl">{algorithm.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">{algorithm.description}</p>
            </div>
          </section>
          
          <div className="neo-panel flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">🚧</span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200">Coming Soon</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 font-semibold">
              The algorithm will be added soon!
            </p>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="mx-auto flex w-full gap-6 px-4 py-8">
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



        <StatsPanel step={step} totalSteps={steps.length} currentStep={currentStep} />
        {LINKED_LIST_SLUGS.has(activeSlug)
          ? <LinkedListVisualization step={step} algorithm={algorithm} />
          : <VisualizationBars step={step} algorithm={algorithm} />}
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
                className="capsule-input w-full sm:max-w-56"
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

        <section className="grid gap-4 sm:grid-cols-2">
          <ComplexityCard label="Time Complexity" value={algorithm.complexities.worst} tone="red" />
          <ComplexityCard label="Space Complexity" value={algorithm.complexities.space} tone="blue" />
        </section>
      </div>
    </div>
  );
}
