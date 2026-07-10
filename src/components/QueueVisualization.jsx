import { motion, AnimatePresence } from "framer-motion";

export default function QueueVisualization({ step, algorithm }) {
  const queue = step?.array || [];
  const markers = step?.markers || {};
  const isEnqueuing = markers.enqueuing;
  const isDequeuing = markers.dequeuing;
  const operation = markers.operation;
  
  return (
    <div className="flex flex-col items-center w-full py-8">
      {/* Container holding the queue */}
      <div className="w-full max-w-4xl px-4">
        
        {/* Labels for Front and Rear */}
        <div className="flex justify-between w-full px-2 mb-2">
            <span className="text-slate-500 font-bold text-sm flex items-center gap-1 dark:text-slate-400">
                <span className="text-lg">→</span> Front
            </span>
            <span className="text-slate-500 font-bold text-sm flex items-center gap-1 dark:text-slate-400">
                Rear <span className="text-lg">→</span>
            </span>
        </div>

        {/* The Queue Box */}
        <div className="w-full min-h-[140px] border border-slate-300 dark:border-slate-700 rounded-xl p-4 flex items-center overflow-hidden bg-white dark:bg-slate-900 shadow-sm relative">
          <div className="flex gap-3 w-full h-full items-center">
            <AnimatePresence mode="popLayout">
              {queue.map((item, index) => {
                const isFront = index === 0;
                const isRear = index === queue.length - 1;
                
                // Determine styling based on current operation
                let bgClass = "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
                let textClass = "text-slate-800 dark:text-slate-200";

                if (isEnqueuing && isRear) {
                  bgClass = "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500";
                  textClass = "text-emerald-700 dark:text-emerald-400";
                } else if (isDequeuing && isFront) {
                  bgClass = "bg-red-100 dark:bg-red-900/30 border-red-500";
                  textClass = "text-red-700 dark:text-red-400";
                }

                return (
                  <motion.div
                    key={`${index}-${item}`}
                    layout
                    initial={{ opacity: 0, x: 50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`flex items-center justify-center w-20 h-20 rounded-xl border-2 font-mono text-xl font-bold shadow-sm ${bgClass} ${textClass} shrink-0`}
                  >
                    {item}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {queue.length === 0 && (
                <div className="w-full text-center text-slate-400 dark:text-slate-600 font-medium italic">
                    Queue is empty
                </div>
            )}
          </div>
        </div>
        
        {/* Size Indicator */}
        <div className="text-center mt-4">
            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                Queue Size: {queue.length}
            </span>
        </div>
      </div>
    </div>
  );
}
