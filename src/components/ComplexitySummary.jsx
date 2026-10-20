import ComplexityCard from "./ComplexityCard.jsx";

export default function ComplexitySummary({ algorithm }) {
  const {
    time,
    space,
    timeExplanation,
    spaceExplanation,
    variables,
    operation,
  } = algorithm.complexities;

  return (
    <section aria-label="Algorithm complexity" className="space-y-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ComplexityCard
          label="Time Complexity"
          context="Worst case"
          value={time}
          explanation={timeExplanation}
          tone="green"
        />
        <ComplexityCard
          label="Space Complexity"
          context="Memory required"
          value={space}
          explanation={spaceExplanation}
          tone="blue"
        />
      </div>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        <span className="font-semibold">{operation}.</span> {variables}
      </p>
      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Core algorithm bounds, excluding playback history and rendering. Space
        includes working memory and returned results, or the stored structure
        where stated. Demo size limits do not change these growth rates.
      </p>
    </section>
  );
}
