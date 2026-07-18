import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useSearchFilter } from "../hooks/useSearchFilter.jsx";
import AlgorithmCard from "../components/AlgorithmCard.jsx";
import { algorithms } from "../data/algorithms.js";
import { buildBubbleSortSteps } from "../logic/bubbleSortSimulation.js";

export default function Home() {
  const {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    showAll,
    setShowAll,
    isSticky,
    setIsSticky,
  } = useSearchFilter();

  const filtered = useMemo(() => {
    return algorithms.filter((algorithm) => {
      // 1. Category Filter
      let matchesCategory = true;
      if (selectedCategory !== "All") {
        if (selectedCategory === "Tree") {
          matchesCategory = algorithm.category === "Trees";
        } else if (selectedCategory === "Graph") {
          matchesCategory = algorithm.category === "Graphs";
        } else if (selectedCategory === "Other") {
          const mainCategories = ["Sorting", "Searching", "Linked List", "Stack", "Queue", "Trees", "Graphs"];
          matchesCategory = !mainCategories.includes(algorithm.category);
        } else {
          matchesCategory = algorithm.category === selectedCategory;
        }
      }

      // 2. Search Query Filter
      const matchesQuery = `${algorithm.title} ${algorithm.category}`
        .toLowerCase()
        .includes(query.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  }, [query, selectedCategory]);

  const visibleAlgorithms = useMemo(() => {
    if (query || selectedCategory !== "All") return filtered;
    return showAll ? filtered : filtered.slice(0, 12);
  }, [query, selectedCategory, filtered, showAll]);

  const generateRandomPreview = useCallback(() => {
    const uniqueSet = new Set();
    while (uniqueSet.size < 7) {
      uniqueSet.add(Math.floor(Math.random() * 80) + 15);
    }
    return Array.from(uniqueSet);
  }, []);

  const [loopId, setLoopId] = useState(0);
  const [previewArray, setPreviewArray] = useState(() => generateRandomPreview());
  const previewSteps = useMemo(() => buildBubbleSortSteps(previewArray), [previewArray]);
  const [previewStepIdx, setPreviewStepIdx] = useState(0);

  useEffect(() => {
    const isLastStep = previewStepIdx >= previewSteps.length - 1;
    const delay = isLastStep ? 2400 : 800;
    const timer = setTimeout(() => {
      setPreviewStepIdx((prev) => {
        if (prev >= previewSteps.length - 1) {
          setPreviewArray(generateRandomPreview());
          setLoopId((id) => id + 1);
          return 0;
        }
        return prev + 1;
      });
    }, delay);
    return () => clearTimeout(timer);
  }, [previewStepIdx, previewSteps, generateRandomPreview]);

  const currentPreviewStep = previewSteps[previewStepIdx] || previewSteps[0];

  const reduce = useReducedMotion();
  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <div className="mx-auto w-full px-4 py-8 max-w-[1400px]">
      {/* Hero Bento Grid */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
        {/* Card 1: Headline Tile (Primary Value Proposition) */}
        <motion.div
          {...rise(0.05)}
          className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/60 p-8 border border-slate-200/80 dark:border-slate-800/80 md:col-span-6 lg:col-span-7 lg:row-span-2 min-h-[320px] flex flex-col justify-between shadow-lg"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live simulations
            </span>
            <h1 className="mt-6 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-black leading-[0.95] tracking-tight text-slate-900 dark:text-white">
              <WordCycleLetterSwap /><br />ALGORITHMS<br />
              <span className="block mt-2 text-slate-600 dark:text-slate-400">
                <TypewriterText text="IN REAL TIME." />
              </span>
            </h1>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <RotatingBadge />
              <p className="max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Interactive frontend lab for learning data structures & algorithms through beautiful step-by-step state animations.
              </p>
            </div>
            <div className="shrink-0">
              <a
                href="#algorithms"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-blue-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 shadow-md shadow-blue-600/20 dark:shadow-cyan-500/10"
              >
                <span>Start Visualizing Free</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Live Bubble Sort Preview */}
        <motion.div
          {...rise(0.1)}
          className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white md:col-span-3 lg:col-span-3 lg:row-span-2 min-h-[320px] flex flex-col justify-between shadow-lg border border-slate-800 dark:bg-slate-950"
        >
          <div className="flex items-start justify-between">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 backdrop-blur">
              <Plus className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
              /sorting
            </span>
          </div>

          <div className="my-6 flex h-36 items-end justify-center gap-2.5 px-2">
            {currentPreviewStep.array.map((value, index) => {
              const isComparing = currentPreviewStep.comparing?.includes(index);
              const isSwapping = currentPreviewStep.swapping?.includes(index);
              const isSorted = currentPreviewStep.sorted?.includes(index);

              let colorClass = "bg-indigo-500";
              if (isSwapping) {
                colorClass = "bg-rose-500";
              } else if (isComparing) {
                colorClass = "bg-amber-400";
              } else if (isSorted) {
                colorClass = "bg-emerald-500";
              }

              return (
                <motion.div
                  key={`${loopId}-${value}`}
                  layout
                  animate={{ height: `${value}%` }}
                  transition={{ type: "spring", stiffness: 180, damping: 20 }}
                  className={`flex-1 min-w-[8px] max-w-[28px] rounded-t-lg shadow-md ${colorClass}`}
                />
              );
            })}
          </div>

          <p className="font-display text-xs uppercase tracking-[0.2em] text-white/70">
            Build your<br />intuition
          </p>
        </motion.div>

        {/* Card 3: Award / Graph Orb Tile */}
        <motion.div
          {...rise(0.15)}
          className="relative overflow-hidden rounded-3xl bg-emerald-500 p-6 md:col-span-3 lg:col-span-2 lg:row-span-2 min-h-[320px] flex flex-col items-center justify-between text-center shadow-lg"
        >
          <div className="flex flex-col items-center">
            <div className="mt-2 grid h-10 w-10 place-items-center rounded-lg bg-slate-900 text-white dark:bg-slate-950">
              <Sparkles className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-900 font-bold">
              Algorithm<br />award 2026
            </p>
          </div>
          <GraphOrb />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-800/80 font-bold">
            /graphs
          </span>
        </motion.div>

        {/* Card 4: Wavy Pattern Card */}
        <motion.div
          {...rise(0.2)}
          className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-6 md:col-span-3 lg:col-span-3 min-h-[240px] flex flex-col justify-between shadow-lg"
        >
          <WavePattern />
          <div className="relative flex h-full flex-col justify-between z-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              /graph-theory
            </span>
            
            {/* Real Tree running In-Order Traversal */}
            <div className="my-2 flex justify-center items-center">
              <TreeTraversalSimulation />
            </div>

            <p className="font-display text-2xl font-bold leading-tight text-slate-900 dark:text-white">
              Trace the<br />network flow.
            </p>
          </div>
        </motion.div>

        {/* Card 5: Stats Card */}
        <motion.div
          {...rise(0.25)}
          className="rounded-3xl bg-slate-900 dark:bg-slate-950 border border-slate-850 p-6 text-white md:col-span-3 lg:col-span-2 min-h-[240px] flex flex-col justify-between shadow-lg"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">/stats</span>
          <div>
            <p className="font-display text-5xl font-black">
              <AnimatedCounter target={35} duration={2000} />+
            </p>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">interactive simulations across 11 key computer science topics</p>
          </div>
        </motion.div>

        {/* Card 6: Platform Features & Engagement Card */}
        <motion.div
          id="explore-topics-card"
          {...rise(0.3)}
          className="rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-6 md:col-span-6 lg:col-span-7 shadow-lg flex flex-col justify-between min-h-[240px]"
        >
          <div className="flex flex-col h-full justify-between">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Interactive Lab Features
              </h2>
              <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Fully Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
              <div className="flex gap-3 items-start">
                <span className="p-2 rounded-xl bg-blue-50 dark:bg-slate-800/60 text-blue-600 dark:text-cyan-400">
                  <Plus size={16} />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">State Animations</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Watch values swap, compare, and update in beautiful step-by-step visual transitions.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="p-2 rounded-xl bg-emerald-50 dark:bg-slate-800/60 text-emerald-600 dark:text-emerald-400">
                  <Plus size={16} />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Execution Console</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Inspect memory state changes, execution stack frames, and explanation logs.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="p-2 rounded-xl bg-indigo-50 dark:bg-slate-800/60 text-indigo-600 dark:text-indigo-400">
                  <Plus size={16} />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Custom Datasets</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Build custom graphs, edit array elements, or load complex input samples.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="p-2 rounded-xl bg-amber-50 dark:bg-slate-800/60 text-amber-600 dark:text-amber-400">
                  <Plus size={16} />
                </span>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Complexity Metrics</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Compare theoretical asymptotic bounds with actual execution steps.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Ready to start? Use the navigation bar to search or filter.</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Algorithms Result Listing Grid */}
      <section id="algorithms" className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="muted-label">{query || selectedCategory !== "All" ? "Search Results" : "Featured Algorithms"}</p>
            <h2 className="mt-2 text-3xl font-black">
              {query || selectedCategory !== "All" ? "Matching Visualizations" : "Start Learning"}
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleAlgorithms.map((algorithm) => (
            <AlgorithmCard key={algorithm.slug} algorithm={algorithm} />
          ))}
        </div>

        {!query && selectedCategory === "All" && filtered.length > 12 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="soft-button"
            >
              {showAll ? (
                <>
                  Show Less <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Show More <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------------- Helper Visual Components ---------------- */

function GraphOrb() {
  return (
    <div className="relative mx-auto my-2 grid h-40 w-40 place-items-center rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] dark:bg-slate-900">
      <svg viewBox="0 0 160 160" className="h-full w-full">
        <defs>
          <linearGradient id="edge" x1="0" x2="1">
            <stop offset="0" stopColor="#0f172a" stopOpacity="0.1" />
            <stop offset="1" stopColor="#0f172a" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        {[
          [40, 55, 110, 45],
          [40, 55, 80, 100],
          [110, 45, 130, 105],
          [80, 100, 130, 105],
          [80, 100, 55, 130],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#edge)" strokeWidth="1.5" />
        ))}
        {[
          [40, 55, "#3b82f6"],
          [110, 45, "#1e293b"],
          [80, 100, "#f59e0b"],
          [130, 105, "#ec4899"],
          [55, 130, "#10b981"],
        ].map(([cx, cy, c], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={i === 2 ? 9 : 6}
            fill={c}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 220, damping: 14 }}
          />
        ))}
      </svg>
    </div>
  );
}

function WavePattern() {
  return (
    <svg
      viewBox="0 0 300 240"
      className="absolute inset-0 h-full w-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <path
          key={i}
          d={`M -20 ${40 + i * 16} C 60 ${20 + i * 18}, 180 ${80 + i * 14}, 340 ${30 + i * 18}`}
          fill="none"
          stroke="#3b82f6"
          strokeOpacity={0.09 + i * 0.015}
          strokeWidth="1.2"
        />
      ))}
    </svg>
  );
}

function RotatingBadge() {
  const text = "EXPLORE • SIMULATE • LEARN • ";
  return (
    <motion.div
      className="relative grid h-16 w-16 place-items-center shrink-0 select-none"
      animate={{ rotate: 360 }}
      transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <path id="circlePath" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="font-mono text-[8px] font-bold fill-slate-800 dark:fill-slate-300" letterSpacing="1.8">
          <textPath href="#circlePath">{text.repeat(3)}</textPath>
        </text>
      </svg>
      <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-200">
        <Plus className="h-3 w-3" />
      </span>
    </motion.div>
  );
}

function TreeTraversalSimulation() {
  const traversalOrder = [
    { id: 1, label: "1", x: 25, y: 65 },
    { id: 2, label: "2", x: 50, y: 40 },
    { id: 3, label: "3", x: 75, y: 65 },
    { id: 4, label: "4", x: 100, y: 15 },
    { id: 5, label: "5", x: 125, y: 65 },
    { id: 6, label: "6", x: 150, y: 40 },
    { id: 7, label: "7", x: 175, y: 65 },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % traversalOrder.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const activeNode = traversalOrder[activeIndex];

  return (
    <div className="relative w-full max-w-[200px] h-20">
      <svg viewBox="0 0 200 80" className="w-full h-full">
        {/* Draw Edges */}
        <line x1={100} y1={15} x2={50} y2={40} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5" />
        <line x1={100} y1={15} x2={150} y2={40} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5" />
        <line x1={50} y1={40} x2={25} y2={65} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5" />
        <line x1={50} y1={40} x2={75} y2={65} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5" />
        <line x1={150} y1={40} x2={125} y2={65} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5" />
        <line x1={150} y1={40} x2={175} y2={65} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5" />

        {/* Draw Nodes */}
        {traversalOrder.map((node) => {
          const isActive = activeNode.id === node.id;
          return (
            <g key={node.id}>
              {isActive && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={12}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={8.5}
                className={`transition-colors duration-300 ${
                  isActive
                    ? "fill-blue-600 dark:fill-cyan-400 stroke-blue-600 dark:stroke-cyan-400"
                    : "fill-white dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-700"
                }`}
                strokeWidth="1.5"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-[8px] font-bold font-mono select-none transition-colors duration-300 ${
                  isActive
                    ? "fill-white dark:fill-slate-950"
                    : "fill-slate-600 dark:fill-slate-400"
                }`}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuad easing
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.floor(easeProgress * target);
      setCount(currentCount);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  const formattedCount = count < 10 ? `0${count}` : `${count}`;

  return <span>{formattedCount}</span>;
}

function TypewriterText({ text }) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150,
      }
    }
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="inline-block text-slate-500 dark:text-slate-400"
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block"
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

function mapEaseToCSS(ease) {
  if (Array.isArray(ease) && ease.length === 4) {
    return `cubic-bezier(${ease.join(",")})`;
  }
  switch (ease) {
    case "linear":
      return "linear";
    case "easeIn":
      return "ease-in";
    case "easeOut":
      return "ease-out";
    case "easeInOut":
      return "ease-in-out";
    case "circIn":
      return "cubic-bezier(0.6, 0.04, 0.98, 0.335)";
    case "circOut":
      return "cubic-bezier(0.075, 0.82, 0.165, 1)";
    case "circInOut":
      return "cubic-bezier(0.785, 0.135, 0.15, 0.86)";
    case "backIn":
      return "cubic-bezier(0.6, -0.28, 0.735, 0.045)";
    case "backOut":
      return "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    case "backInOut":
      return "cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    default:
      return "ease-in-out";
  }
}

function WordCycleLetterSwap() {
  const wordList = ["SIMULATE", "LEARN", "UNDERSTAND"];
  
  const morph = 0.8; // morph transition duration in seconds
  const hold = 1.6;  // hold duration in seconds
  const easeCSS = mapEaseToCSS("easeInOut");

  const rawId = useId();
  const safeId = rawId.replace(/[:]/g, "");
  const filterId = `tm-thr-${safeId}`;
  const animName = `tm-rot-${safeId}`;

  const count = wordList.length;
  const slot = morph + hold;
  const cycle = slot * count;

  const pct = (s) => Math.min(100, (s / cycle) * 100).toFixed(4);
  const mIn = pct(morph);
  const mHold = pct(morph + hold);
  const mOut = pct(2 * morph + hold);

  const keyframes = `
    @keyframes ${animName} {
      0% {
        opacity: 0;
        filter: blur(15px);
        transform: translateY(-50%) scale(0.8);
      }
      ${mIn}% {
        opacity: 1;
        filter: blur(0px);
        transform: translateY(-50%) scale(1);
      }
      ${mHold}% {
        opacity: 1;
        filter: blur(0px);
        transform: translateY(-50%) scale(1);
      }
      ${mOut}%, 100% {
        opacity: 0;
        filter: blur(15px);
        transform: translateY(-50%) scale(1.2);
      }
    }
  `;

  const longest = wordList.reduce(
    (acc, w) => (w.length > acc.length ? w : acc),
    ""
  );

  return (
    <span
      className="relative inline-flex overflow-visible select-none"
      style={{ verticalAlign: "bottom" }}
    >
      <style>{keyframes}</style>

      <svg
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 25 -9"
              result="goo"
            />
            <feComposite
              in="SourceGraphic"
              in2="goo"
              operator="atop"
            />
          </filter>
        </defs>
      </svg>

      <span
        style={{
          position: "relative",
          filter: `url(#${filterId})`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "flex-start",
          lineHeight: 1.2,
          minHeight: "1.2em",
        }}
      >
        {/* Width anchor: longest word reserves space so layout never shifts */}
        <span
          style={{
            visibility: "hidden",
            whiteSpace: "nowrap",
            display: "inline-block",
          }}
        >
          {longest || " "}
        </span>

        {wordList.map((word, i) => (
          <span
            key={`${word}-${i}`}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              opacity: 0,
              whiteSpace: "nowrap",
              animation: `${animName} ${cycle}s ${(slot * i).toFixed(3)}s infinite ${easeCSS}`,
              willChange: "opacity, filter, transform",
            }}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}

