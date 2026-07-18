import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const categoryStyles = {
  "Sorting": {
    bg: "bg-pink-600 dark:bg-pink-700",
    text: "text-white",
    border: "border-pink-600 dark:border-pink-700"
  },
  "Searching": {
    bg: "bg-purple-600 dark:bg-purple-700",
    text: "text-white",
    border: "border-purple-600 dark:border-purple-700"
  },
  "Linked List": {
    bg: "bg-blue-600 dark:bg-blue-700",
    text: "text-white",
    border: "border-blue-600 dark:border-blue-700"
  },
  "Stack": {
    bg: "bg-amber-600 dark:bg-amber-700",
    text: "text-white",
    border: "border-amber-600 dark:border-amber-700"
  },
  "Queue": {
    bg: "bg-teal-600 dark:bg-teal-700",
    text: "text-white",
    border: "border-teal-600 dark:border-teal-700"
  },
  "Trees": {
    bg: "bg-emerald-600 dark:bg-emerald-700",
    text: "text-white",
    border: "border-emerald-600 dark:border-emerald-700"
  },
  "Graphs": {
    bg: "bg-indigo-600 dark:bg-indigo-700",
    text: "text-white",
    border: "border-indigo-600 dark:border-indigo-700"
  }
};

export default function AlgorithmCard({ algorithm }) {
  const style = categoryStyles[algorithm.category] || {
    bg: "bg-slate-600 dark:bg-slate-700",
    text: "text-white",
    border: "border-slate-600 dark:border-slate-700"
  };

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
      <Link 
        to={`/algorithm/${algorithm.slug}`} 
        className="neo-card flex h-full flex-col gap-4 p-5 border-slate-200/80 dark:border-slate-800/80 hover:border-blue-600 dark:hover:border-cyan-400 group transition-all duration-300"
      >
        <div className="flex flex-col items-start gap-2">
          <div className="flex w-full items-center justify-between">
            <span className={`inline-block rounded-xl border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text} ${style.border}`}>
              {algorithm.category}
            </span>
            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-450 transition-all duration-300 transform group-hover:translate-x-1" />
          </div>
          <h3 className="mt-1 text-xl font-black">{algorithm.title}</h3>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400">Best {algorithm.complexities.best}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400">Space {algorithm.complexities.space}</span>
        </div>
      </Link>
    </motion.div>
  );
}
