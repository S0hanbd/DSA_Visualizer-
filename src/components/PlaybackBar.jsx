import {
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";

const MIN_DELAY = 80;
const MAX_DELAY = 1000;

export default function PlaybackBar({
  isPlaying,
  speed,
  setSpeed,
  currentStep,
  totalSteps,
  onPrevious,
  onPlay,
  onPause,
  onNext,
  onReset,
  onRandom,
  randomLabel = "Random Array",
  disabled = false,
  children,
  status,
  variant = "default",
  onReplay,
}) {
  const atStart = currentStep <= 0;
  const atEnd = totalSteps > 0 && currentStep >= totalSteps - 1;
  const buttonClass =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-px hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-45 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700";

  return (
    <section
      className={`neo-panel flex flex-col gap-4 p-4 sm:p-5 ${variant === "learning" ? "learning-playback" : ""}`}
      aria-label="Playback controls"
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={buttonClass}
          onClick={onPrevious}
          disabled={disabled || atStart}
          aria-label="Previous step"
        >
          <SkipBack size={17} aria-hidden="true" />
          Previous
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:-translate-y-px hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-blue-500 dark:hover:bg-blue-400"
          onClick={isPlaying ? onPause : atEnd && onReplay ? onReplay : onPlay}
          disabled={disabled || (!isPlaying && atEnd && !onReplay)}
        >
          {isPlaying ? (
            <Pause size={17} aria-hidden="true" />
          ) : (
            <Play size={17} aria-hidden="true" />
          )}
          {isPlaying ? "Pause" : atEnd && onReplay ? "Replay" : "Play"}
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={onNext}
          disabled={disabled || atEnd}
          aria-label="Next step"
        >
          <SkipForward size={17} aria-hidden="true" />
          Next
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={onReset}
          disabled={disabled}
          aria-label="Reset playback"
        >
          <RotateCcw size={17} aria-hidden="true" />
          Reset
        </button>
        {onRandom && (
          <button
            type="button"
            className={buttonClass}
            onClick={onRandom}
            disabled={disabled}
          >
            <Shuffle size={17} aria-hidden="true" />
            {randomLabel}
          </button>
        )}
        {children}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
          <span>Speed</span>
          <input
            aria-label="Playback speed"
            type="range"
            min={variant === "learning" ? 0 : MIN_DELAY}
            max={variant === "learning" ? 3 : MAX_DELAY}
            step={variant === "learning" ? 1 : 20}
            value={
              variant === "learning"
                ? [1200, 600, 300, 150].indexOf(speed)
                : Math.max(MIN_DELAY, Math.min(MAX_DELAY, speed))
            }
            aria-valuetext={
              variant === "learning"
                ? `${600 / speed} times speed`
                : `${speed} milliseconds per step`
            }
            onChange={(event) =>
              setSpeed(
                variant === "learning"
                  ? [1200, 600, 300, 150][Number(event.target.value)]
                  : Number(event.target.value),
              )
            }
            className="min-w-20 flex-1 accent-blue-600 dark:accent-cyan-400"
          />
          <span className="min-w-14 text-right tabular-nums">
            {variant === "learning" ? `${600 / speed}×` : `${speed} ms`}
          </span>
        </label>
        <p
          className="text-xs font-semibold text-slate-500 dark:text-slate-400 sm:text-right"
          role={variant === "learning" ? undefined : "status"}
        >
          {status ? `${status} · ` : ""}Step {totalSteps ? currentStep + 1 : 0}{" "}
          of {totalSteps}
        </p>
      </div>
    </section>
  );
}
