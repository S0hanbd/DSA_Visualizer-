import { motion, AnimatePresence } from "framer-motion";

const LEGENDS = {
  "bubble-sort": [
    { color: "text-blue-600 dark:text-cyan-300", label: "Unsorted" },
    { color: "text-orange-500", label: "Comparing" },
    { color: "text-red-500", label: "Swapping" },
    { color: "text-emerald-500", label: "Sorted" },
  ],
  "selection-sort": [
    { color: "text-blue-600 dark:text-cyan-300", label: "Unsorted" },
    { color: "text-indigo-500 dark:text-indigo-400", label: "Scanning" },
    { color: "text-amber-500", label: "Current Minimum" },
    { color: "text-red-500", label: "Swapping" },
    { color: "text-emerald-500", label: "Sorted" },
  ],
  "insertion-sort": [
    { color: "text-blue-600 dark:text-cyan-300", label: "Unsorted" },
    { color: "text-indigo-500 dark:text-indigo-400", label: "Comparing" },
    { color: "text-amber-500", label: "Key / Hole" },
    { color: "text-red-500", label: "Shifting Right" },
    { color: "text-emerald-500", label: "Sorted" },
  ],
  "merge-sort": [
    { color: "text-blue-600 dark:text-cyan-300", label: "Unsorted" },
    { color: "text-violet-500", label: "Left Subarray" },
    { color: "text-pink-500", label: "Right Subarray" },
    { color: "text-red-500", label: "Placing" },
    { color: "text-emerald-500", label: "Merged" },
  ],
  "quick-sort": [
    { color: "text-blue-600 dark:text-cyan-300", label: "Unsorted" },
    { color: "text-amber-500", label: "Pivot" },
    { color: "text-orange-500", label: "Comparing" },
    { color: "text-red-500", label: "Swapping" },
    { color: "text-emerald-500", label: "Pivot Placed" },
  ],
  "heap-sort": [
    { color: "text-blue-600 dark:text-cyan-300", label: "Unsorted" },
    { color: "text-orange-500", label: "Heapifying (children)" },
    { color: "text-amber-500", label: "Root / Max" },
    { color: "text-red-500", label: "Swapping" },
    { color: "text-emerald-500", label: "Extracted (Sorted)" },
  ],
  "shell-sort": [
    { color: "text-blue-600 dark:text-cyan-300", label: "Unsorted" },
    { color: "text-indigo-500 dark:text-indigo-400", label: "Comparing (gap)" },
    { color: "text-amber-500", label: "Key Element" },
    { color: "text-red-500", label: "Shifting" },
    { color: "text-emerald-500", label: "Sorted" },
  ],
  "counting-sort": [
    { color: "text-blue-600 dark:text-cyan-300", label: "Unsorted" },
    { color: "text-indigo-500 dark:text-indigo-400", label: "Counting" },
    { color: "text-red-500", label: "Placing" },
    { color: "text-emerald-500", label: "Sorted" },
  ],
  "radix-sort": [
    { color: "text-blue-600 dark:text-cyan-300", label: "Unsorted" },
    { color: "text-indigo-500 dark:text-indigo-400", label: "Reading Digit" },
    { color: "text-red-500", label: "Placing" },
    { color: "text-emerald-500", label: "Sorted" },
  ],
};

function colorFor(index, step, slug) {
  const sorted = step.sorted ?? [];
  const comparing = step.comparing ?? [];
  const swapping = step.swapping ?? [];

  switch (slug) {
    case "selection-sort":
      if (sorted.includes(index)) return "from-emerald-400 to-emerald-600";
      if (swapping.includes(index)) return "from-red-400 to-red-600";
      if (step.minIdx === index) return "from-amber-400 to-amber-600";
      if (comparing.includes(index)) return "from-indigo-400 to-indigo-600 dark:from-indigo-300 dark:to-indigo-500";
      return "from-blue-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500";

    case "insertion-sort":
      if (sorted.includes(index)) return "from-emerald-400 to-emerald-600";
      if (swapping.includes(index)) return "from-red-400 to-red-600";
      if (step.keyIdx === index) return "from-amber-400 to-amber-600";
      if (comparing.includes(index)) return "from-indigo-400 to-indigo-600 dark:from-indigo-300 dark:to-indigo-500";
      return "from-blue-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500";

    case "merge-sort":
      if (sorted.includes(index)) return "from-emerald-400 to-emerald-600";
      if (swapping.includes(index)) return "from-red-400 to-red-600";
      // comparing = left subarray, swapping (before actual swap) = right subarray
      // In merge-sort we repurpose comparing=leftZone, swapping=rightZone for the merge announce step
      if (step.status === "Merging") {
        if (comparing.includes(index)) return "from-violet-400 to-violet-600";
        if (swapping.includes(index)) return "from-pink-400 to-pink-600";
      }
      if (comparing.includes(index)) return "from-violet-400 to-violet-600";
      return "from-blue-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500";

    case "quick-sort":
      if (sorted.includes(index)) return "from-emerald-400 to-emerald-600";
      if (swapping.includes(index)) return "from-red-400 to-red-600";
      if (step.markers?.pivot === index) return "from-amber-400 to-amber-600";
      if (comparing.includes(index)) return "from-orange-300 to-orange-500";
      return "from-blue-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500";

    case "heap-sort":
      if (sorted.includes(index)) return "from-emerald-400 to-emerald-600";
      if (swapping.includes(index)) return "from-red-400 to-red-600";
      if (comparing[0] === index) return "from-amber-400 to-amber-600"; // root
      if (comparing.includes(index)) return "from-orange-300 to-orange-500"; // children
      return "from-blue-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500";

    case "shell-sort":
      if (sorted.includes(index)) return "from-emerald-400 to-emerald-600";
      if (swapping.includes(index)) return "from-red-400 to-red-600";
      if (step.status === "Pick Key" && comparing.includes(index)) return "from-amber-400 to-amber-600";
      if (comparing.includes(index)) return "from-indigo-400 to-indigo-600 dark:from-indigo-300 dark:to-indigo-500";
      return "from-blue-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500";

    case "counting-sort":
    case "radix-sort":
      if (sorted.includes(index)) return "from-emerald-400 to-emerald-600";
      if (swapping.includes(index)) return "from-red-400 to-red-600";
      if (comparing.includes(index)) return "from-indigo-400 to-indigo-600 dark:from-indigo-300 dark:to-indigo-500";
      return "from-blue-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500";

    default: // bubble-sort and fallback
      if (sorted.includes(index)) return "from-emerald-400 to-emerald-600";
      if (swapping.includes(index)) return "from-red-400 to-red-600";
      if (comparing.includes(index)) return "from-orange-300 to-orange-500";
      return "from-blue-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500";
  }
}

function ExtraBadge({ step, slug }) {
  if (slug === "shell-sort" && step.markers?.gap != null) {
    return (
      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-black text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
        Gap = {step.markers.gap}
      </span>
    );
  }
  if (slug === "counting-sort" && step.markers?.phase != null) {
    const labels = { 1: "Phase 1: Count", 2: "Phase 2: Prefix Sum", 3: "Phase 3: Reconstruct" };
    return (
      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 dark:bg-violet-900/60 dark:text-violet-300">
        {labels[step.markers.phase]}
      </span>
    );
  }
  if (slug === "radix-sort" && step.markers?.digitPass != null) {
    const digitName = step.markers.exp === 1 ? "Units" : step.markers.exp === 10 ? "Tens" : step.markers.exp === 100 ? "Hundreds" : `10^${Math.log10(step.markers.exp)}`;
    return (
      <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-black text-pink-700 dark:bg-pink-900/60 dark:text-pink-300">
        Pass {step.markers.digitPass} · {digitName} digit
      </span>
    );
  }
  if (slug === "quick-sort" && step.markers?.pivot != null) {
    return (
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
        Pivot @ index {step.markers.pivot}
      </span>
    );
  }
  if (slug === "merge-sort" && step.markers?.left != null) {
    return (
      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 dark:bg-violet-900/60 dark:text-violet-300">
        [{step.markers.left}…{step.markers.mid}] ↔ [{step.markers.mid + 1}…{step.markers.right}]
      </span>
    );
  }
  return null;
}

export default function VisualizationBars({ step, algorithm }) {
  const values = step.array;
  const max = Math.max(...values, 1);
  const slug = algorithm?.slug;
  const legend = LEGENDS[slug] ?? LEGENDS["bubble-sort"];

  return (
    <section className="neo-panel p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="muted-label">Visualization</p>
          <h2 className="mt-1 text-2xl font-black">Animated Array State</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ExtraBadge step={step} slug={slug} />
          <AnimatePresence mode="wait">
            <motion.span
              key={step.status}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18 }}
              className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {step.status}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="neo-inset flex h-80 items-end justify-center gap-2 overflow-hidden p-4 sm:gap-3">
        {(() => {
          const occurrences = {};
          return values.map((value, index) => {
            occurrences[value] = (occurrences[value] || 0) + 1;
            const itemKey = `${value}-${occurrences[value] - 1}`;
            const barColor = colorFor(index, step, slug);
            return (
              <motion.div
                key={itemKey}
                layout
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
              >
                <motion.div
                  initial={{ height: 20, opacity: 0.75 }}
                  animate={{ height: `${Math.max(14, (value / max) * 100)}%`, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 160, damping: 20 }}
                  className={`w-full max-w-12 rounded-t-2xl bg-gradient-to-t ${barColor} shadow-lg`}
                />
                <span className="text-xs font-black text-slate-600 dark:text-slate-300">{value}</span>
              </motion.div>
            );
          });
        })()}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-bold">
        {legend.map(({ color, label }) => (
          <span key={label} className={color}>{label}</span>
        ))}
      </div>
    </section>
  );
}
