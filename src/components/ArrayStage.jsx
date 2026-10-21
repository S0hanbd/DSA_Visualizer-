import { motion, useReducedMotion } from "framer-motion";

function stateAt(index, step, slug) {
  if (slug.includes("search")) {
    if (step.status === "Found" && step.index === index) return "done";
    if (slug === "binary-search") {
      const { left = 0, right = step.array.length - 1, mid } = step.markers;
      if (index < left || index > right) return "excluded";
      if (index === mid) return "compare";
      return "active";
    }
    if (step.status === "Not Found" || index < (step.markers.i ?? 0))
      return "checked";
    return index === step.markers.i ? "compare" : "idle";
  }
  if (step.status === "Completed") return "done";
  if (
    slug === "quick-sort" &&
    step.activeRange &&
    (index < step.activeRange[0] || index > step.activeRange[1]) &&
    !step.sorted?.includes(index)
  )
    return "inactive";
  if (step.presentation.hole === index) return "hole";
  if (
    step.sorted?.includes(index) &&
    !["merge-sort", "insertion-sort"].includes(slug)
  )
    return "done";
  if (slug === "merge-sort") {
    if (
      ["Placing", "Copying"].includes(step.status) &&
      step.swapping.includes(index)
    )
      return "move";
    if (step.sorted.includes(index)) return "ordered";
    const range = step.presentation.merge;
    return range && index >= range.left && index <= range.right
      ? "active"
      : "idle";
  }
  if (["counting-sort", "radix-sort"].includes(slug))
    return step.comparing?.includes(index) ? "compare" : "idle";
  if (step.swapping?.includes(index)) return "move";
  if (step.minIdx === index || step.markers?.pivot === index) return "active";
  if (step.comparing?.includes(index)) return "compare";
  if (step.sorted?.includes(index)) return "ordered";
  return "idle";
}

function DigitValue({ value, exp, width }) {
  if (!exp) return value;
  const original = String(value),
    digits = original.padStart(width, "0");
  return (
    <span aria-label={String(value)}>
      {[...digits].map((digit, i) =>
        i === digits.length - 1 - Math.log10(exp) ? (
          <mark key={i}>{digit}</mark>
        ) : (
          <span
            key={i}
            className={i < width - original.length ? "alignment-zero" : ""}
          >
            {digit}
          </span>
        ),
      )}
    </span>
  );
}

export function ValueLane({
  label,
  values,
  offset = 0,
  highlight = -1,
  tone = "compare",
}) {
  return (
    <div className="value-lane">
      <p className="lane-label">{label}</p>
      <div className="lane-scroll" tabIndex={0} aria-label={label}>
        <div className="small-cells">
          {values.map((item, index) => {
            const value = item && typeof item === "object" ? item.value : item;
            const identity =
              item && typeof item === "object" && item.id
                ? Number(item.id.slice(5)) + 1
                : null;
            return (
              <div
                key={index}
                className={`small-cell ${index === highlight ? `state-${tone}` : ""}`}
              >
                <span>{value ?? "—"}</span>
                <small>
                  {index + offset}
                  {identity && <span> · id {identity}</span>}
                </small>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CountLane({ values, active }) {
  const groups = [];
  values.forEach((value, index) => {
    const last = groups.at(-1);
    if (last && last.value === value && index !== active && last.end !== active)
      last.end = index;
    else groups.push({ start: index, end: index, value });
  });
  return (
    <div className="value-lane">
      <p className="lane-label">
        Value → count <span>· equal neighboring counts are grouped</span>
      </p>
      <div className="lane-scroll" tabIndex={0} aria-label="Count table">
        <div className="count-cells">
          {groups.map(({ start, end, value }) => (
            <div
              key={start}
              className={`small-cell ${start === active ? "state-compare" : ""}`}
            >
              <small>{start === end ? start : `${start}–${end}`}</small>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeapLane({ step }) {
  const size = step.markers.heapSize ?? step.array.length;
  const treeHeight = 60 + Math.floor(Math.log2(Math.max(1, size))) * 56;
  const point = (index) => {
    const depth = Math.floor(Math.log2(index + 1));
    return {
      x: ((index - (2 ** depth - 1) + 0.5) * 720) / 2 ** depth + 20,
      y: 30 + depth * 56,
    };
  };
  return (
    <div className="heap-lane">
      <p className="lane-label">
        Heap structure{" "}
        <span>· {size} active values · indexes match the array below</span>
      </p>
      {size ? (
        <div className="lane-scroll" tabIndex={0} aria-label="Heap structure">
          <svg
            viewBox={`0 0 760 ${treeHeight}`}
            height={treeHeight}
            role="img"
            aria-label={`Active heap: ${step.array.slice(0, size).join(", ")}`}
          >
            {step.array.slice(0, size).map((value, i) => {
              const p = point(i),
                parent = point(Math.floor((i - 1) / 2));
              return (
                <g key={i}>
                  {i > 0 && (
                    <line x1={parent.x} y1={parent.y} x2={p.x} y2={p.y} />
                  )}
                  <g
                    className={`heap-node state-${stateAt(i, step, "heap-sort")}`}
                  >
                    <circle cx={p.x} cy={p.y} r="20" />
                    <text x={p.x} y={p.y + 5} textAnchor="middle">
                      {value}
                    </text>
                  </g>
                  <text className="heap-index" x={p.x + 27} y={p.y + 5}>
                    {i}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        <p>Heap exhausted. Every value is in its final position.</p>
      )}
    </div>
  );
}

export default function ArrayStage({
  step,
  algorithm,
  target,
  scale,
  original,
}) {
  const reduceMotion = useReducedMotion();
  const slug = algorithm.slug,
    search = algorithm.type === "searching";
  const { ids, held, hole, exchange, merge } = step.presentation;
  const movingItems =
    exchange || ["insertion-sort", "shell-sort"].includes(slug);
  const duplicates = original && new Set(original).size < original.length;
  const binary = slug === "binary-search";
  const bars = ["bubble-sort", "selection-sort", "quick-sort"].includes(slug);
  const pointers = (i) => {
    const labels = [];
    const m = step.markers ?? {};
    if (binary) {
      if (i === m.left) labels.push("low");
      if (i === m.mid) labels.push("mid");
      if (i === m.right) labels.push("high");
    }
    if (slug === "linear-search" && i === m.i) labels.push("current");
    if (slug === "selection-sort") {
      if (i === step.minIdx) labels.push("min");
      if (step.pass > 0 && i === step.pass - 1) labels.push("destination");
      if (step.comparing?.includes(i)) labels.push("scan");
    }
    if (slug === "quick-sort") {
      if (i === m.pivot) labels.push("pivot");
      if (i === m.i) labels.push("boundary");
      if (i === m.j) labels.push("scan");
    }
    if (slug === "shell-sort" && held && (i - hole) % m.gap === 0)
      labels.push(`gap ${m.gap}`);
    return labels;
  };
  return (
    <div className="array-stage" aria-label="Array visualization">
      <div className="stage-caption">
        <span>{search ? "Search the array" : "Array"}</span>
        {search ? (
          <strong>
            Target <span className="target-value">{target}</span>
          </strong>
        ) : (
          <span>Indexes start at 0</span>
        )}
      </div>
      {slug === "heap-sort" && <HeapLane step={step} />}
      {held && (
        <p className="holding-lane">
          Holding key <strong>{held.value}</strong>
          <small>id {Number(held.id.slice(5)) + 1}</small>
          <span>
            The dashed slot is the gap; shifting moves a value into it.
          </span>
        </p>
      )}
      {slug === "quick-sort" &&
        step.status !== "Completed" &&
        (step.activeRange || step.markers.low !== undefined) && (
        <p className="range-context">
          {step.status === "Base Case" ? "Base-case range" : "Active partition"}
          : array[{step.activeRange?.[0] ?? step.markers.low}…
          {step.activeRange?.[1] ?? step.markers.high}] · Lomuto partition with
          a last-value pivot
          {step.markers.i === -1
            ? ` · boundary starts before index ${step.activeRange?.[0] ?? step.markers.low}`
            : ""}
        </p>
      )}
      {slug === "quick-sort" && (
        <details className="partition-overview">
          <summary>Show partitions</summary>
          <p>
            This implementation uses a stack of ranges, processing the right
            range first.
          </p>
          <p>
            Pending:{" "}
            {step.pendingRanges
              ?.filter(([low, high]) => low <= high)
              .map(([low, high]) => `[${low}…${high}]`)
              .join(", ") || "None"}
          </p>
          <ol>
            {step.partitions?.map(({ low, high, pivot }, i) => (
              <li key={i}>
                array[{low}…{high}] → pivot at {pivot}; left{" "}
                {low < pivot ? `[${low}…${pivot - 1}]` : "empty"}; right{" "}
                {pivot < high ? `[${pivot + 1}…${high}]` : "empty"}
              </li>
            ))}
          </ol>
        </details>
      )}
      {slug === "shell-sort" && step.markers.gap && (
        <p className="range-context">
          Gap {step.markers.gap} · positions in one subsequence are marked
          together. Gapped order is not final order.
        </p>
      )}
      {slug === "radix-sort" && step.markers.exp && (
        <p className="range-context">
          Base 10 ·{" "}
          {step.markers.exp === 1
            ? "ones"
            : step.markers.exp === 10
              ? "tens"
              : "hundreds"}{" "}
          digit · faint leading zeros only align the digits
        </p>
      )}
      <div
        className="lane-scroll main-array-scroll"
        tabIndex={0}
        aria-label="Indexed array"
      >
        <div className={`array-items ${bars ? "bar-items" : "cell-items"}`}>
          {step.array.map((value, i) => {
            const state = stateAt(i, step, slug),
              labels = pointers(i);
            return (
              <motion.div
                key={movingItems ? (ids[i] ?? `hole-${i}`) : `${ids[i]}-${i}`}
                layout={movingItems && !reduceMotion ? "position" : false}
                transition={{ duration: 0.24 }}
                className={`array-item state-${state} ${binary && state !== "excluded" ? "in-interval" : ""}`}
                aria-label={`Index ${i}: ${hole === i ? "gap" : value}, ${state}${labels.length ? `, ${labels.join(", ")}` : ""}`}
              >
                <div className="pointer-label">
                  {labels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
                {bars ? (
                  <>
                    <strong className="bar-value">{value}</strong>
                    <div
                      className="data-bar"
                      style={{ height: `${(value / scale) * 120}px` }}
                    />
                  </>
                ) : (
                  <div className="data-cell">
                    {hole === i ? (
                      "—"
                    ) : (
                      <DigitValue
                        value={value}
                        exp={slug === "radix-sort" ? step.markers.exp : null}
                        width={String(scale).length}
                      />
                    )}
                  </div>
                )}
                <span className="cell-index">
                  {i}
                  {duplicates && ids[i] && (
                    <small className="identity-tag">
                      id {Number(ids[i].slice(5)) + 1}
                    </small>
                  )}
                </span>
                <span className="cell-state">
                  {state === "done"
                    ? search
                      ? "found"
                      : "final"
                    : state === "excluded"
                      ? "excluded"
                      : state === "inactive"
                        ? "outside range"
                      : state === "checked"
                        ? "checked"
                        : state === "ordered"
                          ? "prefix"
                          : ""}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
      {binary && (
        <p className="interval-caption">
          {step.status === "Not Found"
            ? "Empty interval — no match."
            : `Inclusive interval: ${step.markers.left ?? 0} through ${step.markers.right ?? step.array.length - 1}.`}{" "}
          Returned indexes refer to this sorted array; any matching duplicate
          may be returned.
        </p>
      )}
      <div className="stage-legend" aria-label="Visualization legend">
        <span className="legend-compare">Comparing</span>
        <span className="legend-active">
          {search ? "Candidate interval" : "Active position"}
        </span>
        <span className="legend-done">
          {search ? "Found" : "Final position"}
        </span>
        {!search && <span className="legend-move">Swap / shift / write</span>}
      </div>
      {duplicates && (
        <p className="interval-caption">
          Small id tags track each original item, including equal values.
        </p>
      )}
      {slug === "merge-sort" &&
        (merge ? (
          <div className="support-lanes" aria-label="Merge workspace">
            <p className="range-context">
              Bottom-up merge · array[{merge.left}…{merge.right}] · run width{" "}
              {2 ** (step.pass - 1)}
            </p>
            <ValueLane
              label={`Left run [${merge.left}…${merge.mid}]`}
              values={merge.leftValues}
              offset={merge.left}
              highlight={step.status === "Comparing" ? merge.li : -1}
            />
            <ValueLane
              label={`Right run [${merge.mid + 1}…${merge.right}]`}
              values={merge.rightValues}
              offset={merge.mid + 1}
              highlight={step.status === "Comparing" ? merge.ri : -1}
            />
            <ValueLane
              label="Written back to the array"
              tone="move"
              values={merge.output}
              offset={merge.left}
              highlight={
                ["Placing", "Copying"].includes(step.status)
                  ? merge.written - 1
                  : -1
              }
            />
            <p className="interval-caption">
              Equal values come from the left run first. A merged run is locally
              ordered; the whole array finishes after the final pass.
            </p>
          </div>
        ) : (
          <p className="range-context">
            {step.status === "Completed"
              ? "All runs have been merged."
              : "Single values begin as sorted runs. Each pass merges adjacent runs, doubling their width."}
          </p>
        ))}
      {["counting-sort", "radix-sort"].includes(slug) && (
        <div className="support-lanes">
          {!!step.count?.length && (
            <CountLane values={step.count} active={step.markers.countIndex} />
          )}
          {!!step.output?.length && (
            <ValueLane
              label="Output · unwritten positions show a dash"
              tone="move"
              values={step.output.map((value, index) =>
                value === null
                  ? null
                  : { value, id: step.presentation.outputIds[index] },
              )}
              highlight={step.status === "Placing" ? step.swapping[0] : -1}
            />
          )}
        </div>
      )}
    </div>
  );
}
