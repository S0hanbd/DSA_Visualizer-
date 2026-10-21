import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { arrayLearning } from "../src/data/arrayLearning.js";
import { buildSimulationSteps } from "../src/logic/simulations.js";
import { algorithmMap } from "../src/data/algorithms.js";
const example = [42, 18, 73, 29, 64, 11, 90, 37];
async function seek(page, index) {
  await page.getByLabel("Select execution step").evaluate((input, index) => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set.call(input, String(index));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, index);
}

test("all eleven pages use the disclosed workspace and stay within five viewport widths", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 1366, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 768 });
    for (const slug of Object.keys(arrayLearning)) {
      await page.goto("/algorithm/" + slug);
      await expect(
        page.getByRole("region", { name: "Simulation workspace" }),
        `${slug} should render its workspace at ${width}px`,
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Show code", exact: true }),
      ).toBeVisible();
      await expect(page.getByLabel("Code panel")).toHaveCount(0);
      await expect(
        page.getByRole("group", { name: "Execution history" }),
      ).toHaveCount(0);
      await expect(page.locator(".learning-metrics > span")).toHaveCount(2);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 2,
        ),
        slug + " " + width,
      ).toBe(true);
      if (width === 1366 && ["bubble-sort", "binary-search"].includes(slug)) {
        const box = await page
          .getByRole("button", { name: "Play", exact: true })
          .boundingBox();
        expect(box.y + box.height).toBeLessThan(768);
      }
    }
  }
  expect(errors).toEqual([]);
});

test("binary search explicitly sorts applied input, preserves drafts and supports results/replay/reset", async ({
  page,
}) => {
  await page.goto("/algorithm/binary-search");
  await page.getByText("Edit input", { exact: true }).click();
  await page.getByLabel("Array values", { exact: true }).fill("42,11,42,18");
  await page.getByLabel("Search target", { exact: true }).fill("42");
  await page.getByRole("button", { name: "Apply input", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("ascending");
  await expect(page.getByLabel("Array values", { exact: true })).toHaveValue(
    "42,11,42,18",
  );
  await page.getByRole("button", { name: "Sort and apply" }).click();
  await expect(page.getByLabel("Array values", { exact: true })).toHaveValue(
    "11, 18, 42, 42",
  );
  await expect(
    page.getByRole("button", { name: "Play", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "History", exact: true }).click();
  await page.getByLabel("Select execution step").focus();
  await page.keyboard.press("End");
  await expect(page.locator(".current-explanation")).toContainText("Found");
  await expect(
    page.getByRole("button", { name: "Replay", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset playback" }).click();
  await expect(page.getByLabel("Select execution step")).toHaveValue("0");
  await page.getByLabel("Search target", { exact: true }).fill("999");
  await page.getByRole("button", { name: "Apply input", exact: true }).click();
  await page.getByLabel("Select execution step").focus();
  await page.keyboard.press("End");
  await expect(page.locator(".current-explanation")).toContainText(
    "999 is not",
  );
  await page.getByRole("button", { name: "Show code", exact: true }).click();
  await expect(page.getByLabel("Code panel")).toBeVisible();
  await expect(page.getByLabel("Code panel")).not.toContainText("@");
  await page.getByLabel("Code view").selectOption("pseudo");
  await expect(page.locator(".pseudocode")).toContainText("low");
});

test("algorithm-specific teaching lanes agree with real steps and can be rewound", async ({
  page,
}) => {
  for (const [slug, status, selector, text] of [
    ["linear-search", "Comparing", ".pointer-label", "current"],
    ["binary-search", "Checking Mid", ".pointer-label", "mid"],
    ["bubble-sort", "Pass Complete", ".state-done"],
    ["selection-sort", "New Minimum", ".pointer-label", "min"],
    ["insertion-sort", "Set Key", ".holding-lane"],
    ["merge-sort", "Placing", '[aria-label="Merge workspace"]'],
    ["quick-sort", "Base Case", ".range-context", "Base-case range"],
    ["heap-sort", "Extracted", ".heap-lane"],
    ["shell-sort", "Pick Key", ".holding-lane"],
    ["counting-sort", "Placing", '[aria-label="Count table"]'],
    ["radix-sort", "Placing", ".data-cell mark"],
  ]) {
    await page.goto("/algorithm/" + slug);
    await page.getByRole("button", { name: "History", exact: true }).click();
    const steps = buildSimulationSteps(example, algorithmMap[slug], 73);
    const index = steps.findIndex((step) => step.status === status);
    await seek(page, index);
    await expect(page.locator(".current-explanation .step-heading")).toHaveText(
      status,
    );
    const teachingState = page.locator(selector).filter({ hasText: text }).first();
    await expect(teachingState).toBeVisible();
    await page.getByRole("button", { name: "Previous step" }).click();
    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByLabel("Select execution step")).toHaveValue(
      String(index),
    );
  }
});

test("light/dark contrast, keyboard disclosure and enlarged layout remain usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  for (const slug of ["bubble-sort", "binary-search"]) {
    await page.goto("/algorithm/" + slug);
    for (const dark of [false, true]) {
      await page.getByLabel("Dark theme").setChecked(dark);
      const results = await new AxeBuilder({ page })
        .include(".array-learning")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
  }
  await page.evaluate(() => {
    document.body.style.zoom = "2";
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 2,
    ),
  ).toBe(true);
  await expect(
    page.getByRole("button", { name: "Play", exact: true }),
  ).toBeVisible();
});
