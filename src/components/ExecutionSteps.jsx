import { useEffect, useRef } from "react";

export default function ExecutionSteps({
  steps,
  currentStep,
  onStepClick,
  compact = false,
  full = false,
}) {
  const listRef = useRef(null),
    selectedRef = useRef(null);
  const count = full ? steps.length : compact ? 9 : 41;
  const start = Math.max(
    0,
    Math.min(currentStep - Math.floor(count / 2), steps.length - count),
  );
  const visible = steps.slice(start, start + count);
  useEffect(() => {
    const list = listRef.current,
      selected = selectedRef.current;
    if (!compact && list && selected)
      list.scrollTop = Math.max(0, selected.offsetTop - list.offsetTop - 160);
  }, [currentStep, compact]);
  return (
    <section className="neo-panel min-w-0 overflow-hidden">
      <div className="border-b border-white/70 px-5 py-4 dark:border-slate-800">
        <h2 className="text-lg font-black">Algorithm Execution Steps</h2>
      </div>
      {onStepClick && (
        <label className="flex items-center gap-3 px-5 py-3 text-sm font-bold">
          Select step
          <input
            aria-label="Select execution step"
            type="range"
            min="0"
            max={Math.max(0, steps.length - 1)}
            value={currentStep}
            onChange={(event) => onStepClick(Number(event.target.value))}
            className="min-w-0 flex-1"
          />
          {currentStep + 1}/{steps.length}
        </label>
      )}
      <div
        ref={listRef}
        role="group"
        aria-label="Execution history"
        className={
          compact
            ? "compact-history"
            : "relative max-h-[520px] space-y-3 overflow-auto p-4"
        }
      >
        {start > 0 && (
          <p className="text-xs text-slate-500">
            Showing a window of the history. Use Select step to navigate all{" "}
            {steps.length} steps.
          </p>
        )}
        {visible.map((step, offset) => {
          const index = start + offset;
          return (
            <button
              type="button"
              ref={index === currentStep ? selectedRef : null}
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              aria-current={index === currentStep ? "step" : undefined}
              key={`${index}-${step.status}`}
              className={`block w-full text-left rounded-2xl border p-4 transition ${
                index === currentStep
                  ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-600/10 dark:border-cyan-300 dark:bg-cyan-400/10"
                  : index < currentStep
                    ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-400/10"
                    : "border-slate-200 bg-white/40 dark:border-slate-800 dark:bg-slate-900/50"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black">Step {index + 1}</p>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {step.status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {step.explanation}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
