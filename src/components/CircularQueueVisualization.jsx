import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MAX = 10;
const RADIUS = 140; // Radius for the queue slots
const POINTER_RADIUS = 210; // Radius for the pointers

export default function CircularQueueVisualization({ step }) {
  const queueState = step || { array: Array(MAX).fill(null), front: -1, rear: -1 };
  const { array: queue, front, rear } = queueState;
  
  const markers = step?.markers || {};
  const isEnqueuing = markers.enqueuing;
  const isDequeuing = markers.dequeuing;
  const hasError = markers.success === false;
  const activeIdx = markers.activeIdx ?? -1;

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (hasError) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [hasError]);

  // Calculate positions for a given index
  const getPosition = (index, radius) => {
    // Start at top (-90 degrees / -PI/2) and go clockwise
    const angle = (index / MAX) * 2 * Math.PI - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  return (
    <div className="flex flex-col items-center w-full py-8">
      <div className="w-full max-w-4xl px-4 flex flex-col items-center">
        
        {/* The Circular Box */}
        <div className="w-full h-[550px] border border-slate-300 dark:border-slate-700 rounded-xl p-4 flex justify-center items-center overflow-hidden bg-white dark:bg-slate-900 shadow-sm relative">
            
            <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Draw connecting circular track */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <circle 
                        cx="50%" cy="50%" r={RADIUS} 
                        fill="none" 
                        strokeWidth="2" 
                        strokeDasharray="8 8"
                        className="stroke-slate-200 dark:stroke-slate-800"
                    />
                </svg>

                {/* Draw all 10 slots */}
                {Array.from({ length: MAX }).map((_, index) => {
                    const pos = getPosition(index, RADIUS);
                    const item = queue[index];
                    
                    const isFront = index === front;
                    const isRear = index === rear;
                    const isActive = index === activeIdx;
                    
                    let bgClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 border-dashed";
                    let textClass = "text-slate-800 dark:text-slate-200";

                    if (item !== null) {
                        bgClass = "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 border-solid";
                        
                        if (showError) {
                            bgClass = "bg-red-100 dark:bg-red-900/30 border-red-500 border-solid";
                            textClass = "text-red-700 dark:text-red-400";
                        } else if (isEnqueuing && isActive) {
                            bgClass = "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 border-solid";
                            textClass = "text-emerald-700 dark:text-emerald-400";
                        } else if (isDequeuing && isActive) {
                            bgClass = "bg-red-100 dark:bg-red-900/30 border-red-500 border-solid";
                            textClass = "text-red-700 dark:text-red-400";
                        }
                    }

                    return (
                        <div 
                            key={`slot-${index}`}
                            className="absolute flex flex-col items-center justify-center z-10"
                            style={{
                                top: "50%",
                                left: "50%",
                                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`
                            }}
                        >
                            {/* Empty slot / Background */}
                            <div className={`flex items-center justify-center w-14 h-14 rounded-full border-2 shadow-sm ${bgClass}`}>
                                <AnimatePresence mode="wait">
                                    {item !== null && (
                                        <motion.div
                                            key={`item-${index}-${item}`}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ 
                                              opacity: 0, 
                                              scale: 0.5, 
                                              transition: { duration: 0.4 } 
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            className={`absolute inset-0 flex items-center justify-center rounded-full font-mono text-xl font-black ${textClass}`}
                                        >
                                            {item}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            
                            {/* Index Number */}
                            <div className="absolute -bottom-6 text-xs font-bold text-slate-400 font-mono">
                                {index}
                            </div>
                        </div>
                    );
                })}

                {/* Front Pointer */}
                {front !== -1 && (
                    <motion.div
                        initial={false}
                        animate={{
                            x: getPosition(front, POINTER_RADIUS).x,
                            y: getPosition(front, POINTER_RADIUS).y
                        }}
                        style={{ top: "50%", left: "50%" }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="absolute flex flex-col items-center z-20 origin-center -ml-6 -mt-6 w-12 h-12"
                    >
                        <div className="text-rose-500 font-bold text-sm bg-white dark:bg-slate-900 px-2 rounded-full border border-rose-200 dark:border-rose-900 shadow-sm">
                            Front
                        </div>
                        <div className="text-rose-500 text-lg mt-1 font-black">↓</div>
                    </motion.div>
                )}

                {/* Rear Pointer */}
                {rear !== -1 && (
                    <motion.div
                        initial={false}
                        animate={{
                            x: getPosition(rear, POINTER_RADIUS).x,
                            y: getPosition(rear, POINTER_RADIUS).y
                        }}
                        style={{ top: "50%", left: "50%" }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="absolute flex flex-col-reverse items-center z-20 origin-center -ml-6 -mt-6 w-12 h-12"
                    >
                        <div className="text-blue-500 text-lg mb-1 font-black">↑</div>
                        <div className="text-blue-500 font-bold text-sm bg-white dark:bg-slate-900 px-2 rounded-full border border-blue-200 dark:border-blue-900 shadow-sm">
                            Rear
                        </div>
                    </motion.div>
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
            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm border-l border-slate-300 dark:border-slate-700 pl-6">
                Capacity: {MAX}
            </span>
        </div>
      </div>
    </div>
  );
}
