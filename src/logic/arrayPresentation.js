// Presentation metadata is derived once from real snapshots. No algorithm is rerun.
export function presentArrayTrace(steps, slug) {
  let ids = steps[0].array.map((_, i) => `item-${i}`);
  let held = null,
    hole = null,
    merge = null,
    outputIds = [];
  const exchange = [
    "bubble-sort",
    "selection-sort",
    "quick-sort",
    "heap-sort",
  ].includes(slug);
  return steps.map((step, t) => {
    const previous = steps[t - 1];
    if (exchange && step.swaps > (previous?.swaps ?? 0)) {
      const [a, b] =
        step.swapping.length === 2 ? step.swapping : previous.swapping;
      [ids[a], ids[b]] = [ids[b], ids[a]];
    }
    if (["insertion-sort", "shell-sort"].includes(slug)) {
      if (["Set Key", "Pick Key"].includes(step.status)) {
        hole = slug === "insertion-sort" ? step.keyIdx : step.comparing[0];
        held = { id: ids[hole], value: step.array[hole] };
        ids[hole] = null;
      }
      if (held && step.shifts > (previous?.shifts ?? 0)) {
        const source =
          slug === "insertion-sort" ? step.keyIdx : previous.swapping[1];
        ids[hole] = ids[source];
        ids[source] = null;
        hole = source;
      }
      if (held && ["Inserted", "Placed"].includes(step.status)) {
        ids[hole] = held.id;
        held = null;
        hole = null;
      }
    }
    if (slug === "merge-sort") {
      if (["New Pass", "Completed"].includes(step.status)) merge = null;
      if (step.status === "Merging") {
        const { left, mid, right } = step.markers;
        merge = {
          left,
          mid,
          right,
          li: 0,
          ri: 0,
          written: 0,
          leftValues: step.leftBuffer.map((value, i) => ({
            value,
            id: ids[left + i],
          })),
          rightValues: step.rightBuffer.map((value, i) => ({
            value,
            id: ids[mid + 1 + i],
          })),
          output: Array(right - left + 1).fill(null),
        };
      }
      if (merge && ["Placing", "Copying"].includes(step.status)) {
        const l = merge.leftValues[merge.li],
          r = merge.rightValues[merge.ri];
        const fromLeft = l && (!r || l.value <= r.value);
        const item = fromLeft ? l : r;
        if (fromLeft) merge.li++;
        else merge.ri++;
        ids[step.swapping[0]] = item.id;
        merge.output[merge.written++] = item;
      }
    }
    if (["counting-sort", "radix-sort"].includes(slug)) {
      if (["Reconstruct", "New Digit Pass"].includes(step.status))
        outputIds = Array(step.array.length).fill(null);
      if (step.status === "Placing")
        outputIds[step.swapping[0]] = ids[step.comparing[0]];
      if (["Pass Done", "Completed"].includes(step.status) && outputIds.length)
        ids = [...outputIds];
    }
    return {
      ...step,
      presentation: {
        ids: [...ids],
        held,
        hole,
        exchange,
        merge: merge ? { ...merge, output: [...merge.output] } : null,
        outputIds: [...outputIds],
      },
    };
  });
}

export function arrayMetrics(step, slug) {
  if (slug === "binary-search")
    return [
      ["Comparisons", step.comparisons ?? 0],
      [
        "Candidates",
        step.status === "Found"
          ? 1
          : step.status === "Not Found"
            ? 0
            : Math.max(
                0,
                (step.markers.right ?? step.array.length - 1) -
                  (step.markers.left ?? 0) +
                  1,
              ),
      ],
    ];
  if (slug === "linear-search")
    return [
      ["Comparisons", step.comparisons ?? 0],
      [
        step.status === "Found" ? "Found index" : "Current index",
        step.markers.i ?? "—",
      ],
    ];
  if (["counting-sort", "radix-sort"].includes(slug))
    return [
      ["Input reads", step.reads ?? 0],
      ["Writes", step.writes ?? 0],
    ];
  return [
    ["Comparisons", step.comparisons ?? 0],
    [
      step.shifts !== undefined
        ? "Shifts"
        : step.writes !== undefined
          ? "Writes"
          : "Swaps",
      step.shifts ?? step.writes ?? step.swaps ?? 0,
    ],
  ];
}
