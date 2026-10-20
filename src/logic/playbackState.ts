export interface TimelineStep {
  status: string;
  explanation: string;
  event?: string | null;
  markers?: Record<string, unknown>;
  [payload: string]: unknown;
}
export interface PlaybackState<Model> {
  committed: Model;
  steps: TimelineStep[];
  index: number;
  playing: boolean;
  pending: null | { model: Model; label: string };
  history: string[];
}
export type PlaybackAction<Model> =
  | {
      type: "begin";
      steps: TimelineStep[];
      model: Model;
      label?: string;
      autoplay?: boolean;
    }
  | { type: "select"; index: number }
  | { type: "cancel"; step: TimelineStep }
  | { type: "clear" | "replace"; model: Model; step: TimelineStep }
  | { type: "tick" | "play" | "pause" | "finish" | "live" | "reset" };

export function createPlaybackState<Model>(
  model: Model,
  initialStep: TimelineStep,
): PlaybackState<Model> {
  return {
    committed: model,
    steps: [initialStep],
    index: 0,
    playing: false,
    pending: null,
    history: [],
  };
}
export const canMutate = <Model>(state: PlaybackState<Model>): boolean =>
  !state.pending && state.index === state.steps.length - 1;
function select<Model>(
  state: PlaybackState<Model>,
  index: number,
  playing = false,
): PlaybackState<Model> {
  const next = Math.max(0, Math.min(state.steps.length - 1, index));
  if (next === state.steps.length - 1 && state.pending)
    return {
      ...state,
      index: next,
      playing: false,
      committed: state.pending.model,
      history: [state.pending.label, ...state.history].slice(0, 50),
      pending: null,
    };
  return {
    ...state,
    index: next,
    playing: playing && next < state.steps.length - 1,
  };
}
export function playbackReducer<Model>(
  state: PlaybackState<Model>,
  action: PlaybackAction<Model>,
): PlaybackState<Model> {
  switch (action.type) {
    case "begin":
      return !canMutate(state) || !action.steps.length
        ? state
        : {
            ...state,
            steps: action.steps,
            index: 0,
            playing: action.autoplay ?? true,
            pending: {
              model: action.model,
              label: action.label ?? "Operation completed",
            },
          };
    case "tick":
      return select(state, state.index + 1, state.playing);
    case "select":
      return select(state, action.index);
    case "play":
      return { ...state, playing: state.index < state.steps.length - 1 };
    case "pause":
      return { ...state, playing: false };
    case "finish":
      return select(state, state.steps.length - 1);
    case "live":
      return state.pending ? state : select(state, state.steps.length - 1);
    case "reset":
      return { ...state, index: 0, playing: false };
    case "cancel":
      return state.pending
        ? {
            ...state,
            steps: [action.step],
            index: 0,
            playing: false,
            pending: null,
          }
        : state;
    case "clear":
      return canMutate(state)
        ? createPlaybackState(action.model, action.step)
        : state;
    case "replace":
      return createPlaybackState(action.model, action.step);
  }
}
