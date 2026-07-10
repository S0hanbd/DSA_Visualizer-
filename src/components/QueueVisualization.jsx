import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function QueueVisualization({ step }) {
  const queueState = step || { array: Array(10).fill(null), front: -1, rear: -1 };
  const { array: queue, front, rear } = queueState;
  
  const markers = step?.markers || {};
  const isEnqueuing = markers.enqueuing;
  const isDequeuing = markers.dequeuing;
  const hasError = markers.success === false;

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (hasError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 1500); // 1.5 seconds
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [hasError]);
  
  // Extract only the active portion of the queue for dynamic rendering
  const isEmpty = front === -1 || front > rear;
  
  return (
    <div className="flex flex-col items-center w-full py-8">
      {/* Container holding the queue */}
      <div className="w-full max-w-4xl px-4 flex flex-col items-center">
        
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
        <div className="w-full min-h-[160px] border border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col justify-center items-start overflow-auto custom-scrollbar bg-white dark:bg-slate-900 shadow-sm relative">
          
          <div className="flex gap-4 min-w-max items-center px-8 pt-6">
              {queue.map((item, index) => {
                const isFront = index === front;
                const isRear = index === rear;
                
                // Determine styling based on current operation
                let bgClass = "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
                let textClass = "text-slate-800 dark:text-slate-200";

                if (showError) {
                  bgClass = "bg-red-100 dark:bg-red-900/30 border-red-500";
                  textClass = "text-red-700 dark:text-red-400";
                } else if (isEnqueuing && isRear) {
                  bgClass = "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500";
                  textClass = "text-emerald-700 dark:text-emerald-400";
                } else if (isDequeuing && isFront) {
                  bgClass = "bg-red-100 dark:bg-red-900/30 border-red-500";
                  textClass = "text-red-700 dark:text-red-400";
                }

                return (
                  <div key={index} className="flex flex-col items-center relative shrink-0 w-16">
                    {/* Front Pointer */}
                    {isFront && (
                        <motion.div 
                            layoutId="frontPointer"
                            className="absolute -top-6 flex flex-col items-center text-rose-500 font-bold text-xs"
                        >
                            <span>Front ↓</span>
                        </motion.div>
                    )}
                    
                    {/* Queue Cell (Fixed Height to maintain layout) */}
                    <div className="w-16 h-16 flex items-center justify-center relative">
                      <AnimatePresence>
                          {item !== null && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5, x: 50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ 
                                  opacity: 0, 
                                  scale: 0.5, 
                                  x: -150, 
                                  transition: { duration: 0.6, ease: "easeOut" } 
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className={`absolute inset-0 flex items-center justify-center rounded-xl border-2 font-mono text-xl font-bold shadow-sm ${bgClass} ${textClass}`}
                              >
                                {item}
                              </motion.div>
                          )}
                      </AnimatePresence>
                    </div>

                    {/* Index */}
                    <span className="text-slate-400 font-mono text-xs mt-2">{index}</span>
                    
                    {/* Rear Pointer */}
                    {isRear && (
                        <motion.div 
                            layoutId="rearPointer"
                            className="absolute -bottom-6 flex flex-col items-center text-blue-500 font-bold text-xs"
                        >
                            <span>↑ Rear</span>
                        </motion.div>
                    )}
                  </div>
                );
              })}
            
            {isEmpty && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-600 font-medium italic pointer-events-none">
                    Queue is empty
                </div>
            )}
          </div>
        </div>
        
        {/* Size Indicator */}
        <div className="text-center mt-6 flex gap-6">
            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                Front Index: {front}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                Rear Index: {rear}
            </span>
        </div>
      </div>
    </div>
  );
}
