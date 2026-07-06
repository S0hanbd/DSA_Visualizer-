export default function StepExplanation({ step }) {
  return (
    <section className="neo-panel p-5">
      <p className="muted-label">Step Explanation</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="neo-inset p-4">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Current Pass</p>
          <p className="mt-2 text-xl font-black">{step.pass}</p>
        </div>
        <div className="neo-inset p-4">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Current Comparison</p>
          <p className="mt-2 text-xl font-black">{step.comparing?.length ? step.comparing.join(" & ") : "None"}</p>
        </div>
        <div className="neo-inset p-4">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Current Swap</p>
          <p className="mt-2 text-xl font-black">{step.swapping?.length ? step.swapping.join(" & ") : "None"}</p>
        </div>
      </div>
      <p className="mt-5 rounded-3xl bg-blue-50 p-4 text-sm font-semibold leading-6 text-slate-700 dark:bg-cyan-400/10 dark:text-slate-200">{step.explanation}</p>
    </section>
  );
}
