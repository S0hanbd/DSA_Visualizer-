import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { algorithms } from "../src/data/algorithms.js";

test("every catalog page and declared alias renders without a page exception", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const algorithm of algorithms) {
    await page.goto(`/algorithm/${algorithm.slug}`);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: algorithm.title,
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByText("This visualization could not continue"),
    ).toHaveCount(0);
  }
  for (const [alias, target] of [
    ["/stack", "/algorithm/stack-array"],
    ["/queue", "/algorithm/linear-queue"],
  ]) {
    await page.goto(alias);
    await expect(page).toHaveURL(new RegExp(`${target}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  for (const alias of [
    "/sorting",
    "/searching",
    "/linked-list",
    "/trees",
    "/graph",
    "/design",
    "/guide",
  ]) {
    await page.goto(alias);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("stack pause/cancel/finish/replay policy is atomic and keyboard step selection works", async ({
  page,
}) => {
  await page.goto("/algorithm/stack-array");
  await page.getByLabel("Value (integer 0–9999)").fill("7");
  await page.getByRole("button", { name: "Push", exact: true }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Push", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Cancel operation" }).click();
  await expect(
    page.getByText("Model size: 0/10.", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("Value (integer 0–9999)").fill("9");
  await page.getByRole("button", { name: "Push", exact: true }).click();
  await page.getByRole("button", { name: "Finish operation" }).click();
  await expect(
    page.getByText("Model size: 1/10.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset playback" }).click();
  await expect(
    page.getByRole("button", { name: "Pop", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Select execution step").focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("button", { name: "Pop", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Clear model" }).click();
  await expect(
    page.getByText("Model size: 0/10.", { exact: false }),
  ).toBeVisible();
});

test("circular queue interruption cannot discard committed data; bulk operations commit together", async ({
  page,
}) => {
  await page.goto("/algorithm/circular-queue");
  await page.getByLabel("Value (integer 0–9999)").fill("5");
  await page.getByRole("button", { name: "Enqueue", exact: true }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Dequeue", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Finish operation" }).click();
  await page.getByLabel("Bulk insert (comma or space separated)").fill("10,20");
  await page.getByRole("button", { name: "Insert all", exact: true }).click();
  await page.getByRole("button", { name: "Cancel operation" }).click();
  await expect(
    page.getByText("Model size: 1/10.", { exact: false }),
  ).toBeVisible();
});

test("graph validation, endpoint reconciliation and worker generation remain responsive", async ({
  page,
}) => {
  await page.goto("/algorithm/dijkstra");
  await page.getByRole("button", { name: "Build Graph", exact: true }).click();
  await page.getByRole("combobox").selectOption("example2");
  await page.getByRole("button", { name: "Algorithm", exact: true }).click();
  await expect(page.getByLabel("End Node", { exact: true })).toHaveValue("E");
  await page.getByRole("button", { name: /Run Dijkstra/ }).click();
  await page.goto("/algorithm/graph-coloring");
  await expect(
    page.getByText("Build a graph, choose colors, then Run search."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Algorithm", exact: true }).click();
  await page
    .getByRole("button", { name: "Run search", exact: true })
    .evaluate((button) => {
      button.click();
      queueMicrotask(() =>
        [...document.querySelectorAll("button")]
          .find((button) => button.textContent === "Cancel search")
          .click(),
      );
    });
  await expect(page.getByText(/cancelled · limit/)).toBeVisible();
});

test("integer input errors are recoverable and advanced algorithms execute", async ({
  page,
}) => {
  await page.goto("/algorithm/counting-sort");
  await page.getByLabel("Array values").fill("1.5,2.5");
  await page.getByRole("button", { name: "Set", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("integers");
  for (const slug of [
    "fractional-knapsack",
    "job-scheduling",
    "bellman-ford",
    "floyd-warshall",
    "string-matching",
    "rabin-karp",
  ]) {
    await page.goto(`/algorithm/${slug}`);
    await page
      .getByRole("button", { name: "Run simulation", exact: true })
      .click();
    await page.getByRole("button", { name: "Finish operation" }).click();
    await expect(
      page.getByText("Live model — ready for a new operation.", {
        exact: false,
      }),
    ).toBeVisible();
  }
});

test("mobile/tablet/desktop layouts, theme and accessibility smoke", async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const width of [375, 768, 1440])
    for (const slug of [
      "stack-array",
      "circular-queue",
      "queue-using-stacks",
      "avl",
      "n-queens",
      "graph-coloring",
    ]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/algorithm/${slug}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 2,
        ),
        `${slug} at ${width}px`,
      ).toBe(true);
    }
  await page.goto("/algorithm/stack-array");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("worker budgets, coordinate-only edits, obsolete runs and history windowing", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const NativeWorker = window.Worker;
    window.__workerStarts = 0;
    window.Worker = class extends NativeWorker {
      constructor(...args) {
        super(...args);
        window.__workerStarts++;
      }
    };
  });
  await page.goto("/algorithm/graph-coloring");
  await page.getByLabel("Example graph").selectOption("empty");
  for (let i = 0; i < 10; i++)
    await page.getByRole("button", { name: "Add node", exact: true }).click();
  await page.getByRole("button", { name: "Algorithm", exact: true }).click();
  await page.getByRole("button", { name: "4 Colors", exact: true }).click();
  await page.getByRole("button", { name: "Run search", exact: true }).click();
  await expect(page.getByText(/truncated · limit/)).toBeVisible();
  await page.getByLabel("Select execution step").focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("heading", { name: "Solutions Found: 200" }),
  ).toBeVisible();
  expect(
    await page
      .getByRole("group", { name: "Execution history" })
      .getByRole("button")
      .count(),
  ).toBeLessThanOrEqual(41);
  expect(await page.locator('button[aria-current="step"]').count()).toBe(1);
  const starts = await page.evaluate(() => window.__workerStarts);
  await page
    .getByRole("button", {
      name: "Node A; use arrow keys to move",
      exact: true,
    })
    .focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByText(/truncated · limit/)).toBeVisible();
  expect(await page.evaluate(() => window.__workerStarts)).toBe(starts);
  await page.goto("/algorithm/stack-array");
  await page.goto("/algorithm/graph-coloring");
  await page.getByRole("button", { name: "Algorithm", exact: true }).click();
  await expect(page.getByText(/idle · limit/)).toBeVisible();
});

test("storage denial stays recoverable, dark theme works in memory and source remains accessible", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Storage denied", "SecurityError");
      },
    }),
  );
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/algorithm/stack-array");
  await page.getByLabel("Dark theme").check();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(
    page.getByRole("heading", { name: "C++ Source Code" }),
  ).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.getByLabel("Dark theme").uncheck();
  expect(errors).toEqual([]);
});

test("tree/list/priority bulk operations, step selection and route unmounts preserve the policy", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const slug of [
    "avl",
    "doubly-linked-list",
    "priority-queue",
    "queue-using-stacks",
  ]) {
    await page.goto(`/algorithm/${slug}`);
    const isList = slug === "doubly-linked-list";
    await page
      .getByLabel(
        isList
          ? "Replace list (comma or space separated)"
          : "Bulk insert (comma or space separated)",
      )
      .fill("10,20,30");
    await page
      .getByRole("button", {
        name: isList ? "Set list" : "Insert all",
        exact: true,
      })
      .click();
    await page
      .getByRole("button", { name: "Finish operation", exact: true })
      .click();
    await page.getByRole("button", { name: "Reset playback" }).click();
    await expect(
      page.getByRole("button", { name: "Clear model", exact: true }),
    ).toBeDisabled();
    await page
      .getByRole("button", { name: "Return to live", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Clear model", exact: true }),
    ).toBeEnabled();
    if (slug === "avl") {
      await page
        .getByRole("button", { name: "Level-Order", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Finish operation", exact: true })
        .click();
      await expect(page.getByText("Traversal: 20 → 10 → 30")).toBeVisible();
    }
    if (isList) {
      await page
        .getByRole("button", { name: "Traverse backward", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Finish operation", exact: true })
        .click();
    }
    await page.getByLabel("Value (integer 0–9999)").fill("40");
    await page
      .getByRole("button", {
        name: isList ? "Insert at Head" : slug === "avl" ? "Insert" : "Enqueue",
        exact: true,
      })
      .click();
    await page.locator("header nav").getByRole("link").first().click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "SIMULATE",
    );
  }
  expect(errors).toEqual([]);
});

test("reduced-motion previews stay visible and ordinary SPA navigation never waits on an exiting operation", async ({
  page,
}) => {
  await page.goto("/");
  const bars = page.getByLabel("Bubble sort preview").locator(":scope > div");
  await expect(bars).toHaveCount(7);
  expect(
    await bars.evaluateAll((items) =>
      items.every((item) => item.getBoundingClientRect().height > 10),
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/algorithm/stack-array");
  await page.getByLabel("Value (integer 0–9999)").fill("1");
  await page.getByRole("button", { name: "Push", exact: true }).click();
  await page.locator("header nav").getByRole("link").first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "SIMULATE",
  );
});
