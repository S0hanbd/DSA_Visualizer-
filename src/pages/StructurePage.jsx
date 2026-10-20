import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import CodeViewer from "../components/CodeViewer.jsx";
import ComplexityCard from "../components/ComplexityCard.jsx";
import ExecutionSteps from "../components/ExecutionSteps.jsx";
import PlaybackControls from "../components/PlaybackControls.jsx";
import StackVisualization from "../components/StackVisualization.jsx";
import QueueVisualization from "../components/QueueVisualization.jsx";
import CircularQueueVisualization from "../components/CircularQueueVisualization.jsx";
import QueueUsingStacksVisualization from "../components/QueueUsingStacksVisualization.jsx";
import LinkedListVisualization from "../components/LinkedListVisualization.jsx";
import TreeVisualization from "../components/TreeVisualization.jsx";
import usePlayback from "../hooks/usePlayback.js";
import { algorithmMap } from "../data/algorithms.js";
import { sourceEvent } from "../data/educationalCode.js";
import { LIMITS, parseNumber, parseNumbers } from "../logic/validation.js";
import * as stack from "../logic/stackInteractive.js";
import * as queue from "../logic/queueInteractive.js";
import * as circular from "../logic/circularQueueInteractive.js";
import * as two from "../logic/queueUsingStacksSimulation.js";
import * as list from "../logic/linkedListInteractive.js";
import * as tree from "../logic/treeInteractive.js";
import * as priority from "../logic/priorityQueueInteractive.js";

const listTypes = {
  "singly-linked-list": "linked-list",
  "doubly-linked-list": "doubly-list",
  "circular-linked-list": "circular-list",
};
const ready = (model, slug) => {
  if (slug === "stack-array") return stack.buildInitialStep(model)[0];
  if (listTypes[slug]) return list.buildInitialStep(model, listTypes[slug])[0];
  if (slug === "queue-using-stacks")
    return {
      ...model,
      status: "Ready",
      explanation:
        "Queue initialized. S1 receives items; S2 serves FIFO removal.",
      markers: {},
    };
  if (["linear-queue", "circular-queue"].includes(slug))
    return {
      ...model,
      status: "Ready",
      explanation: "Queue ready.",
      markers: {},
    };
  if (["priority-queue", "max-heap"].includes(slug))
    return {
      array: model,
      tree: priority.calculatePQLayout(model),
      status: "Ready",
      explanation: "Heap ready.",
      markers: {},
    };
  return {
    tree: tree.calculateTreeLayout(model),
    status: "Ready",
    explanation: "Tree ready.",
    markers: {},
  };
};
const initialModel = (slug) =>
  slug === "linear-queue"
    ? queue.buildInitialQueueStep()[0]
    : slug === "circular-queue"
      ? circular.buildInitialCQStep()[0]
      : slug === "queue-using-stacks"
        ? { stack1: [], stack2: [] }
        : listTypes[slug]
          ? [42, 18, 73]
          : ["stack-array", "priority-queue", "max-heap"].includes(slug)
            ? []
            : null;
const treeCount = (root) =>
  root ? 1 + treeCount(root.left) + treeCount(root.right) : 0;

export default function StructurePage({ overrideSlug }) {
  const location = useLocation();
  const slug =
    overrideSlug ?? location.pathname.split("/").filter(Boolean).at(-1);
  const algorithm = algorithmMap[slug];
  if (!algorithm) return <Navigate to="/" replace />;
  return <StructureWorkspace key={slug} slug={slug} algorithm={algorithm} />;
}

function StructureWorkspace({ slug, algorithm }) {
  const initial = initialModel(slug);
  const playback = usePlayback(initial, ready(initial, slug));
  const { committed: model, step, canMutate, begin, dispatch } = playback;
  const [value, setValue] = useState(""),
    [bulk, setBulk] = useState(""),
    [index, setIndex] = useState("");
  const [error, setError] = useState(""),
    [isMax, setIsMax] = useState(true);
  const isList = Boolean(listTypes[slug]);
  const isTree = ["binary-tree", "bst", "avl", "tree-traversal"].includes(slug);
  const isHeap = ["priority-queue", "max-heap"].includes(slug);
  const isQueue = ["linear-queue", "circular-queue"].includes(slug);
  const capacity = isList
    ? LIMITS.list
    : isTree
      ? LIMITS.tree
      : isHeap
        ? 15
        : slug === "queue-using-stacks"
          ? 6
          : 10;
  const currentCount = isTree
    ? treeCount(model)
    : isQueue
      ? model.array.filter((v) => v !== null).length
      : slug === "queue-using-stacks"
        ? model.stack1.length + model.stack2.length
        : model.length;
  const execute = (operation, values = null) => {
    if (!canMutate) return;
    setError("");
    try {
      let steps, finalModel;
      if (isTree) {
        if (operation === "insert") {
          const result =
            slug === "avl"
              ? tree.buildAVLInsertResult(model, values)
              : { steps: tree.buildBSTInsertSteps(model, values) };
          steps = result.steps;
          finalModel = result.finalModel ?? steps.at(-1)?.tree ?? model;
        } else {
          steps = tree.buildTraversalSteps(model, operation);
          finalModel = model;
        }
      } else if (isHeap) {
        if (operation === "insert")
          steps = priority.buildPQInsertSteps(model, values, isMax);
        else if (operation === "peek")
          steps = [
            {
              ...ready(model, slug),
              explanation: model.length
                ? `Root priority: ${model[0].val}.`
                : "Heap is empty.",
              event: "peek",
            },
          ];
        else steps = priority.buildPQExtractSteps(model, isMax);
        if (!steps.length) throw new Error("Heap is empty.");
        finalModel = steps.at(-1).array;
      } else if (isList) {
        const type = listTypes[slug];
        if (operation === "set") {
          finalModel = values;
          steps = [ready(values, slug)];
        } else if (operation === "forward" || operation === "backward") {
          steps = list.buildTraverseSteps(
            model,
            type,
            operation === "backward",
          );
          finalModel = model;
        } else {
          const number = parseNumber(value);
          if (operation.startsWith("insert") && model.length >= capacity)
            throw new Error(`List capacity is ${capacity}.`);
          const builders = {
            insertHead: list.buildInsertHeadSteps,
            insertTail: list.buildInsertTailSteps,
            delete: list.buildDeleteSteps,
            search: list.buildSearchSteps,
          };
          steps =
            operation === "insertAt"
              ? list.buildInsertAtSteps(
                  model,
                  number,
                  parseNumber(index, { max: model.length }),
                  type,
                )
              : builders[operation](model, number, type);
          finalModel = steps.at(-1).array;
        }
      } else {
        const push =
          slug === "stack-array"
            ? (m, v) => stack.buildPushSteps(m, v)
            : slug === "linear-queue"
              ? queue.buildEnqueueSteps
              : slug === "circular-queue"
                ? circular.buildCQEnqueueSteps
                : (m, v) => two.buildEnqueueSteps(m.stack1, m.stack2, v);
        const remove =
          slug === "stack-array"
            ? stack.buildPopSteps
            : slug === "linear-queue"
              ? queue.buildDequeueSteps
              : slug === "circular-queue"
                ? circular.buildCQDequeueSteps
                : (m) => two.buildDequeueSteps(m.stack1, m.stack2);
        const getModel = (s) =>
          slug === "stack-array"
            ? s.array
            : slug === "queue-using-stacks"
              ? { stack1: s.stack1, stack2: s.stack2 }
              : { array: s.array, front: s.front, rear: s.rear };
        if (operation === "insert") {
          let current = model;
          steps = [];
          for (const number of values) {
            const batch = push(current, number);
            if (batch.at(-1).markers?.success === false)
              throw new Error(batch.at(-1).explanation);
            steps.push(...batch);
            current = getModel(batch.at(-1));
          }
          finalModel = current;
        } else {
          steps =
            operation === "peek" ? stack.buildPeekSteps(model) : remove(model);
          finalModel = getModel(steps.at(-1));
        }
      }
      const normalized = steps.map((s) => ({
        ...s,
        status: s.status ?? "Processing",
        event: sourceEvent(s, slug),
      }));
      begin(
        [ready(model, slug), ...normalized],
        finalModel,
        `${operation}: ${values?.join(", ") ?? value}`,
      );
      setValue("");
      setIndex("");
      setBulk("");
    } catch (error) {
      setError(error.message);
    }
  };
  const insert = (isBulk) => {
    try {
      const values = parseNumbers(isBulk ? bulk : value, {
        maxCount: isBulk ? capacity : 1,
      });
      if (currentCount + values.length > capacity)
        throw new Error(
          `Capacity is ${capacity}; ${capacity - currentCount} positions remain.`,
        );
      execute("insert", values);
    } catch (error) {
      setError(error.message);
    }
  };
  const clear = () => {
    const empty = isQueue
      ? initialModel(slug)
      : slug === "queue-using-stacks"
        ? { stack1: [], stack2: [] }
        : isTree
          ? null
          : [];
    dispatch({ type: "clear", model: empty, step: ready(empty, slug) });
    setError("");
  };
  const button = (label, handler) => (
    <button className="soft-button" disabled={!canMutate} onClick={handler}>
      {label}
    </button>
  );
  return (
    <div className="mx-auto flex w-full gap-6 px-4 py-8">
      <Sidebar />
      <div className="min-w-0 flex-1 space-y-6">
        <header className="neo-panel p-6">
          <p className="muted-label">{algorithm.category}</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            {algorithm.title}
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            {algorithm.description}
          </p>
        </header>
        <PlaybackControls playback={playback} cancelStep={ready(model, slug)} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <section className="neo-panel p-5 space-y-4">
            <h2 className="text-xl font-black">Operations</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Model size: {currentCount}/{capacity}. Mutations are available at
              the latest completed state.
            </p>
            <label className="block text-sm font-bold">
              Value (integer 0–9999)
              <input
                className="capsule-input mt-2 w-full"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!canMutate}
                inputMode="numeric"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (isList) execute("insertHead");
                    else insert(false);
                  }
                }}
              />
            </label>
            {isList ? (
              <>
                <label className="block text-sm font-bold">
                  Insertion index (required for Insert at Index)
                  <input
                    className="capsule-input mt-2 w-full"
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                    disabled={!canMutate}
                    inputMode="numeric"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {button("Insert at Head", () => execute("insertHead"))}
                  {button("Insert at Tail", () => execute("insertTail"))}
                  {button("Insert at Index", () => execute("insertAt"))}
                  {button("Search", () => execute("search"))}
                  {button("Delete", () => execute("delete"))}
                  {button("Traverse forward", () => execute("forward"))}
                  {slug === "doubly-linked-list" &&
                    button("Traverse backward", () => execute("backward"))}
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {button(
                  isTree || slug === "max-heap"
                    ? "Insert"
                    : slug === "stack-array"
                      ? "Push"
                      : "Enqueue",
                  () => insert(false),
                )}
                {!isTree &&
                  button(
                    slug === "stack-array"
                      ? "Pop"
                      : slug === "max-heap"
                        ? "Extract max"
                        : "Dequeue",
                    () => execute("remove"),
                  )}
                {(slug === "stack-array" || isHeap) &&
                  button("Peek", () => execute("peek"))}
              </div>
            )}
            <label className="block text-sm font-bold">
              {isList ? "Replace list" : "Bulk insert"} (comma or space
              separated)
              <input
                className="capsule-input mt-2 w-full"
                value={bulk}
                onChange={(e) => setBulk(e.target.value)}
                disabled={!canMutate}
              />
            </label>
            {button(isList ? "Set list" : "Insert all", () => {
              if (isList) {
                try {
                  execute("set", parseNumbers(bulk, { maxCount: capacity }));
                } catch (e) {
                  setError(e.message);
                }
              } else insert(true);
            })}
            {isTree && (
              <div className="flex flex-wrap gap-2">
                {button("In-Order", () => execute("in"))}
                {button("Pre-Order", () => execute("pre"))}
                {button("Post-Order", () => execute("post"))}
                {button("Level-Order", () => execute("level"))}
              </div>
            )}
            {slug === "priority-queue" && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isMax}
                  disabled={!canMutate || currentCount > 0}
                  onChange={(e) => setIsMax(e.target.checked)}
                />{" "}
                Max priority (clear model to change mode)
              </label>
            )}
            {button("Clear model", clear)}
            {error && (
              <p
                role="alert"
                className="font-semibold text-red-600 dark:text-red-300"
              >
                {error}
              </p>
            )}
            {playback.history.length > 0 && (
              <details>
                <summary className="font-bold cursor-pointer">
                  Operation history
                </summary>
                <ol className="mt-2 space-y-1 text-sm">
                  {playback.history.map((entry, i) => (
                    <li key={i}>{entry}</li>
                  ))}
                </ol>
              </details>
            )}
          </section>
          <section
            className="neo-panel min-w-0 overflow-hidden p-3 sm:p-5"
            aria-label="Structure visualization"
          >
            {slug === "stack-array" ? (
              <StackVisualization step={step} />
            ) : slug === "linear-queue" ? (
              <QueueVisualization step={step} />
            ) : slug === "circular-queue" ? (
              <CircularQueueVisualization step={step} />
            ) : slug === "queue-using-stacks" ? (
              <QueueUsingStacksVisualization step={step} />
            ) : isList ? (
              <LinkedListVisualization step={step} algorithm={algorithm} />
            ) : (
              <TreeVisualization tree={step.tree} markers={step.markers} />
            )}
            <p
              role="status"
              className="mt-4 rounded-xl bg-slate-100 dark:bg-slate-800 p-4 text-sm font-semibold break-words"
            >
              {step.explanation}
            </p>
            {step.markers?.history && (
              <p className="mt-3 text-sm font-bold">
                Traversal: {step.markers.history.join(" → ")}
              </p>
            )}
            {isHeap && (
              <div
                className="mt-3 flex flex-wrap gap-2"
                aria-label="Heap array"
              >
                {step.array.map((item, i) => (
                  <span
                    key={item.id}
                    className="rounded border border-slate-300 px-2 py-1 text-sm"
                  >
                    [{i}] {item.val}
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <CodeViewer
            algorithm={algorithm}
            step={step}
            mode={isMax ? "max" : "min"}
            code={algorithm.code}
            language={algorithm.language}
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
