import PlaybackBar from "./PlaybackBar.jsx";

export default function PlaybackControls({ playback, cancelStep, children }) {
  const { index, steps, playing, pending, speed, setSpeed, dispatch, select } =
    playback;
  const replay = !pending && index < steps.length - 1;
  const status = pending
    ? "Operation in progress — Finish commits; Cancel restores the live model."
    : replay
      ? "Read-only replay — return to live to change the model."
      : "Live model — ready for a new operation.";

  return (
    <PlaybackBar
      isPlaying={playing}
      speed={speed}
      setSpeed={setSpeed}
      currentStep={index}
      totalSteps={steps.length}
      onPrevious={() => select(index - 1)}
      onPlay={() => dispatch({ type: "play" })}
      onPause={() => dispatch({ type: "pause" })}
      onNext={() => select(index + 1)}
      onReset={() => dispatch({ type: "reset" })}
      status={status}
    >
      {pending && (
        <>
          <button
            type="button"
            className="primary-button"
            onClick={() => dispatch({ type: "finish" })}
          >
            Finish operation
          </button>
          <button
            type="button"
            className="soft-button"
            onClick={() => dispatch({ type: "cancel", step: cancelStep })}
          >
            Cancel operation
          </button>
        </>
      )}
      {replay && (
        <button
          type="button"
          className="primary-button"
          onClick={() => dispatch({ type: "live" })}
        >
          Return to live
        </button>
      )}
      {children}
    </PlaybackBar>
  );
}
