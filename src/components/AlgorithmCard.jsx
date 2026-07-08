import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categoryStyles = {
  "Sorting": {
    bg: "bg-pink-100/80 dark:bg-pink-950/30",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-200 dark:border-pink-900/20"
  },
  "Searching": {
    bg: "bg-purple-100/80 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-900/20"
  },
  "Linked List": {
    bg: "bg-blue-100/80 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-900/20"
  },
  "Stack": {
    bg: "bg-amber-100/80 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-900/20"
  },
  "Queue": {
    bg: "bg-teal-100/80 dark:bg-teal-950/30",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-900/20"
  },
  "Trees": {
    bg: "bg-emerald-100/80 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-900/20"
  },
  "Graphs": {
    bg: "bg-indigo-100/80 dark:bg-indigo-950/30",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-900/20"
  }
};

export default function AlgorithmCard({ algorithm }) {
  const style = categoryStyles[algorithm.category] || {
    bg: "bg-slate-100/80 dark:bg-slate-800/30",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700/20"
  };

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
      <Link to={`/algorithm/${algorithm.slug}`} className={`neo-card flex h-full flex-col gap-4 p-5 ${style.border}`}>
        <div className="flex flex-col items-start gap-2">
          <span className={`inline-block rounded-xl border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text} ${style.border}`}>
            {algorithm.category}
          </span>
          <h3 className="mt-1 text-xl font-black">{algorithm.title}</h3>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400">Base {algorithm.complexities.best}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400">Space {algorithm.complexities.space}</span>
        </div>
      </Link>
    </motion.div>
  );
}
