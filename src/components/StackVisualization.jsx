import { motion, AnimatePresence } from "framer-motion";

export default function StackVisualization({ step }) {
  const { array = [], markers = {} } = step;
  
  return (
    <div className="flex w-full items-center justify-center p-8">
      <div className="relative flex h-[480px] w-56 flex-col-reverse justify-start overflow-hidden rounded-t-lg rounded-b-xl border-2 border-slate-400 bg-slate-50 shadow-inner dark:border-slate-600 dark:bg-slate-900/50">
        
        {/* Placeholder text if empty */}
        {array.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold opacity-50">
            Stack is empty
          </div>
        )}

        <AnimatePresence>
          {array.map((val, idx) => {
            const isTop = idx === array.length - 1;
            const isPeeking = markers.peeking && isTop;
            const isPopping = markers.popping && isTop;
            
            // Match the image styling:
            // Regular items are light gray with black text, separated by borders
            // Top item is dark gray with white text
            let bgClass = "bg-slate-100 text-slate-800 border-t border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600";
            
            if (isTop && !isPopping) {
              bgClass = "bg-slate-800 text-white border-t border-slate-800 shadow-lg dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200 z-10";
            }
            if (isPeeking) {
               bgClass = "bg-emerald-500 text-white border-t border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] z-10";
            }
            if (isPopping) {
               bgClass = "bg-red-500 text-white border-t border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] z-10";
            }
            
            return (
              <motion.div
                key={`stack-item-${idx}`} // Use idx to keep it stable and just animate changes in value if needed, but for stack it's fine. Wait, if we pop, idx is removed, so it exits.
                initial={{ y: -480, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -480, opacity: 0 }}
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                className={`flex h-16 w-full flex-shrink-0 items-center justify-center text-lg font-bold transition-colors duration-300 ${bgClass}`}
              >
                {val}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
