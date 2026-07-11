import { motion, AnimatePresence } from "framer-motion";

function MiniBoard({ board }) {
  const N = board.length;
  return (
    <div 
      className="grid border-2 border-slate-700 dark:border-slate-800 shrink-0" 
      style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: N }).map((_, r) => (
        Array.from({ length: N }).map((_, c) => {
          const isDark = (r + c) % 2 === 1;
          const hasQueen = board[r] === c;
          const bgColor = isDark ? "bg-slate-300 dark:bg-slate-700" : "bg-slate-100 dark:bg-slate-600";
          return (
            <div 
              key={`${r}-${c}`} 
              className={`flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 ${bgColor}`}
            >
              {hasQueen && <span className="text-[10px] sm:text-xs">👑</span>}
            </div>
          );
        })
      ))}
    </div>
  );
}

export default function NQueensVisualization({ step, currentStep }) {
  const { board, markers = {}, solutions = [] } = step;
  const N = board.length;

  return (
    <section className="neo-panel p-5">
      <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="muted-label">N-Queens Visualization</p>
          <h2 className="mt-1 text-2xl font-black">{N}x{N} Board</h2>
        </div>
        
        {/* Inline Step Explanation */}
        <div className="relative h-10 flex-1 flex justify-end overflow-visible">
          <AnimatePresence>
            <motion.div
              key={step.status + step.explanation}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 lg:pr-4 flex items-center gap-3 w-max"
            >
              <span className="text-xl sm:text-2xl">
                {step.status === "Solved" ? "✅" : step.status === "Conflict" ? "❌" : step.status === "Done" ? "🏁" : "👑"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">{step.status}</p>
                <p className="mt-0.5 text-xs sm:text-sm font-semibold leading-5 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {step.explanation}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Solutions */}
        <div className="lg:w-1/4 flex flex-col h-[400px] sm:h-[500px]">
          <div className="mb-3 rounded-lg bg-slate-200 dark:bg-slate-800 p-3 text-center">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Solutions Found</p>
            <p className="text-3xl font-black text-blue-600 dark:text-cyan-400">{solutions.length}</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {solutions.map((solBoard, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                >
                  <span className="text-xs font-bold text-slate-500">Solution {idx + 1}</span>
                  <MiniBoard board={solBoard} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Main Board */}
        <div className="lg:w-3/4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
          <div 
            className="grid shadow-xl border-4 border-slate-700 dark:border-slate-800 rounded-lg overflow-hidden" 
            style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: N }).map((_, r) => (
              Array.from({ length: N }).map((_, c) => {
                const isDark = (r + c) % 2 === 1;
                // board[row] = col for the new logic
                const hasQueen = board[r] === c;
                
                const isChecking = markers.checking && markers.checking[0] === r && markers.checking[1] === c;
                const isPlaced = markers.placed && markers.placed[0] === r && markers.placed[1] === c;
                const isBacktracking = markers.backtracking && markers.backtracking[0] === r && markers.backtracking[1] === c;
                
                let isAttacking = false;
                if (markers.attacking) {
                  if ((markers.attacking[0] === r && markers.attacking[1] === c) || 
                      (markers.attacking[2] === r && markers.attacking[3] === c)) {
                    isAttacking = true;
                  }
                }

                let bgColor = isDark ? "bg-slate-300 dark:bg-slate-700" : "bg-slate-100 dark:bg-slate-600";
                let ringColor = "";

                if (isAttacking) {
                  bgColor = "bg-red-300 dark:bg-red-900/80";
                  ringColor = "ring-inset ring-4 ring-red-500 z-10 relative";
                } else if (isChecking) {
                  ringColor = "ring-inset ring-4 ring-blue-500 z-10 relative";
                  bgColor = "bg-blue-100 dark:bg-blue-900/50";
                } else if (isPlaced) {
                  ringColor = "ring-inset ring-4 ring-emerald-500 z-10 relative";
                  bgColor = "bg-emerald-100 dark:bg-emerald-900/50";
                } else if (isBacktracking) {
                  bgColor = "bg-orange-200 dark:bg-orange-900/60";
                  ringColor = "ring-inset ring-4 ring-orange-400 z-10 relative";
                }

                const cellSize = N === 4 ? "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" : N === 5 ? "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" : "w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16";

                return (
                  <div 
                    key={`${r}-${c}`} 
                    className={`relative flex items-center justify-center transition-colors duration-200 ${cellSize} ${bgColor} ${ringColor}`}
                  >
                    <span className="absolute top-1 left-1.5 text-[8px] sm:text-[10px] font-bold text-slate-400/70 select-none">
                      {r},{c}
                    </span>
                    <AnimatePresence>
                      {hasQueen && (
                        <motion.div
                          initial={{ scale: 0.5, opacity: 0, y: -10 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.5, opacity: 0, y: 10 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="text-2xl sm:text-3xl md:text-4xl drop-shadow-md select-none"
                        >
                          👑
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-bold">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><span className="inline-block h-3 w-3 rounded-full bg-blue-500" /> Checking</span>
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><span className="inline-block h-3 w-3 rounded-full bg-emerald-500" /> Placed</span>
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><span className="inline-block h-3 w-3 rounded-full bg-red-500" /> Conflict</span>
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><span className="inline-block h-3 w-3 rounded-full bg-orange-400" /> Backtracking</span>
          </div>
        </div>
      </div>
    </section>
  );
}
