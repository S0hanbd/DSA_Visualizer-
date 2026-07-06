const stats = [
  ["Comparisons", "comparisons"],
  ["Swaps", "swaps"],
  ["Pass", "pass"],
  ["Current Index", "index"],
];

export default function StatsPanel({ step, totalSteps, currentStep }) {
  const progress = Math.round((currentStep / Math.max(totalSteps - 1, 1)) * 100);

  return (
    <section className="neo-panel p-5">
      <p className="muted-label">Statistics</p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(([label, key]) => (
          <div key={key} className="neo-inset p-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-black">{step[key]}</p>
          </div>
        ))}
        <div className="neo-inset p-4">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Array Size</p>
          <p className="mt-2 text-2xl font-black">{step.array.length}</p>
        </div>
        <div className="neo-inset p-4">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Progress</p>
          <p className="mt-2 text-2xl font-black">{progress}%</p>
        </div>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200 shadow-neo-inset dark:bg-slate-800 dark:shadow-dark-inset">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 dark:from-cyan-300 dark:to-emerald-400" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
