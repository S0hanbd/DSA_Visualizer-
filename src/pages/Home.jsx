import { motion } from "framer-motion";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  GitFork,
  Grid,
  Layers,
  Link,
  MoreHorizontal,
  Network,
  RefreshCw,
  Search,
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

  return (
    <div className="mx-auto w-full px-4 py-10">
      <section className="relative flex min-h-[70vh] flex-col justify-center gap-10 overflow-hidden rounded-[36px] py-10">
        {/* Technical Blueprint Indicators */}
        <div className="pointer-events-none absolute inset-0 select-none">
          {/* Corner Brackets */}
          <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-slate-300 dark:border-slate-800" />
          <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-slate-300 dark:border-slate-800" />
          <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-slate-300 dark:border-slate-800" />
          <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-slate-300 dark:border-slate-800" />

          {/* Grid Labels */}
          <span className="absolute left-10 top-8 font-mono text-[9px] font-bold tracking-[0.2em] text-slate-400/60 dark:text-slate-500/50">
            B7 STATE REPORT // LINK RSD-GT
          </span>
          <span className="absolute right-12 top-8 flex items-center font-mono text-[9px] font-bold tracking-[0.2em] text-slate-400/60 dark:text-slate-500/50">
            <span>ID 009.3-3 [SYS_ACTIVE]</span>
            <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </span>
          <span className="absolute bottom-8 left-10 font-mono text-[9px] font-bold tracking-[0.2em] text-slate-400/60 dark:text-slate-500/50">
            LOC_COORDS // X_42.99 // Y_11.02
          </span>
          <span className="absolute bottom-8 right-12 font-mono text-[9px] font-bold tracking-[0.2em] text-slate-400/60 dark:text-slate-500/50">
            SCALE 1.0 // GRID_32px
          </span>
          
          {/* Blueprint Crosshairs/Plus Symbols */}
          <span className="absolute left-[30%] top-[18%] text-xs font-light text-slate-300 dark:text-slate-700/80">+</span>
          <span className="absolute right-[45%] bottom-[25%] text-xs font-light text-slate-300 dark:text-slate-700/80">+</span>
          <span className="absolute left-[15%] bottom-[15%] text-xs font-light text-slate-300 dark:text-slate-700/80">+</span>
          
          {/* Subtle Technical Diagonal Line Indicator */}
          <svg className="absolute right-[20%] top-[15%] h-24 w-24 text-slate-200 dark:text-slate-800" fill="none" viewBox="0 0 100 100">
            <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="3" fill="currentColor" />
          </svg>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="px-2 sm:px-8">
            <p className="muted-label">Interactive algorithm studio</p>
            <h1 className="text-3d-blueprint mt-5 max-w-4xl text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              DSA Visualizer
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A premium frontend learning dashboard for understanding data structures and algorithms through animated state changes, C++ code, and step-by-step explanations.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBar value={query} onChange={setQuery} placeholder="Search Bubble Sort, BFS, AVL..." />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, delay: 0.1 }} className="neo-panel mx-2 p-5 sm:mx-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Live Preview</h2>
              </div>
              <Search className="text-blue-600 dark:text-cyan-300" />
            </div>
            <div className="neo-inset mt-6 flex h-72 items-end justify-center gap-3 p-5">
              {currentPreviewStep.array.map((value, index) => {
                const isComparing = currentPreviewStep.comparing?.includes(index);
                const isSwapping = currentPreviewStep.swapping?.includes(index);
                const isSorted = currentPreviewStep.sorted?.includes(index);

                let colorClass = "bg-blue-500 dark:bg-cyan-400";
                if (isSwapping) {
                  colorClass = "bg-red-500";
                } else if (isComparing) {
                  colorClass = "bg-orange-400";
                } else if (isSorted) {
                  colorClass = "bg-emerald-500";
                }

                return (
                  <motion.div
                    key={`${loopId}-${value}`}
                    layout
                    animate={{ height: `${value}%` }}
                    transition={{ type: "spring", stiffness: 160, damping: 20 }}
                    className={`w-full max-w-12 rounded-t-2xl shadow-md ${colorClass}`}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Classification Buttons */}
      <div className="mt-10 flex flex-wrap justify-center gap-3 rounded-[28px] border border-white/70 bg-slate-100/50 p-4 shadow-neo-inset dark:border-slate-800/80 dark:bg-slate-900/40 dark:shadow-dark-inset">
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
              className={`flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-extrabold tracking-wide transition duration-300 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 dark:bg-cyan-400 dark:text-slate-950"
                  : "bg-white text-slate-600 hover:-translate-y-0.5 hover:text-blue-600 hover:shadow-neo dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-cyan-300"
              }`}
            >
              <Icon size={16} className={isActive ? "text-white dark:text-slate-950" : "text-blue-600 dark:text-cyan-400"} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="muted-label">{query || selectedCategory !== "All" ? "Search Algorithm" : "Explore Algorithms"}</p>
            <h2 className="mt-2 text-3xl font-black">
              {query || selectedCategory !== "All" ? "Matching Results" : "Start with these"}
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
