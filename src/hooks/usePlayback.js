import { useEffect, useReducer, useState } from "react";
import {
  canMutate,
  createPlaybackState,
  playbackReducer,
} from "../logic/playback.js";

export default function usePlayback(initialModel, initialStep) {
  const [state, dispatch] = useReducer(playbackReducer, null, () =>
    createPlaybackState(initialModel, initialStep),
  );
  const [speed, setSpeed] = useState(480);
  useEffect(() => {
    if (!state.playing) return;
    const timer = setTimeout(() => dispatch({ type: "tick" }), speed);
    return () => clearTimeout(timer);
  }, [state.playing, state.index, state.steps, speed]);
  return {
    ...state,
    dispatch,
    speed,
    setSpeed,
    step: state.steps[state.index],
    canMutate: canMutate(state),
    select: (index) => dispatch({ type: "select", index }),
    begin: (steps, model, label, autoplay = true) =>
      dispatch({ type: "begin", steps, model, label, autoplay }),
  };
}
