export default function ComplexityCard({ label, value, tone = "blue" }) {
  const tones = {
    blue: "text-blue-700 bg-blue-100 dark:text-cyan-200 dark:bg-cyan-400/10",
    green: "text-emerald-700 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-400/10",
    orange: "text-orange-700 bg-orange-100 dark:text-orange-200 dark:bg-orange-400/10",
    red: "text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-400/10",
  };

  return (
    <div className="neo-panel p-4">
      <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-3 inline-flex rounded-2xl px-4 py-2 text-2xl font-black ${tones[tone]}`}>{value}</p>
    </div>
  );
}
