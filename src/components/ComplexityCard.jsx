export default function ComplexityCard({
  label,
  value,
  tone = "blue",
  context,
  explanation,
}) {
  const tones = {
    blue: "text-blue-700 bg-blue-100 dark:text-cyan-200 dark:bg-cyan-400/10",
    green:
      "text-emerald-700 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-400/10",
    orange:
      "text-orange-700 bg-orange-100 dark:text-orange-200 dark:bg-orange-400/10",
    red: "text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-400/10",
  };

  return (
    <article aria-label={label} className="neo-panel min-w-0 p-4 sm:p-5">
      <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
        {label}
      </p>
      {context && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {context}
        </p>
      )}
      <p
        className={`mt-3 inline-block max-w-full break-words whitespace-normal rounded-2xl px-3 py-2 text-base sm:text-xl lg:text-2xl font-black ${tones[tone]}`}
      >
        {value}
      </p>
      {explanation && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {explanation}
        </p>
      )}
    </article>
  );
}
