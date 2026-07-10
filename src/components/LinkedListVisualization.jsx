import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const NODE_HEIGHT = 80;
const SPACING = 70;

function getNodeWidth(isDoubly) {
    return isDoubly ? 156 : 108;
}

// ─── Colors per step state ───────────────────────────────────────────────────
function nodeColors(index, step, overrideIsNew = false) {
  const { comparing = [], swapping = [], sorted = [], markers = {} } = step;
  const isNew      = markers.newNode === index || overrideIsNew;
  const isDeleting = markers.deleting === index || swapping.includes(index);
  const isFound    = sorted.includes(index);
  const isActive   = comparing.includes(index);

  if (isNew)      return { ring: "ring-2 ring-emerald-400", bg: "bg-emerald-950/70 dark:bg-emerald-950/80", glow: "shadow-[0_0_18px_rgba(52,211,153,0.5)]", label: "text-emerald-300" };
  if (isDeleting) return { ring: "ring-2 ring-red-400",     bg: "bg-red-950/70",     glow: "shadow-[0_0_18px_rgba(248,113,113,0.5)]", label: "text-red-300" };
  if (isFound)    return { ring: "ring-2 ring-emerald-300", bg: "bg-emerald-900/60", glow: "shadow-[0_0_14px_rgba(110,231,183,0.45)]", label: "text-emerald-200" };
  if (isActive)   return { ring: "ring-2 ring-orange-400",  bg: "bg-orange-950/70",  glow: "shadow-[0_0_14px_rgba(251,146,60,0.45)]",  label: "text-orange-200" };
  return           { ring: "ring-1 ring-slate-600/60",      bg: "bg-slate-800/80 dark:bg-slate-800/90", glow: "", label: "text-slate-100" };
}

// ─── single node box ─────────────────────────────────────────────────────────
function NodeBox({ value, index, isDoubly, isHead, isTail, step }) {
  const isLast = step.array.length - 1 === index;
  const isCircular = step.structure === "circular-list";
  const { ring, bg, glow, label } = nodeColors(index, step);
  const { markers = {} } = step;
  const isNew = markers.newNode === index;

  return (
    <motion.div
      layout
      key={`node-${index}`}
      initial={{ scale: 0.5, opacity: 0, y: -28 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.4, opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 220, damping: 22, delay: isNew ? 0.08 : 0 }}
      className="flex flex-col items-center gap-1.5"
    >
      {/* HEAD / TAIL badge */}
      <div className="flex h-6 items-center gap-1.5">
        {isHead && (
          <span className="rounded-md border border-slate-300 bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-900">
            HEAD
          </span>
        )}
        {isTail && isDoubly && !isHead && (
          <span className="rounded-md border border-slate-300 bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-900">
            TAIL
          </span>
        )}
        {isTail && isCircular && !isHead && (
          <span className="rounded-md border border-slate-300 bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-900">
            TAIL
          </span>
        )}
      </div>

      {/* Downward arrow to node for head */}
      {isHead && <div className="h-3 w-px bg-amber-400/70" />}

      {/* Node box */}
      <div className={`flex items-stretch overflow-hidden rounded-2xl transition-all duration-300 ${ring} ${bg} ${glow}`}>

        {/* PREV slot (doubly only) */}
        {isDoubly && (
          <div className="flex min-w-[2.8rem] flex-col items-center justify-center border-r border-slate-600/60 bg-cyan-950/50 px-2 py-2.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-cyan-500">Prev</span>
            <span className="mt-1 text-xs font-black text-cyan-300">
              {isHead ? "∅" : "●"}
            </span>
          </div>
        )}

        {/* DATA slot */}
        <div className="flex min-w-[3.6rem] flex-col items-center justify-center px-3 py-2.5">
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Data</span>
          <span className={`mt-1 text-2xl font-black ${label}`}>{value}</span>
        </div>

        {/* NEXT slot */}
        <div className="flex min-w-[2.8rem] flex-col items-center justify-center border-l border-slate-600/60 bg-blue-950/50 px-2 py-2.5">
          <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">Next</span>
          <span className="mt-1 text-xs font-black text-blue-300">
            {isLast && !isCircular ? "∅" : "●"}
          </span>
        </div>
      </div>

      {/* Index label */}
      <span className="text-[10px] font-bold text-slate-500">[{index}]</span>
    </motion.div>
  );
}

// ─── arrow between nodes ─────────────────────────────────────────────────────
function Arrow({ highlighted, isDoubly }) {
  return (
    <div className="mb-8 flex flex-shrink-0 flex-col items-center justify-center gap-0.5">
      {isDoubly && (
        <motion.span
          animate={{ opacity: highlighted ? 1 : 0.3, scale: highlighted ? 1.15 : 1 }}
          transition={{ duration: 0.2 }}
          className={`text-base font-black transition-colors ${highlighted ? "text-cyan-400" : "text-slate-600"}`}
        >
          ←
        </motion.span>
      )}
      <motion.span
        animate={{ opacity: highlighted ? 1 : 0.35, scale: highlighted ? 1.15 : 1 }}
        transition={{ duration: 0.2 }}
        className={`text-2xl font-black transition-colors ${highlighted ? "text-blue-400" : "text-slate-600"}`}
      >
        →
      </motion.span>
    </div>
  );
}

// ─── NULL terminal ────────────────────────────────────────────────────────────
function NullTerminal() {
  return (
    <div className="mb-8 flex items-center gap-1.5">
      <span className="text-lg font-black text-slate-600">→</span>
      <span className="rounded-xl border border-slate-600/50 bg-slate-900/60 px-2.5 py-1.5 text-xs font-black text-slate-400">
        NULL
      </span>
    </div>
  );
}

// ─── operation badge colours ──────────────────────────────────────────────────
const OP_BADGE = {
  "Insert Head":   "border-emerald-500/50 bg-emerald-900/30 text-emerald-300",
  "Insert Tail":   "border-cyan-500/50 bg-cyan-900/30 text-cyan-300",
  "Insert At":     "border-blue-500/50 bg-blue-900/30 text-blue-300",
  "Traverse":      "border-orange-500/50 bg-orange-900/30 text-orange-300",
  "Search":        "border-violet-500/50 bg-violet-900/30 text-violet-300",
  "Delete Head":   "border-red-500/50 bg-red-900/30 text-red-300",
  "Delete Tail":   "border-rose-500/50 bg-rose-900/30 text-rose-300",
  "Delete Value":  "border-pink-500/50 bg-pink-900/30 text-pink-300",
};

// ─── main component ───────────────────────────────────────────────────────────
export default function LinkedListVisualization({ step, algorithm }) {
  const values    = step.array ?? [];
  const { markers = {} } = step;
  const slug      = algorithm?.slug ?? "";
  const isDoubly  = slug === "doubly-linked-list";
  const isCircular= slug === "circular-linked-list";
  const op        = markers.operation ?? step.status ?? "Ready";
  const opBadge   = OP_BADGE[op] ?? "border-slate-600/50 bg-slate-800/50 text-slate-300";

  const listTitle = isDoubly ? "Doubly" : isCircular ? "Circular" : "Singly";

  return (
    <section className="neo-panel p-5">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="muted-label">Linked List Visualization</p>
          <h2 className="mt-1 text-2xl font-black">{listTitle} Linked List</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.span
              key={op}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2 }}
              className={`rounded-full border px-3 py-1 text-xs font-black ${opBadge}`}
            >
              {op}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.span
              key={step.status}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="rounded-full bg-slate-200 px-3 py-1 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {step.status}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Canvas */}
      <div className="neo-inset min-h-56 overflow-x-auto p-6">
        {values.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-slate-300 bg-slate-200 px-3 py-1.5 text-xs font-black text-slate-900">HEAD</span>
              <span className="text-xl font-black text-slate-500">→</span>
              <span className="rounded-xl border border-slate-600/50 bg-slate-900/60 px-3 py-1.5 text-xs font-black text-slate-400">NULL</span>
            </div>
            <p className="text-sm font-semibold text-slate-500">Empty list — waiting for first operation</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Node chain */}
            <div className="flex flex-wrap items-center gap-1">
              <AnimatePresence>
                {values.map((value, index) => {
                  const isHead     = index === 0;
                  const isTail     = index === values.length - 1;
                  const arrowHighlight = markers.highlightArrowFrom === index;
                  return (
                    <div key={`wrapper-${index}-${value}`} className="flex items-center">
                      <NodeBox
                        value={value}
                        index={index}
                        isDoubly={isDoubly}
                        isHead={isHead}
                        isTail={isTail}
                        step={step}
                      />
                      {/* Arrow or NULL */}
                      {!isTail ? (
                        <Arrow highlighted={arrowHighlight} isDoubly={isDoubly} />
                      ) : isCircular ? (
                        /* Circular back arrow */
                        <div className="mb-8 flex items-center gap-1.5 text-violet-400">
                          <span className="text-xl font-black">→</span>
                          <span className="rounded-xl border border-slate-300 bg-slate-200 px-2 py-1 text-[10px] font-black text-slate-900">
                            → HEAD
                          </span>
                        </div>
                      ) : (
                        <NullTerminal />
                      )}
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Circular loop indicator */}
            {isCircular && values.length > 1 && (
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                <span className="text-xs font-black text-violet-400">
                  ↩ Circular link: {values[values.length - 1]} → {values[0]} (HEAD)
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-bold">
        <span className="text-slate-400">● Default</span>
        <span className="text-orange-400">● Traversal pointer</span>
        <span className="text-emerald-400">● New node / Found</span>
        <span className="text-red-400">● Being deleted</span>
        <span className="text-slate-900 dark:text-slate-400">HEAD</span>
        {(isDoubly || isCircular) && <span className="text-slate-900 dark:text-slate-400">TAIL</span>}
        <span className="text-blue-400">→ next pointer</span>
        {isDoubly && <span className="text-cyan-400">← prev pointer</span>}
        {isCircular && <span className="text-violet-400">→ HEAD (circular)</span>}
      </div>
    </section>
  );
}
