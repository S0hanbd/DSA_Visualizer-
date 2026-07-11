import { AnimatePresence, motion } from "framer-motion";

function StackDisplay({ items, label, markers = {}, stackId }) {
  // We want to show the stack growing from bottom to top.
  // So we render items.map() normally, but display as flex-col-reverse.
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col-reverse w-24 h-64 border-x-4 border-b-4 border-slate-700 dark:border-slate-500 rounded-b-xl overflow-visible p-2 gap-1 bg-slate-50 dark:bg-slate-800">
        <AnimatePresence>
          {items.map((item, idx) => {
            const isPushing = markers[`pushS${stackId}`] === item && idx === items.length - 1;
            const isPopping = markers[`popS${stackId}`] === item && idx === items.length - 1;
            const isDequeued = (markers.dequeued === item || markers.popS2 === item) && idx === items.length - 1 && stackId === 2;

            let bgColor = "bg-blue-500 dark:bg-blue-600";
            if (isPushing) bgColor = "bg-emerald-500 dark:bg-emerald-600";
            if (isPopping) bgColor = "bg-orange-500 dark:bg-orange-600";
            if (isDequeued) bgColor = "bg-purple-500 dark:bg-purple-600";

            return (
              <motion.div
                key={`${stackId}-${item}-${idx}`}
                layout
                initial={{ 
                  opacity: 0, 
                  y: stackId === 1 ? -50 : -80, 
                  x: stackId === 1 ? 0 : -60,
                  scale: 0.8 
                }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                exit={{ 
                  opacity: 0, 
                  y: isDequeued ? 50 : -80, 
                  x: isDequeued ? 0 : 60,
                  scale: 0.8,
                  transition: { duration: 0.3 }
                }}
                className={`w-full h-10 flex shrink-0 items-center justify-center rounded-lg text-white font-bold shadow-md ${bgColor}`}
              >
                {item}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <h3 className="mt-4 font-semibold text-slate-600 dark:text-slate-400">{label}</h3>
    </div>
  );
}

export default function QueueUsingStacksVisualization({ step, currentStep }) {
  const { stack1 = [], stack2 = [], markers = {} } = step;

  return (
    <section className="neo-panel p-5">
      <div className="mb-8 flex flex-col gap-6">
        <div>
          <p className="muted-label">Queue using Stacks Visualization</p>
          <h2 className="mt-1 text-2xl font-black">Transfer Simulation</h2>
        </div>
        
        {/* Inline Step Explanation */}
        <div className="relative h-10 flex w-full overflow-visible">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={step.status + step.explanation}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 flex items-center gap-3 w-max"
            >
              <span className="text-xl sm:text-2xl">
                {step.status === "Error" ? "❌" : step.status === "Transfer" ? "🔄" : step.status === "Done" ? "✅" : "📦"}
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

      <div className="flex flex-row justify-center gap-16 py-8 relative">
        <StackDisplay items={stack1} label="Stack 1 (Input)" markers={markers} stackId={1} />
        
        {/* Transfer Arrow Icon */}
        <div className="flex items-center justify-center opacity-50">
          <span className="text-4xl text-slate-400">➔</span>
        </div>

        <StackDisplay items={stack2} label="Stack 2 (Output)" markers={markers} stackId={2} />
      </div>
    </section>
  );
}
