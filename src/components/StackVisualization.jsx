import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const STACK_MAX = 10;

export default function StackVisualization({ step }) {
  const { array = [], markers = {} } = step;
  const isFull = array.length >= STACK_MAX;

  // Track which index was JUST pushed so we can briefly style it differently.
  // We store the id of the element that arrived (its index key). After 600ms we clear it.
  const [newlyPushedIdx, setNewlyPushedIdx] = useState(null);

  // Detect when a new element has been pushed (array length grows)
  useEffect(() => {
    if (markers.operation === "Push" && step.status === "Done" && array.length > 0) {
      const topIdx = array.length - 1;
      setNewlyPushedIdx(topIdx);
      const timer = setTimeout(() => setNewlyPushedIdx(null), 700);
      return () => clearTimeout(timer);
    }
  }, [array.length, markers.operation, step.status]);

  return (
    <div className="flex w-full items-center justify-center p-6">
      <div className="flex items-end gap-6">

        {/* Stack Container */}
        <div className="relative flex flex-col items-center">
          {/* Stack Overflow Banner */}
          <AnimatePresence>
            {isFull && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-2 flex items-center gap-2 rounded-full bg-red-500/20 border border-red-400 px-4 py-1.5 text-xs font-black text-red-400 tracking-widest uppercase"
              >
                <span className="text-base">⚠</span> Stack Full ({STACK_MAX}/{STACK_MAX})
              </motion.div>
            )}
          </AnimatePresence>

          {/* The stack box itself */}
          <div
            className="relative flex flex-col-reverse justify-start overflow-hidden rounded-t-lg rounded-b-xl border-2 border-slate-400 bg-slate-50 shadow-inner dark:border-slate-600 dark:bg-slate-900/50"
            style={{ width: "14rem", height: `${STACK_MAX * 48}px` }}
          >
            {/* Empty state */}
            {array.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold opacity-50 text-sm">
                Stack is empty
              </div>
            )}

            {/* Capacity guide lines — subtle stripes showing MAX capacity */}
            {Array.from({ length: STACK_MAX }).map((_, i) => (
              <div
                key={`guide-${i}`}
                className="absolute w-full border-t border-slate-200/40 dark:border-slate-700/30 pointer-events-none"
                style={{ bottom: `${i * 48}px` }}
              />
            ))}

            <AnimatePresence>
              {array.map((val, idx) => {
                const isTop = idx === array.length - 1;
                const isPeeking = markers.peeking && isTop;
                const isPopping = markers.popping && isTop;
                const isEntering = newlyPushedIdx === idx;

                // Style priority:
                // 1. Popping → red
                // 2. Peeking → emerald
                // 3. Entering (just pushed, still animating in) → dark/black
                // 4. Top (fully settled) → same light style as others but with a ring
                // 5. Default → light gray
                let bgClass;
                if (isPopping) {
                  bgClass = "bg-red-500 text-white border-red-400";
                } else if (isPeeking) {
                  bgClass = "bg-emerald-500 text-white border-emerald-400";
                } else if (isEntering) {
                  // Dark while sliding in
                  bgClass = "bg-slate-800 text-white border-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-300";
                } else {
                  // All settled elements — uniform light style
                  bgClass = "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600";
                }

                return (
                  <motion.div
                    key={`item-${val}-${idx}`}
                    initial={{ y: -420, opacity: 0, scale: 0.85 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -420, opacity: 0, scale: 0.7, transition: { duration: 0.3 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className={`flex w-full flex-shrink-0 items-center justify-center border-t text-base font-bold transition-colors duration-500 ${bgClass}`}
                    style={{ height: "48px" }}
                  >
                    <span>{val}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* TOP indicator — floats beside the stack at the correct height */}
        <div
          className="relative flex flex-col-reverse"
          style={{ height: `${STACK_MAX * 48}px` }}
        >
          <AnimatePresence>
            {array.length > 0 && (
              <motion.div
                // Position from bottom: (array.length - 1) slots * 48px + center (24px)
                animate={{ bottom: `${(array.length - 1) * 48 + 12}px` }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="absolute flex items-center gap-1.5"
                style={{ bottom: `${(array.length - 1) * 48 + 12}px` }}
              >
                <span className="text-xs font-black text-emerald-500 tracking-widest uppercase whitespace-nowrap">
                  ← TOP
                </span>
                <div className="h-px w-4 bg-emerald-500" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stack size counter */}
          <div className="absolute -bottom-8 right-0 text-xs font-black text-slate-400 tabular-nums">
            {array.length}/{STACK_MAX}
          </div>
        </div>

      </div>
    </div>
  );
}
