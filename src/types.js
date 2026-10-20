/**
 * Common timeline metadata. Payloads remain algorithm-specific and immutable.
 * @typedef {Object} TimelineStep
 * @property {string} status
 * @property {string} explanation
 * @property {string} [event] Named educational source anchor.
 * @property {Record<string, any>} [markers]
 * @property {number[]} [array] Array/list/stack payload.
 * @property {number} [front] Queue pointer.
 * @property {number} [rear] Queue pointer.
 * @property {Object|null} [tree] Immutable laid-out tree payload.
 * @property {number[]} [color] Graph coloring payload, indexed by topology node order.
 * @property {number} [solutionCount] Count into a separately retained solution store.
 * @property {string} [outcome] complete, invalid, unsatisfiable, truncated or cancelled.
 */
export {};
