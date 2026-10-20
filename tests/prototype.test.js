import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

test("archived bubble prototype preserves comparison and swap counts while rewinding", () => {
  const element = () => ({
    value: "3,2,1",
    style: {},
    classList: { add() {}, remove() {}, toggle() {} },
    appendChild() {},
    setAttribute() {},
    textContent: "",
    innerHTML: "",
  });
  const elements = new Map();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, element());
      return elements.get(id);
    },
    createElement: element,
    querySelectorAll: () => [],
  };
  const html = readFileSync("inspiration/bubble_sort_simulator.html", "utf8");
  const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .join("\n");
  const context = vm.createContext({
    document,
    setInterval: () => 1,
    clearInterval() {},
  });
  vm.runInContext(script, context, { timeout: 1000 });
  vm.runInContext("while(stepIdx < steps.length - 1) stepForward();", context, {
    timeout: 1000,
  });
  for (let i = 0; i < 7; i++) {
    vm.runInContext("stepBack()", context, { timeout: 1000 });
    assert.equal(
      vm.runInContext("comparisons", context),
      vm.runInContext(
        'steps.slice(1,stepIdx+1).filter(step=>step.type==="compare").length',
        context,
      ),
    );
    assert.equal(
      vm.runInContext("swaps", context),
      vm.runInContext(
        'steps.slice(1,stepIdx+1).filter(step=>step.type==="swap").length',
        context,
      ),
    );
  }
});
