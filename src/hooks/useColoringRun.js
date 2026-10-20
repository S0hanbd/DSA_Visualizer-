import { useEffect, useRef, useState } from "react";
import { topologyKey } from "../logic/validation.js";

const empty = () => ({
  steps: [
    {
      status: "Idle",
      explanation: "Build a graph, choose colors, then Run search.",
      markers: {},
      solutionCount: 0,
    },
  ],
  solutions: [],
  generating: false,
  outcome: "idle",
});
export default function useColoringRun(nodes, edges, colors) {
  const key = topologyKey(nodes, edges);
  const [run, setRun] = useState(empty);
  const workerRef = useRef(null),
    idRef = useRef(0);
  useEffect(() => {
    idRef.current++;
    workerRef.current?.terminate();
    workerRef.current = null;
    setRun(empty());
    return () => {
      const worker = workerRef.current;
      if (worker) { worker.onmessage = null; worker.onerror = null; }
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [key, colors]);
  const start = () => {
    workerRef.current?.terminate();
    const id = ++idRef.current;
    setRun({ ...empty(), generating: true, outcome: "running" });
    try {
      const worker = new Worker(
        new URL("../workers/graphColoring.worker.js", import.meta.url),
        { type: "module" },
      );
      workerRef.current = worker;
      worker.onmessage = ({ data }) => {
        if (data.id !== idRef.current) return;
        setRun((previous) => ({
          steps:
            previous.outcome === "running" &&
            previous.steps[0]?.status === "Idle"
              ? data.steps
              : [...previous.steps, ...data.steps],
          solutions: [...previous.solutions, ...data.solutions],
          generating: !data.done,
          outcome: data.steps.at(-1)?.outcome ?? previous.outcome,
        }));
        if (data.done) {
          worker.terminate();
          workerRef.current = null;
        }
      };
      worker.onerror = () => {
        if (id !== idRef.current) return;
        setRun({
          ...empty(),
          outcome: "invalid",
          steps: [
            {
              status: "Error",
              explanation:
                "The worker could not start. Reload this page and retry.",
              markers: {},
              outcome: "invalid",
            },
          ],
        });
        worker.terminate();
        workerRef.current = null;
      };
      worker.postMessage({
        type: "start",
        id,
        nodes: nodes.map(({ id }) => ({ id })),
        edges,
        colors,
      });
    } catch (error) {
      setRun({
        ...empty(),
        outcome: "invalid",
        steps: [
          {
            status: "Error",
            explanation: error.message,
            markers: {},
            outcome: "invalid",
          },
        ],
      });
    }
  };
  const cancel = () => {
    idRef.current++;
    workerRef.current?.terminate();
    workerRef.current = null;
    setRun((previous) => ({
      ...previous,
      generating: false,
      outcome: "cancelled",
      steps: [
        ...previous.steps,
        {
          ...previous.steps.at(-1),
          status: "Cancelled",
          outcome: "cancelled",
          explanation: "Search cancelled. Retained results are partial.",
        },
      ],
    }));
  };
  return { ...run, start, cancel, topologyVersion: key };
}
