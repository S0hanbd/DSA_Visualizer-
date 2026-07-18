export default function StatsPanel({ step, totalSteps, currentStep }) {
  const progress = Math.round((currentStep / Math.max(totalSteps - 1, 1)) * 100);

  const stats = [
    { label: "Comparisons", value: step.comparisons ?? 0 },
    { label: "Swaps", value: step.swaps ?? 0 },
    { label: "Pass", value: step.pass ?? 0 },
    { label: "Current Index", value: step.index ?? 0 },
    { 
      label: "Current Comparison", 
      value: step.comparing?.length ? step.comparing.join(" & ") : "None" 
    },
    { 
      label: "Current Swap", 
      value: step.swapping?.length ? step.swapping.join(" & ") : "None" 
    },
    { label: "Array Size", value: step.array?.length ?? 0 },
    { label: "Progress", value: `${progress}%` },
  ];

  return (
    <section className="neo-panel p-5">
      <p className="muted-label">Simulation Details</p>
      
      {/* Metrics Row (Plain text, no boxes) */}
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider min-h-[40px] flex items-end pb-1 leading-tight">{stat.label}</span>
            <span className="text-lg font-black text-slate-900 dark:text-white block">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200 shadow-neo-inset dark:bg-slate-800 dark:shadow-dark-inset">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 dark:from-cyan-300 dark:to-emerald-400" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Step Explanation Text */}
      {step.explanation && (
        <p className="mt-5 rounded-3xl bg-blue-50 p-4 text-sm font-semibold leading-6 text-slate-700 dark:bg-cyan-400/10 dark:text-slate-200">
          {step.explanation}
        </p>
      )}
    </section>
  );
}
