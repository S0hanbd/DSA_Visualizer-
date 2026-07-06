import { motion } from "framer-motion";
import { BookOpen, Gauge, Layers, PlayCircle, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import AlgorithmCard from "../components/AlgorithmCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { algorithms, categories } from "../data/algorithms.js";

const features = [
  ["Synchronized C++", "Line highlighting follows the active simulation step.", BookOpen],
  ["Animated Learning", "Soft motion helps students see comparisons, swaps, and progress.", PlayCircle],
  ["Portfolio Ready", "Responsive neumorphic UI with light and dark themes.", Sparkles],
  ["Fast Exploration", "Search and sidebar navigation keep every algorithm close.", Gauge],
];

export default function Home() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => algorithms.filter((algorithm) => `${algorithm.title} ${algorithm.category}`.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  const popular = algorithms.filter((algorithm) => ["bubble-sort", "binary-search", "bfs", "bst"].includes(algorithm.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
                <p className="muted-label">Live Preview</p>
                <h2 className="mt-1 text-2xl font-black">Bubble Sort</h2>
              </div>
              <Search className="text-blue-600 dark:text-cyan-300" />
            </div>
            <div className="neo-inset mt-6 flex h-72 items-end justify-center gap-3 p-5">
              {[38, 72, 28, 86, 54, 96, 44].map((value, index) => (
                <motion.div
                  key={value}
                  animate={{ height: `${value}%` }}
                  transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse", delay: index * 0.07 }}
                  className={`w-full max-w-12 rounded-t-2xl ${
                    index === 2 || index === 3
                      ? "bg-orange-400"
                      : index > 4
                        ? "bg-emerald-500"
                        : "bg-blue-500 dark:bg-cyan-400"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="muted-label">{query ? "Search Algorithm" : "Popular Algorithms"}</p>
            <h2 className="mt-2 text-3xl font-black">{query ? "Matching Results" : "Start with these"}</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(query ? filtered : popular).slice(0, 8).map((algorithm) => (
            <AlgorithmCard key={algorithm.slug} algorithm={algorithm} />
          ))}
        </div>
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
