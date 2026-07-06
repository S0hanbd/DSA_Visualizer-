export default function ExecutionSteps({ steps, currentStep }) {
  return (
    <section className="neo-panel min-w-0 overflow-hidden">
      <div className="border-b border-white/70 px-5 py-4 dark:border-slate-800">
        <h2 className="text-lg font-black">Algorithm Execution Steps</h2>
      </div>
      <div className="max-h-[520px] space-y-3 overflow-auto p-4">
        {steps.map((step, index) => (
          <div
            key={`${index}-${step.status}`}
            className={`rounded-2xl border p-4 transition ${
              index === currentStep
                ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-600/10 dark:border-cyan-300 dark:bg-cyan-400/10"
                : index < currentStep
                  ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-400/10"
                  : "border-slate-200 bg-white/40 dark:border-slate-800 dark:bg-slate-900/50"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black">Step {index + 1}</p>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{step.status}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.explanation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
