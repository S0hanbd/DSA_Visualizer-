import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import CodeViewer from "../components/CodeViewer.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import ComplexityCard from "../components/ComplexityCard.jsx";
import PlaybackControls from "../components/PlaybackControls.jsx";
import usePlayback from "../hooks/usePlayback.js";
import {
  advancedBuilders,
  advancedExamples,
} from "../logic/advancedSimulations.js";
import { algorithmMap } from "../data/algorithms.js";

const display = (value) =>
  value === Infinity
    ? "∞"
    : value === -Infinity
      ? "−∞"
      : typeof value === "number"
        ? Number(value.toFixed(4))
        : value;
function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th className="p-2 border-b border-slate-300" scope="col" key={h}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  className="p-2 border-b border-slate-200 dark:border-slate-700"
                  key={j}
                >
                  {display(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function StateView({ state, slug }) {
  if (!state)
    return <p>Load the example or edit the input, then Run simulation.</p>;
  if (slug === "fractional-knapsack")
    return (
      <>
        <p className="mb-4 font-bold">
          Value: {display(state.totalValue)} · Remaining capacity:{" "}
          {display(state.remaining)}
        </p>
        <Table
          headers={["Item", "Weight", "Value", "Ratio", "Selected fraction"]}
          rows={state.items.map((item) => [
            item.id,
            item.weight,
            item.value,
            item.value / item.weight,
            state.selected.find((s) => s.id === item.id)?.fraction ?? 0,
          ])}
        />
      </>
    );
  if (slug === "job-scheduling")
    return (
      <>
        <p className="mb-4 font-bold">
          Total profit: {display(state.totalProfit)}
        </p>
        <Table
          headers={["Slot (1-based)", "Job", "Deadline", "Profit"]}
          rows={state.slots.map((job, i) => [
            i + 1,
            job?.id ?? "Free",
            job?.deadline ?? "—",
            job?.profit ?? "—",
          ])}
        />
      </>
    );
  if (slug === "bellman-ford")
    return (
      <>
        <p className="mb-4">
          Directed edges; ∞ = unreachable, −∞ = affected by a reachable negative
          cycle.
        </p>
        <Table
          headers={["Node", "Distance", "Parent"]}
          rows={state.nodes.map((id) => [
            id,
            state.distances[id],
            state.parents[id] ?? "—",
          ])}
        />
      </>
    );
  if (slug === "floyd-warshall")
    return (
      <>
        <p className="mb-4">
          All-pairs directed distances; −∞ marks paths affected by negative
          cycles.
        </p>
        <Table
          headers={["From / To", ...state.nodes]}
          rows={state.nodes.map((id, i) => [id, ...state.distances[i]])}
        />
      </>
    );
  return (
    <div className="space-y-4">
      <p className="text-sm">
        ASCII byte indices; overlapping matches are included. An empty pattern
        matches every boundary.
      </p>
      <div
        className="overflow-x-auto rounded-xl bg-slate-100 dark:bg-slate-800 p-4"
        aria-label="Text window"
      >
        <div className="flex min-w-max gap-1">
          {[...state.text].map((c, i) => (
            <span
              key={i}
              className={`flex flex-col items-center rounded border px-2 py-1 ${i >= state.start && i < state.start + state.length ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : "border-slate-300"}`}
            >
              <span className="text-xs">{i}</span>
              <span className="font-mono font-bold">{c === " " ? "␣" : c}</span>
            </span>
          ))}
        </div>
      </div>
      <p>
        Pattern:{" "}
        <code className="break-all">{JSON.stringify(state.pattern)}</code>
      </p>
      {state.windowHash !== undefined && (
        <p>
          Window hash: {state.windowHash} · Pattern hash: {state.patternHash}
        </p>
      )}
      <p className="font-bold">
        Verified matches: [{state.matches.join(", ")}]
      </p>
    </div>
  );
}

export default function AdvancedPage() {
  const location = useLocation(),
    slug = location.pathname.split("/").at(-1);
  return <Workspace key={slug} slug={slug} />;
}
function Workspace({ slug }) {
  const algorithm = algorithmMap[slug],
    example = advancedExamples[slug];
  const [input, setInput] = useState(() => JSON.stringify(example, null, 2)),
    [error, setError] = useState("");
  const idle = {
    status: "Ready",
    explanation: "Edit the validated example, then Run simulation.",
    markers: {},
  };
  const playback = usePlayback(example, idle);
  const run = () => {
    try {
      const data = JSON.parse(input);
      const result = advancedBuilders[slug](data);
      playback.begin([idle, ...result.steps], data, "Simulation completed");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="mx-auto flex w-full gap-6 px-4 py-8">
      <Sidebar />
      <div className="min-w-0 flex-1 space-y-6">
        <header className="neo-panel p-6">
          <p className="muted-label">{algorithm.category}</p>
          <h1 className="mt-2 text-3xl font-black">{algorithm.title}</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            {algorithm.description}
          </p>
        </header>
        <section className="neo-panel p-5 space-y-4">
          <label className="block font-bold">
            Simulation input (JSON)
            <textarea
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 dark:bg-slate-800 p-4 font-mono text-sm"
              rows={9}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!playback.canMutate}
            />
          </label>
          <p className="text-sm">
            Use the example's field names. Limits: 12 items/jobs, 8 graph nodes
            and 32 directed edges, or 200 text / 80 pattern characters. Item
            weights must be positive; job deadlines are 1–20. Ties retain input
            order.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="primary-button"
              disabled={!playback.canMutate}
              onClick={run}
            >
              Run simulation
            </button>
            <button
              className="soft-button"
              disabled={!playback.canMutate}
              onClick={() => {
                setInput(JSON.stringify(example, null, 2));
                setError("");
              }}
            >
              Load example
            </button>
          </div>
          {error && (
            <p role="alert" className="text-red-600 dark:text-red-300">
              {error}
            </p>
          )}
        </section>
        <PlaybackControls playback={playback} cancelStep={idle} />
        <section className="neo-panel p-5 space-y-4">
          <h2 className="text-xl font-black">Simulation state</h2>
          <StateView state={playback.step.state} slug={slug} />
          <p role="status" className="font-semibold">
            {playback.step.explanation}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            {Object.entries(playback.step.metrics ?? {}).map(
              ([name, value]) => (
                <span key={name}>
                  {name}: {value}
                </span>
              ),
            )}
          </div>
        </section>
        <div className="grid gap-6 lg:grid-cols-2">
          <CodeViewer
            algorithm={algorithm}
            step={playback.step}
            code={algorithm.code}
          />
          <ExecutionSteps
            steps={playback.steps}
            currentStep={playback.index}
            onStepClick={playback.select}
          />
        </div>
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.entries(algorithm.complexities).map(([label, value]) => (
            <ComplexityCard key={label} label={label} value={value} />
          ))}
        </section>
      </div>
    </div>
  );
}
