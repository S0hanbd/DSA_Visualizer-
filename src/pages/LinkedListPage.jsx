import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useIsPresent, motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar.jsx";
import CodeViewer from "../components/CodeViewer.jsx";
import ComplexityCard from "../components/ComplexityCard.jsx";
import LinkedListVisualization from "../components/LinkedListVisualization.jsx";
import { algorithmMap } from "../data/algorithms.js";
import {
  buildInsertHeadSteps,
  buildInsertTailSteps,
  buildInsertAtSteps,
  buildDeleteSteps,
  buildSearchSteps,
  buildInitialStep,
} from "../logic/linkedListInteractive.js";

// ─── helpers ─────────────────────────────────────────────────────────────────
const SLUGS = {
  "singly-linked-list": "linked-list",
  "doubly-linked-list": "doubly-list",
  "circular-linked-list": "circular-list",
};

const SPEED_LABELS = { 900: "Slow", 480: "Normal", 200: "Fast", 80: "Turbo" };
const RESULT_STYLE = {
  found:   "border-emerald-500/50 bg-emerald-900/20 text-emerald-300",
  deleted: "border-rose-500/50 bg-rose-900/20 text-rose-300",
  "not-found": "border-amber-500/50 bg-amber-900/20 text-amber-300",
};

function parseList(str) {
  return str
    .split(/[,\s]+/)
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n >= 0 && n <= 9999)
    .slice(0, 16);
}

// ─── operation button ─────────────────────────────────────────────────────────
function OpBtn({ label, icon, onClick, disabled }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-2xl bg-slate-800 px-4 py-2.5 text-sm font-black text-white shadow transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100"
    >
      <span>{icon}</span>
      {label}
    </motion.button>
  );
}

// ─── speed control ────────────────────────────────────────────────────────────
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

// ─── playback bar ─────────────────────────────────────────────────────────────
function Playback({ isPlaying, onPlay, onPause, onPrev, onNext, onReset, speed, setSpeed, current, total }) {
  return (
    <div className="neo-panel flex flex-wrap items-center gap-3 p-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          ⏮
        </button>
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-black text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={onNext}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          ⏭
        </button>
        <button
          onClick={onReset}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 text-xs font-black text-slate-700 shadow transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          ↺ Reset
        </button>
      </div>
      <SpeedControl speed={speed} setSpeed={setSpeed} />
      <div className="ml-auto text-xs font-bold text-slate-400">
        Step {current + 1} / {total}
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function LinkedListPage({ overrideSlug }) {
  const { slug: paramSlug } = useParams();
  const location = useLocation();
  const isPresent = useIsPresent();

  // Static routes don't carry a :slug param, so fall back to overrideSlug or the last path segment
  const rawSlug = overrideSlug || paramSlug || location.pathname.split("/").filter(Boolean).pop();

  const activeSlugRef = useRef(rawSlug);
  if (isPresent && rawSlug && rawSlug !== activeSlugRef.current) activeSlugRef.current = rawSlug;
  const activeSlug = activeSlugRef.current || rawSlug;

  const algorithm = algorithmMap[activeSlug];
  const structure = SLUGS[activeSlug] ?? "linked-list";

  // ── list state (the "live" committed list after each completed operation) ──
  const [liveList, setLiveList] = useState([42, 18, 73]);
  const [listInput, setListInput] = useState("42, 18, 73");
  const [listInputError, setListInputError] = useState("");

  // ── operation input ────────────────────────────────────────────────────────
  const [opValue, setOpValue] = useState("");
  const [opIndex, setOpIndex] = useState("");
  const [opError, setOpError] = useState("");

  // ── animation state ────────────────────────────────────────────────────────
  const [steps, setSteps] = useState(() => buildInitialStep([42, 18, 73], SLUGS[rawSlug] ?? "linked-list"));
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(480);

  const step = steps[currentStep] || steps[0];
  const result = step?.markers?.result;

  // ── reset on route change ──────────────────────────────────────────────────
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSteps(buildInitialStep(liveList, SLUGS[activeSlug] ?? "linked-list"));
  }, [location.pathname]);

  // ── auto-play ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || !isPresent) return;
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      // Commit the final list state when animation finishes
      if (steps[steps.length - 1]?.array) {
        setLiveList([...steps[steps.length - 1].array]);
      }
      return;
    }
    const t = window.setTimeout(() => setCurrentStep((s) => Math.min(s + 1, steps.length - 1)), speed);
    return () => window.clearTimeout(t);
  }, [currentStep, isPlaying, speed, steps, isPresent]);

  if (!algorithm) return <Navigate to="/" replace />;

  // ── run operation ──────────────────────────────────────────────────────────
  const runOp = useCallback((builderFn, isInsertAt = false) => {
    if (isPlaying) return;
    const val = parseInt(opValue.trim(), 10);
    if (isNaN(val) || val < 0 || val > 9999) {
      setOpError("Please enter a valid positive number.");
      return;
    }
    
    let newSteps;
    if (isInsertAt) {
      const idx = parseInt(opIndex.trim(), 10);
      if (isNaN(idx) || idx < 0 || idx > liveList.length) {
        setOpError(`Index must be between 0 and ${liveList.length}.`);
        return;
      }
      newSteps = builderFn(liveList, val, idx, structure);
    } else {
      newSteps = builderFn(liveList, val, structure);
    }

    if (newSteps.length > 0) {
      setSteps(newSteps);
      setCurrentStep(0);
      setIsPlaying(true);
      const finalState = newSteps[newSteps.length - 1];
      if (finalState.array) setLiveList(finalState.array);
    }
    setOpValue("");
    setOpIndex("");
    setOpError("");
  }, [isPlaying, opValue, opIndex, liveList, structure]);

  // ── set list ───────────────────────────────────────────────────────────────
  const handleSetList = () => {
    const parsed = parseList(listInput);
    if (parsed.length === 0) { setListInputError("Enter at least 1 number."); return; }
    setListInputError("");
    setIsPlaying(false);
    setLiveList(parsed);
    setSteps(buildInitialStep(parsed, structure));
    setCurrentStep(0);
  };

  // ── advance/retreat step, committing live list if we go to last step ───────
  const goNext = () => {
    const next = Math.min(steps.length - 1, currentStep + 1);
    setCurrentStep(next);
    if (next === steps.length - 1) setLiveList([...steps[next].array]);
  };
  const goPrev = () => setCurrentStep((s) => Math.max(0, s - 1));
  const goReset = () => { setCurrentStep(0); setIsPlaying(false); };

  // ── complexities ───────────────────────────────────────────────────────────
  const c = algorithm.complexities;

  return (
    <div className="mx-auto flex w-full gap-6 px-4 py-8">
      <Sidebar />

      <div className="min-w-0 flex-1 space-y-5">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <section className="neo-panel p-6">
          <p className="muted-label">{algorithm.category}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-black sm:text-5xl">{algorithm.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                {algorithm.description}
              </p>
            </div>
            {/* Compact complexity badges */}
            <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest">
              {c.best && c.best !== "—" && (
                <span className="rounded-full border border-slate-300 bg-slate-200 px-2 py-1 text-slate-900 dark:border-slate-600 dark:bg-slate-300">
                  Best {c.best}
                </span>
              )}
              {c.average && c.average !== "—" && (
                <span className="rounded-full border border-slate-300 bg-slate-200 px-2 py-1 text-slate-900 dark:border-slate-600 dark:bg-slate-300">
                  Avg {c.average}
                </span>
              )}
              {c.worst && (
                <span className="rounded-full border border-slate-300 bg-slate-200 px-2 py-1 text-slate-900 dark:border-slate-600 dark:bg-slate-300">
                  Worst {c.worst}
                </span>
              )}
              {c.space && (
                <span className="rounded-full border border-slate-300 bg-slate-200 px-2 py-1 text-slate-900 dark:border-slate-600 dark:bg-slate-300">
                  Space {c.space}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ── Step explanation strip ────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className={`neo-panel flex items-center gap-4 px-5 py-4 ${result ? `border ${RESULT_STYLE[result]}` : ""}`}
          >
            <span className="text-2xl">
              {result === "found" ? "✅" : result === "deleted" ? "🗑️" : result === "not-found" ? "❌" : "📋"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{step.status}</p>
              <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-800 dark:text-slate-200">
                {step.explanation}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Playback controls ─────────────────────────────────────────── */}
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

        {/* ── Visualization ─────────────────────────────────────────────── */}
        <LinkedListVisualization step={step} algorithm={algorithm} />

        {/* ── Controls ──────────────────────────────────────────────────── */}
        <section className="neo-panel space-y-5 p-5">
          {/* List setup */}
          <div>
            <p className="muted-label mb-3">List Setup</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="e.g. 42, 18, 73, 29"
                value={listInput}
                onChange={(e) => setListInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetList()}
                className="flex-1 capsule-input min-w-0"
              />
              <OpBtn label="Set List" icon="📋" onClick={handleSetList} color="blue" />
            </div>
            {listInputError && (
              <p className="mt-1 text-xs font-bold text-red-500">{listInputError}</p>
            )}
          </div>

          {/* Operation input */}
          <div>
            <p className="muted-label mb-3">Operations — Enter a value and choose an action</p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="number"
                  placeholder="Enter a value (e.g. 25)"
                  value={opValue}
                  onChange={(e) => { setOpValue(e.target.value); setOpError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && runOp(buildInsertHeadSteps)}
                  className="flex-1 capsule-input sm:max-w-48"
                />
                <input
                  type="number"
                  placeholder="Index (Optional)"
                  value={opIndex}
                  onChange={(e) => { setOpIndex(e.target.value); setOpError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && runOp(buildInsertAtSteps, true)}
                  className="flex-1 capsule-input sm:max-w-40"
                />
                {opError && (
                  <p className="text-xs font-bold text-red-500">{opError}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <OpBtn
                  label="Insert at Head"
                  icon="⬆"
                  color="green"
                  onClick={() => runOp(buildInsertHeadSteps)}
                />
                <OpBtn
                  label="Insert at Tail"
                  icon="⬇"
                  color="blue"
                  onClick={() => runOp(buildInsertTailSteps)}
                />
                <OpBtn
                  label="Insert at Index"
                  icon="➡"
                  color="emerald"
                  onClick={() => runOp(buildInsertAtSteps, true)}
                />
                <OpBtn
                  label="Search"
                  icon="🔍"
                  color="violet"
                  onClick={() => runOp(buildSearchSteps)}
                />
                <OpBtn
                  label="Delete"
                  icon="🗑️"
                  color="red"
                  onClick={() => runOp(buildDeleteSteps)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Code viewer ───────────────────────────────────────────────── */}
        <CodeViewer
          code={algorithm.code}
          activeLine={step.line}
          language={algorithm.language ?? "javascript"}
        />

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
