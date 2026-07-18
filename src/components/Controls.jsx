import { Pause, Play, RotateCcw, Shuffle, SkipBack, SkipForward } from "lucide-react";

export default function Controls({
  isPlaying,
  onPlay,
  onPause,
  onPrev,
  onNext,
  onReset,
  onRandom,
  input,
  setInput,
  onSetArray,
  speed,
  setSpeed,
  inputError,
}) {
  return (
    <section className="neo-panel p-5">
      <div className="flex flex-wrap items-center gap-3">
        <button className="soft-button" onClick={onPrev}><SkipBack size={17} />Previous</button>
        {isPlaying ? (
          <button className="primary-button" onClick={onPause}><Pause size={17} />Pause</button>
        ) : (
          <button className="primary-button" onClick={onPlay}><Play size={17} />Play</button>
        )}
        <button className="soft-button" onClick={onNext}><SkipForward size={17} />Next</button>
        <button className="soft-button" onClick={onReset}><RotateCcw size={17} />Reset</button>
        <button className="soft-button" onClick={onRandom}><Shuffle size={17} />Random Array</button>
      </div>
      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-350 dark:border-slate-700 px-5 py-2.5 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:focus-within:border-cyan-400 dark:focus-within:ring-cyan-400 transition-all duration-200">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="42, 18, 77, 9, 64"
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400 dark:text-slate-200"
          />
          <button className="primary-button shrink-0 px-5" onClick={onSetArray}>Set</button>
        </div>
        {inputError && <p className="text-sm font-bold text-red-500">{inputError}</p>}
        <label className="neo-inset flex min-w-64 items-center gap-3 px-4 py-3">
          <span className="text-sm font-black">Speed</span>
          <input
            type="range"
            min="180"
            max="1400"
            step="40"
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            className="w-full accent-blue-600 dark:accent-cyan-300"
          />
        </label>
      </div>
    </section>
  );
}
