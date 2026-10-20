export default function PlaybackControls({ playback, cancelStep }) {
  const { index, steps, playing, pending, speed, setSpeed, dispatch, select } =
    playback;
  const replay = !pending && index < steps.length - 1;
  return (
    <section className="neo-panel p-4 space-y-3" aria-label="Playback controls">
      <div className="flex flex-wrap items-center gap-2">
        <button
          className="soft-button"
          onClick={() => select(index - 1)}
          disabled={index === 0}
        >
          Previous
        </button>
        <button
          className="primary-button"
          onClick={() => dispatch({ type: playing ? "pause" : "play" })}
          disabled={!playing && index === steps.length - 1}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          className="soft-button"
          onClick={() => select(index + 1)}
          disabled={index === steps.length - 1}
        >
          Next
        </button>
        <button
          className="soft-button"
          onClick={() => dispatch({ type: "reset" })}
        >
          Reset playback
        </button>
        {pending && (
          <>
            <button
              className="primary-button"
              onClick={() => dispatch({ type: "finish" })}
            >
              Finish operation
            </button>
            <button
              className="soft-button"
              onClick={() => dispatch({ type: "cancel", step: cancelStep })}
            >
              Cancel operation
            </button>
          </>
        )}
        {replay && (
          <button
            className="primary-button"
            onClick={() => dispatch({ type: "live" })}
          >
            Return to live
          </button>
        )}
        <label className="flex items-center gap-2 text-sm font-bold">
          Step delay
          <input
            aria-label="Step delay"
            type="range"
            min="100"
            max="1400"
            step="20"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-28"
          />{" "}
          {speed}ms
        </label>
      </div>
      <p
        className="text-sm font-semibold text-slate-600 dark:text-slate-300"
        role="status"
      >
        {pending
          ? "Operation in progress — Finish commits; Cancel restores the live model."
          : replay
            ? "Read-only replay — return to live to change the model."
            : "Live model — ready for a new operation."}{" "}
        Step {index + 1} / {steps.length}
      </p>
    </section>
  );
}
