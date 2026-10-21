export const arrayLearning = {
  "bubble-sort": {
    purpose:
      "Compare neighbors and move the largest remaining value to the end.",
    variant: "Adjacent exchanges, with early exit when a pass makes no swaps.",
    note: "The green suffix is permanently settled. Equal values keep their relative order.",
    pseudo:
      "Repeat passes over the unsettled prefix\n  Compare each neighboring pair\n  Swap if the left value is larger\n  Settle the last position\n  Stop if the pass made no swaps",
  },
  "selection-sort": {
    purpose:
      "Find the smallest remaining value, then put it in the next position.",
    variant:
      "Select a minimum from the unsorted suffix and exchange it with the destination.",
    note: "The minimum is provisional while scanning. Exchanges can change the order of equal values.",
    pseudo:
      "For each destination\n  Start with the destination as minimum\n  Scan the remaining values\n  Keep the index of a smaller value\n  Exchange the minimum with the destination",
  },
  "insertion-sort": {
    purpose: "Build an ordered prefix by inserting one held value at a time.",
    variant: "Hold a key, shift larger values right, then fill the gap.",
    note: "An ordered prefix is not yet in its final positions. Equal keys are not shifted past one another.",
    pseudo:
      "For each value after the first\n  Hold it as the key; leave a gap\n  While the left value is larger\n    Shift that value into the gap\n    Move the gap left\n  Insert the key into the gap",
  },
  "merge-sort": {
    purpose: "Merge neighboring ordered runs into progressively larger runs.",
    variant:
      "Iterative bottom-up merge sort: widths 1, 2, 4, and so on. This implementation has no recursive calls.",
    note: "Left and right buffers preserve input while values are written back. Ties take the left value first, making this variant stable.",
    pseudo:
      "Start with run width 1\nWhile width is smaller than the array\n  For each pair of neighboring runs\n    Copy both runs into buffers\n    Compare the first unread values\n    Write the smaller one to the array\n    Copy any remaining values\n  Double the run width",
  },
  "quick-sort": {
    purpose:
      "Partition values around a pivot, then work through the smaller ranges.",
    variant:
      "Lomuto partition with the last value as pivot. An explicit stack processes the right subrange before the left.",
    note: "Only a placed pivot has a guaranteed final position. Sorted input can produce highly unbalanced partitions; equal values may change relative order.",
    pseudo:
      "Put the full range on a stack\nWhile ranges remain\n  Pop a range; skip ranges of size 0 or 1\n  Choose its last value as pivot\n  Scan; move values ≤ pivot across the boundary\n  Exchange pivot into its final position\n  Push the left and right remaining ranges",
  },
  "heap-sort": {
    purpose:
      "Build a max-heap and repeatedly move its largest value to the end.",
    variant:
      "Bottom-up heap construction followed by root extraction and recursive sift-down.",
    note: "The tree and array share indexes. Extracted positions leave the active heap and become final. Heap exchanges do not preserve duplicate order.",
    pseudo:
      "Sift down each non-leaf to build a max-heap\nWhile more than one heap value remains\n  Exchange the root with the last heap value\n  Shrink the active heap\n  Sift the new root down toward its larger child",
  },
  "shell-sort": {
    purpose:
      "Insert values across shrinking gaps before a final adjacent pass.",
    variant:
      "Gapped insertion sort with integer-halving gaps, ending at gap 1.",
    note: "A gapped subsequence can be ordered while the full array is not. This gap sequence is not stable.",
    pseudo:
      "Start gap at half the array length\nWhile gap is positive\n  Hold each next key\n  Shift larger values gap positions apart\n  Insert the key into the open position\n  Halve the gap",
  },
  "counting-sort": {
    purpose: "Count each value and use cumulative counts to place the output.",
    variant:
      "Stable counting sort with prefix sums and right-to-left output placement.",
    note: "Counts become cumulative endpoints, then decrease during placement. Empty count ranges are grouped without dropping their values.",
    pseudo:
      "Count each input value\nBuild cumulative counts\nRead input from right to left\n  Write each value at count[value] − 1\n  Decrease its count\nCopy the output back to the array",
  },
  "radix-sort": {
    purpose:
      "Order values one decimal digit at a time, starting with the ones.",
    variant:
      "Base-10 least-significant-digit radix sort using stable counting passes.",
    note: "Each pass preserves the order of equal digits. A completed digit pass is only partially ordered until all required digits are processed.",
    pseudo:
      "For ones, tens, then hundreds as needed\n  Count the current digit of every value\n  Build cumulative digit counts\n  Place input into output from right to left\n  Copy output back, preserving equal-digit order",
  },
  "linear-search": {
    purpose: "Check values from left to right until the target is found.",
    variant: "Sequential equality checks on the input in its original order.",
    note: "No sorting is required. With duplicates, this implementation returns the first matching index.",
    pseudo:
      "For each index from left to right\n  Compare its value with the target\n  If equal, return this index\nIf every value was checked, report no match",
  },
  "binary-search": {
    purpose:
      "Find a target by repeatedly narrowing a sorted array to one half.",
    variant: "Inclusive low/high bounds, with midpoint rounded down.",
    note: "Input must be sorted in ascending order. Indexes refer to the displayed sorted array. With duplicates, any matching index may be returned.",
    pseudo:
      "Set low = 0 and high = last index\nWhile low ≤ high\n  mid = low + floor((high − low) / 2)\n  If array[mid] equals target, return mid\n  If array[mid] < target, set low = mid + 1\n  Otherwise set high = mid − 1\nReport no match when the interval is empty",
  },
};

export const inputPresets = {
  "Small example": [42, 18, 73, 29, 64, 11, 90, 37],
  "Already sorted": [11, 18, 29, 37, 42, 64, 73, 90],
  "Reverse order": [90, 73, 64, 42, 37, 29, 18, 11],
  "Repeated values": [42, 18, 42, 11, 18, 73, 11, 42],
};
