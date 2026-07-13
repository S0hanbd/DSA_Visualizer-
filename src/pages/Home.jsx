import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpDown,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  GitFork,
  Grid,
  Layers,
  Link,
  MoreHorizontal,
  Network,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AlgorithmCard from "../components/AlgorithmCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { algorithms } from "../data/algorithms.js";
import { buildBubbleSortSteps } from "../logic/bubbleSortSimulation.js";

const categoryOptions = [
  { name: "All", label: "All", icon: Grid },
  { name: "Sorting", label: "Sorting", icon: ArrowUpDown },
  { name: "Searching", label: "Searching", icon: Search },
  { name: "Linked List", label: "Linked List", icon: Link },
  { name: "Stack", label: "Stack", icon: Layers },
  { name: "Queue", label: "Queue", icon: RefreshCw },
  { name: "Tree", label: "Tree", icon: GitFork },
  { name: "Graph", label: "Graph", icon: Network },
  { name: "Other", label: "Other", icon: MoreHorizontal },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);

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
        {/* Card 1: Live Bubble Sort Preview */}
        <motion.div
          {...rise(0.05)}
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

        {/* Card 2: Award / Graph Orb Tile */}
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

        {/* Card 3: Headline Tile */}
        <motion.div
          {...rise(0.1)}
          className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/60 p-8 border border-slate-200/80 dark:border-slate-800/80 lg:col-span-7 lg:row-span-2 min-h-[320px] flex flex-col justify-between shadow-lg"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live simulations
            </span>
            <h1 className="mt-6 font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-black leading-[0.95] tracking-tight text-slate-900 dark:text-white">
              SIMULATE<br />ALGORITHMS<br />
              <span className="text-slate-400 dark:text-slate-600">IN REAL TIME.</span>
            </h1>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <RotatingBadge />
              <p className="max-w-md text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Interactive frontend lab for learning data structures & algorithms through beautiful step-by-step state animations.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Wavy Pattern Card */}
        <motion.div
          {...rise(0.2)}
          className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-6 lg:col-span-3 min-h-[240px] flex flex-col justify-between shadow-lg"
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
          className="rounded-3xl bg-slate-900 dark:bg-slate-950 border border-slate-850 p-6 text-white lg:col-span-2 min-h-[240px] flex flex-col justify-between shadow-lg"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">/stats</span>
          <div>
            <p className="font-display text-5xl font-black">
              <AnimatedCounter target={35} duration={2000} />+
            </p>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">interactive simulations across 11 key computer science topics</p>
          </div>
        </motion.div>

        {/* Card 6: Topics / Category Console Card */}
        <motion.div
          {...rise(0.3)}
          className="rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 p-6 lg:col-span-7 shadow-lg flex flex-col justify-between"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              Explore Topics
            </h2>
            <span className="text-[10px] font-mono text-slate-450 dark:text-slate-500">
              Select category to filter
            </span>
          </div>

          {/* Search Console Input */}
          <div className="mb-4 w-full">
            <SearchBar value={query} onChange={setQuery} placeholder="Search..." />
          </div>

          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((opt) => {
              const isActive = selectedCategory === opt.name;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.name}
                  onClick={() => {
                    setSelectedCategory(opt.name);
                    setShowAll(false);
                  }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold tracking-wide transition duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 dark:bg-cyan-500 dark:text-slate-950"
                      : "bg-slate-50 text-slate-600 border border-slate-200/50 hover:bg-slate-100 hover:text-blue-600 dark:bg-slate-800/40 dark:text-slate-350 dark:border-slate-800/30 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
                  }`}
                >
                  <Icon size={13} className={isActive ? "text-white dark:text-slate-950" : "text-blue-600 dark:text-cyan-400"} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
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

