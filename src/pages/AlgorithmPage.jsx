import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Code2, History, SlidersHorizontal } from "lucide-react";
import CodeViewer from "../components/CodeViewer.jsx";
import ComplexitySummary from "../components/ComplexitySummary.jsx";
import PlaybackBar from "../components/PlaybackBar.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import StatsPanel from "../components/StatsPanel.jsx";
import ArrayStage from "../components/ArrayStage.jsx";
import { algorithmMap } from "../data/algorithms.js";
import { arrayLearning, inputPresets } from "../data/arrayLearning.js";
import { createRandomArray } from "../logic/bubbleSortSimulation.js";
import { buildSimulationSteps } from "../logic/simulations.js";
import { arrayMetrics, presentArrayTrace } from "../logic/arrayPresentation.js";
import { parseNumber, parseNumbers } from "../logic/validation.js";
import "../styles/array-learning.css";

export default function AlgorithmPage({ overrideSlug }) {
  const { slug: routeSlug } = useParams();
  const slug = overrideSlug || routeSlug;
  if (!arrayLearning[slug]) return <Navigate to="/" replace />;
  return <ArrayLearningPage key={slug} algorithm={algorithmMap[slug]} />;
}

function ArrayLearningPage({ algorithm }) {
  const slug = algorithm.slug,
    guide = arrayLearning[slug];
  const binary = slug === "binary-search",
    searching = algorithm.type === "searching";
  const [array, setArray] = useState(() => [
    ...inputPresets[binary ? "Already sorted" : "Small example"],
  ]);
  const [input, setInput] = useState(array.join(", "));
  const [target, setTarget] = useState(37),
    [draftTarget, setDraftTarget] = useState("37");
  const [inputError, setInputError] = useState("");
  const [currentStep, setCurrentStep] = useState(0),
    [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [showCode, setShowCode] = useState(false),
    [showHistory, setShowHistory] = useState(false),
    [showDetails, setShowDetails] = useState(false);
  const [allHistory, setAllHistory] = useState(false),
    [language, setLanguage] = useState("cpp");
  const steps = useMemo(
    () =>
      presentArrayTrace(buildSimulationSteps(array, algorithm, target), slug),
    [array, algorithm, target, slug],
  );
  const step = steps[currentStep] || steps[0];

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }
    const timer = setTimeout(
      () => setCurrentStep((value) => Math.min(value + 1, steps.length - 1)),
      speed,
    );
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  const select = (index) => {
    setIsPlaying(false);
    setCurrentStep(index);
  };
  const apply = (sort = false) => {
    try {
      let values = parseNumbers(input, { min: 1, max: 999, maxCount: 20 });
      if (values.length < 2)
        throw new Error("Enter 2–20 integers between 1 and 999.");
      const nextTarget = searching
        ? parseNumber(draftTarget, { min: 1, max: 999 })
        : target;
      if (
        binary &&
        values.some((value, index) => index > 0 && value < values[index - 1])
      ) {
        if (!sort)
          throw new Error(
            "Binary Search needs ascending input. Choose Sort and apply to sort these values explicitly.",
          );
        values = [...values].sort((a, b) => a - b);
      }
      setIsPlaying(false);
      setCurrentStep(0);
      setArray(values);
      setTarget(nextTarget);
      setInput(values.join(", "));
      setInputError("");
    } catch (error) {
      setInputError(error.message);
    }
  };
  const explanation =
    step.status === "Not Found"
      ? `Every candidate has been ruled out. ${target} is not in this array.`
      : step.explanation;

  return (
    <div className="array-learning">
      <nav className="learning-breadcrumb" aria-label="Algorithm navigation">
        <Link to="/">
          <ArrowLeft size={16} aria-hidden="true" /> Algorithm catalog
        </Link>
        <span>{searching ? "Searching" : "Sorting"}</span>
      </nav>
      <header className="learning-intro">
        <h1>{algorithm.title}</h1>
        <p>{guide.purpose}</p>
      </header>

      <details className="learning-input">
        <summary>
          <span>
            <strong>{array.length} values</strong>{" "}
            <span className="input-preview">{array.join(", ")}</span>
            {searching && <strong>Target: {target}</strong>}
            {binary && <span className="sorted-note">Sorted ascending</span>}
          </span>
          <span className="edit-label">Edit input</span>
        </summary>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            apply();
          }}
          className="input-editor"
        >
          <label>
            Array values
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              aria-describedby="array-input-help"
            />
          </label>
          {searching && (
            <label>
              Search target
              <input
                value={draftTarget}
                onChange={(event) => setDraftTarget(event.target.value)}
                inputMode="numeric"
              />
            </label>
          )}
          <p id="array-input-help">
            2–20 integers from 1 to 999, separated by commas or spaces. Apply
            starts a fresh, paused run.
            {binary &&
              " Indexes refer to the sorted array; duplicates may return any match."}
          </p>
          <div className="editor-actions">
            <button type="submit" className="primary-button">
              Apply input
            </button>
            {binary && (
              <button
                type="button"
                className="soft-button"
                onClick={() => apply(true)}
              >
                Sort and apply
              </button>
            )}
            <button
              type="button"
              className="soft-button"
              onClick={() => setInput(createRandomArray(8).join(", "))}
            >
              Randomize
            </button>
            <label className="preset-label">
              Example
              <select
                defaultValue=""
                onChange={(event) => {
                  if (event.target.value)
                    setInput(inputPresets[event.target.value].join(", "));
                }}
              >
                <option value="" disabled>
                  Choose example
                </option>
                {Object.keys(inputPresets).map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
          </div>
          {inputError && (
            <p role="alert" className="input-error">
              {inputError}
            </p>
          )}
        </form>
      </details>

      <div className={`learning-columns ${showCode ? "with-code" : ""}`}>
        <section
          className="learning-workspace"
          aria-label="Simulation workspace"
        >
          <ArrayStage
            step={step}
            algorithm={algorithm}
            target={target}
            scale={Math.max(...array, 1)}
            original={array}
          />
          <div
            className="current-explanation"
            aria-live={isPlaying ? "off" : "polite"}
            aria-atomic="true"
          >
            <span className="step-heading">{step.status}</span>
            <p>{explanation}</p>
          </div>
          <div className="learning-metrics">
            {arrayMetrics(step, slug).map(([label, value]) => (
              <span key={label}>
                {label} <strong>{value}</strong>
              </span>
            ))}
          </div>
          <PlaybackBar
            variant="learning"
            isPlaying={isPlaying}
            speed={speed}
            setSpeed={setSpeed}
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrevious={() => select(Math.max(0, currentStep - 1))}
            onNext={() => select(Math.min(steps.length - 1, currentStep + 1))}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReset={() => select(0)}
            onReplay={() => {
              setCurrentStep(0);
              setIsPlaying(true);
            }}
          />
        </section>
        {showCode && (
          <aside className="learning-code" aria-label="Code panel">
            <label>
              Code view
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option value="cpp">C++</option>
                <option value="pseudo">Pseudocode</option>
              </select>
            </label>
            {language === "cpp" ? (
              <CodeViewer algorithm={algorithm} step={step} clean />
            ) : (
              <div className="pseudocode">
                <h2>Pseudocode</h2>
                <pre>{guide.pseudo}</pre>
                <p>
                  Overview of this implementation. Choose C++ to follow the
                  current statement.
                </p>
              </div>
            )}
          </aside>
        )}
      </div>

      <section className="learning-tools" aria-label="Optional learning tools">
        <div className="tool-buttons">
          <button
            className="soft-button"
            aria-expanded={showCode}
            onClick={() => setShowCode((value) => !value)}
          >
            <Code2 size={17} aria-hidden="true" />
            {showCode ? "Hide code" : "Show code"}
          </button>
          <button
            className="soft-button"
            aria-expanded={showHistory}
            onClick={() => setShowHistory((value) => !value)}
          >
            <History size={17} aria-hidden="true" />
            History
          </button>
          <button
            className="soft-button"
            aria-expanded={showDetails}
            onClick={() => setShowDetails((value) => !value)}
          >
            <SlidersHorizontal size={17} aria-hidden="true" />
            Details
          </button>
        </div>
        {showHistory && (
          <div className="learning-history">
            <ExecutionSteps
              steps={steps}
              currentStep={currentStep}
              onStepClick={select}
              compact
              full={allHistory}
            />
            <button
              className="soft-button"
              onClick={() => setAllHistory((value) => !value)}
            >
              {allHistory ? "Show nearby steps" : "Show full history"}
            </button>
          </div>
        )}
        {showDetails && (
          <div className="learning-details">
            <StatsPanel
              step={step}
              totalSteps={steps.length}
              currentStep={currentStep}
              showExplanation={false}
            />
            <p>
              Progress measures completed trace steps, not the proportion of
              sorted values.
            </p>
          </div>
        )}
      </section>

      <details className="learning-guide">
        <summary>Algorithm guide & complexity</summary>
        <div>
          <h2>How this version works</h2>
          <p>{guide.variant}</p>
          <p>{guide.note}</p>
          <ComplexitySummary algorithm={algorithm} />
        </div>
      </details>
    </div>
  );
}
