import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AlgorithmCard({ algorithm }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
      <Link to={`/algorithm/${algorithm.slug}`} className="neo-panel flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="muted-label">{algorithm.category}</p>
            <h3 className="mt-2 text-xl font-black">{algorithm.title}</h3>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white dark:bg-cyan-400 dark:text-slate-950">
            <ArrowRight size={18} />
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{algorithm.description}</p>
        <div className="mt-auto flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-200">Best {algorithm.complexities.best}</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">Space {algorithm.complexities.space}</span>
        </div>
      </Link>
    </motion.div>
  );
}
