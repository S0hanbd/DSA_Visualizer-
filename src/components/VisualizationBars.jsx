import { motion } from "framer-motion";

export default function VisualizationBars({ step, algorithm }) {
  const values = step.array;
  const max = Math.max(...values, 1);

  const colorFor = (index) => {
    if (algorithm?.slug === "selection-sort") {
      if (step.sorted?.includes(index)) return "from-emerald-400 to-emerald-600";
      if (step.swapping?.includes(index)) return "from-red-400 to-red-600";
      if (step.minIdx === index) return "from-amber-400 to-amber-600";
      if (step.comparing?.includes(index)) return "from-indigo-400 to-indigo-600 dark:from-indigo-300 dark:to-indigo-500";
      return "from-blue-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500";
    }
    if (algorithm?.slug === "insertion-sort") {
      if (step.sorted?.includes(index)) return "from-emerald-400 to-emerald-600";
      if (step.swapping?.includes(index)) return "from-red-400 to-red-600";
      if (step.keyIdx === index) return "from-amber-400 to-amber-600";
      if (step.comparing?.includes(index)) return "from-indigo-400 to-indigo-600 dark:from-indigo-300 dark:to-indigo-500";
      return "from-blue-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500";
    }

    if (step.sorted?.includes(index)) return "from-emerald-400 to-emerald-600";
    if (step.swapping?.includes(index)) return "from-red-400 to-red-600";
    if (step.comparing?.includes(index)) return "from-orange-300 to-orange-500";
    return "from-blue-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500";
  };

  return (
    <section className="neo-panel p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="muted-label">Visualization</p>
          <h2 className="mt-1 text-2xl font-black">Animated Array State</h2>
        </div>
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">{step.status}</span>
      </div>
      <div className="neo-inset flex h-80 items-end justify-center gap-2 overflow-hidden p-4 sm:gap-3">
        {values.map((value, index) => (
          <div key={`${index}-${value}`} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
            <motion.div
              layout
              initial={{ height: 20, opacity: 0.75 }}
              animate={{ height: `${Math.max(14, (value / max) * 100)}%`, opacity: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
              className={`w-full max-w-12 rounded-t-2xl bg-gradient-to-t ${colorFor(index)} shadow-lg`}
            />
            <span className="text-xs font-black text-slate-600 dark:text-slate-300">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
        {algorithm?.slug === "selection-sort" ? (
          <>
            <span className="text-blue-600 dark:text-cyan-300">Blue: Unsorted</span>
            <span className="text-indigo-500 dark:text-indigo-400">Indigo: Comparing</span>
            <span className="text-amber-500">Amber: Current Minimum</span>
            <span className="text-red-500">Red: Swapping</span>
            <span className="text-emerald-500">Green: Sorted</span>
          </>
        ) : algorithm?.slug === "insertion-sort" ? (
          <>
            <span className="text-blue-600 dark:text-cyan-300">Blue: Unsorted</span>
            <span className="text-indigo-500 dark:text-indigo-400">Indigo: Comparing</span>
            <span className="text-amber-500">Amber: Hole / Key Target</span>
            <span className="text-red-500">Red: Shifting Right</span>
            <span className="text-emerald-500">Green: Sorted</span>
          </>
        ) : (
          <>
            <span className="text-blue-600 dark:text-cyan-300">Blue: Unsorted</span>
            <span className="text-orange-500">Orange: Comparing</span>
            <span className="text-red-500">Red: Swapping</span>
            <span className="text-emerald-500">Green: Sorted</span>
          </>
        )}
      </div>
    </section>
  );
}
