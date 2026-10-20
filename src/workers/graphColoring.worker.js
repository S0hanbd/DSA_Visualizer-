import {
  COLORING_LIMITS,
  graphColoringEvents,
} from "../logic/graphColoringSimulation.js";

let activeRun = null;
self.onmessage = ({ data }) => {
  if (data.type === "cancel") {
    if (activeRun) activeRun.cancelled = true;
    return;
  }
  if (data.type !== "start") return;
  if (activeRun) activeRun.cancelled = true;
  const run = { id: data.id, cancelled: false };
  activeRun = run;
  const iterator = graphColoringEvents(data.nodes, data.edges, data.colors, {
    ...data.limits,
    shouldCancel: () => run.cancelled,
  });
  const pump = () => {
    if (activeRun !== run) return;
    const steps = [],
      solutions = [];
    let done = false;
    for (let i = 0; i < COLORING_LIMITS.batchSize; i++) {
      const next = iterator.next();
      if (next.done) {
        done = true;
        break;
      }
      const { solution, ...step } = next.value;
      if (solution) solutions.push(solution);
      steps.push(step);
    }
    self.postMessage({ id: run.id, steps, solutions, done });
    if (!done) setTimeout(pump, 0);
    else activeRun = null;
  };
  pump();
};
