import { motion } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, Gauge, Layers, PlayCircle, Search, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AlgorithmCard from "../components/AlgorithmCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { algorithms, categories } from "../data/algorithms.js";
import { buildBubbleSortSteps } from "../logic/bubbleSortSimulation.js";

const features = [
  ["Synchronized C++", "Line highlighting follows the active simulation step.", BookOpen],
  ["Animated Learning", "Soft motion helps students see comparisons, swaps, and progress.", PlayCircle],
  ["Portfolio Ready", "Responsive neumorphic UI with light and dark themes.", Sparkles],
  ["Fast Exploration", "Search and sidebar navigation keep every algorithm close.", Gauge],
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const filtered = useMemo(
    () => algorithms.filter((algorithm) => `${algorithm.title} ${algorithm.category}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const visibleAlgorithms = useMemo(() => {
    if (query) return filtered;
    return showAll ? algorithms : algorithms.slice(0, 12);
  }, [query, filtered, showAll]);

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
      <section className="flex min-h-[70vh] flex-col justify-center gap-10 overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_18%_20%,rgba(37,99,235,.16),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(16,185,129,.13),transparent_28%)] py-10 dark:bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,.15),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(16,185,129,.12),transparent_28%)]">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="px-2 sm:px-8">
            <p className="muted-label">Interactive algorithm studio</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
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

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="muted-label">{query ? "Search Algorithm" : "Explore Algorithms"}</p>
            <h2 className="mt-2 text-3xl font-black">{query ? "Matching Results" : "Start with these"}</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleAlgorithms.map((algorithm) => (
            <AlgorithmCard key={algorithm.slug} algorithm={algorithm} />
          ))}
        </div>
        {!query && algorithms.length > 12 && (
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

      <section className="mt-12 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="neo-panel p-6">
          <p className="muted-label">Categories</p>
          <h2 className="mt-2 text-3xl font-black">Complete DSA map</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <div key={category.name} className="neo-inset p-4">
                <div className="flex items-center gap-3">
                  <Layers size={19} className="text-blue-600 dark:text-cyan-300" />
                  <p className="font-black">{category.name}</p>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{category.algorithms.length} algorithms</p>
              </div>
            ))}
          </div>
        </div>

        <div className="neo-panel p-6">
          <p className="muted-label">Features</p>
          <h2 className="mt-2 text-3xl font-black">Built for focused learning</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {features.map(([title, body, Icon]) => (
              <div key={title} className="rounded-3xl bg-white/55 p-5 dark:bg-slate-900/70">
                <Icon size={22} className="text-blue-600 dark:text-cyan-300" />
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
