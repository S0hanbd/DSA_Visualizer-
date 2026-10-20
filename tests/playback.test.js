import test from "node:test";
import assert from "node:assert/strict";
import {
  canMutate,
  createPlaybackState,
  playbackReducer as reduce,
} from "../src/logic/playback.js";
const initial = { array: [], status: "Ready", explanation: "Empty" };
const steps = [
  initial,
  { array: [1], status: "Insert", explanation: "Insert" },
  { array: [1, 2], status: "Done", explanation: "Complete" },
];
test("operations commit atomically, paused operations cannot start new mutations", () => {
  let s = createPlaybackState([], initial);
  s = reduce(s, { type: "begin", steps, model: [1, 2] });
  s = reduce(s, { type: "tick" });
  s = reduce(s, { type: "pause" });
  assert.deepEqual(s.committed, []);
  assert.equal(canMutate(s), false);
  assert.equal(reduce(s, { type: "begin", steps, model: [3] }), s);
  s = reduce(s, { type: "finish" });
  assert.deepEqual(s.committed, [1, 2]);
  assert.equal(canMutate(s), true);
  s = reduce(s, { type: "reset" });
  assert.equal(canMutate(s), false);
  assert.deepEqual(s.committed, [1, 2]);
  s = reduce(s, { type: "live" });
  assert.equal(canMutate(s), true);
});
test("cancel restores committed state; step selection completes exactly once; Clear differs from reset", () => {
  let s = createPlaybackState([], initial);
  s = reduce(s, { type: "begin", steps, model: [1, 2] });
  s = reduce(s, { type: "select", index: 1 });
  s = reduce(s, { type: "cancel", step: initial });
  assert.deepEqual(s.committed, []);
  assert.equal(s.steps.length, 1);
  s = reduce(s, { type: "begin", steps, model: [1, 2] });
  s = reduce(s, { type: "select", index: 2 });
  assert.deepEqual(s.committed, [1, 2]);
  assert.equal(s.history.length, 1);
  s = reduce(s, { type: "finish" });
  assert.equal(s.history.length, 1);
  s = reduce(s, { type: "clear", model: [], step: initial });
  assert.deepEqual(s.committed, []);
});
