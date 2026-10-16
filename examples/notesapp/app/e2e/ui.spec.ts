import { expect, test } from "@playwright/test";

const T0 = new Date("2026-01-10T12:00:00Z");
const minutes = (n: number) => new Date(T0.getTime() + n * 60_000);

test.describe("Note rows", () => {
  test("show Title, preview, relative date and Tag chips; the button is named by the Title", async ({ page }) => {
    await page.clock.setFixedTime(T0);
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    await page.getByRole("textbox", { name: "Note text" }).fill("Trip plan #travel\n\n#packing pack the bag\nlast line");

    const notes = page.getByRole("list", { name: "Notes" });
    const row = notes.getByRole("listitem").first();
    await expect(notes.getByRole("button", { name: "Trip plan #travel", exact: true })).toBeVisible();
    await expect(row).toContainText("pack the bag");
    await expect(row).not.toContainText("#packing pack");
    await expect(row).toContainText("1m ago");
    await expect(row.getByTestId("tag-chip")).toHaveText(["#travel", "#packing"]);

    // Later reads: minutes, hours, days. Rows are memoised, so a reload re-reads the clock.
    for (const [offset, label] of [
      [12, "12m ago"],
      [120, "2h ago"],
      [3 * 24 * 60, "3d ago"],
    ] as const) {
      await page.clock.setFixedTime(minutes(offset));
      await page.reload();
      await expect(row).toContainText(label);
    }
  });

  test("a Note with a Title only shows a quiet placeholder; an empty Note is Untitled", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    const row = page.getByRole("list", { name: "Notes" }).getByRole("listitem").first();
    await expect(row.getByRole("button", { name: "Untitled", exact: true })).toBeVisible();
    await expect(row).toContainText("No additional text");
    await page.getByRole("textbox", { name: "Note text" }).fill("Only a title");
    await expect(row.getByRole("button", { name: "Only a title", exact: true })).toBeVisible();
    await expect(row).toContainText("No additional text");
  });

  test("the selected Note is marked", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    await page.getByRole("textbox", { name: "Note text" }).fill("Pick me");
    await expect(page.getByRole("button", { name: "Pick me", exact: true })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });
});

test.describe("editor", () => {
  test("shows Saving… while typing, then Saved", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    const status = page.getByRole("status", { name: "Save status" });
    await page.getByRole("textbox", { name: "Note text" }).fill("Draft");
    await expect(status).toHaveText("Saving…");
    await expect(status).toHaveText("Saved");
  });

  test("New note focuses the editor so typing works at once", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    await expect(page.getByRole("textbox", { name: "Note text" })).toBeFocused();
    await page.keyboard.type("Typed straight away");
    await expect(page.getByRole("textbox", { name: "Note text" })).toHaveValue("Typed straight away");
  });

  test("empty state tells you what to do; the list's New note is the one button", async ({ page }) => {
    await page.goto("./");
    await expect(page.getByText("Select a note or create a new one.")).toBeVisible();
    await expect(page.getByRole("button", { name: "New note" })).toHaveCount(1);
  });

  test("Delete is an icon button announced as Delete", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    const del = page.getByRole("button", { name: "Delete", exact: true });
    await expect(del).toBeVisible();
    await expect(del).toHaveText("");
  });
});

test.describe("desktop", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("Tags rail, Note list and editor are visible together, with footer actions in the rail", async ({
    page,
  }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    const rail = page.getByRole("navigation", { name: "Tags" });
    await expect(rail).toBeVisible();
    await expect(page.getByRole("list", { name: "Notes" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Note text" })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Search notes" })).toBeVisible();
    await expect(rail.getByRole("button", { name: /^Trash \(\d+\)$/ })).toBeVisible();
    await expect(rail.getByRole("button", { name: "Export", exact: true })).toBeVisible();
    await expect(rail.getByLabel("Import", { exact: true })).toBeAttached();
    // Import and Export no longer crowd the Note list.
    await expect(page.getByRole("button", { name: "Export", exact: true })).toHaveCount(1);
    await expect(page.getByLabel("Import", { exact: true })).toHaveCount(1);
  });
});

test.describe("dark scheme", () => {
  test.use({ colorScheme: "dark", viewport: { width: 1280, height: 800 } });

  test("renders with all controls visible", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    await page.getByRole("textbox", { name: "Note text" }).fill("Night note #late");
    await expect(page.getByRole("navigation", { name: "Tags" })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Search notes" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Delete", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Night note #late", exact: true })).toBeVisible();
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe("rgb(23, 22, 21)");
  });
});

test.describe("phone", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("Tags menu opens Tags and footer actions; picking a Tag closes it and shows the list", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    await page.getByRole("textbox", { name: "Note text" }).fill("Plan #work");
    await page.getByRole("button", { name: "Back to notes" }).click();

    const rail = page.getByRole("navigation", { name: "Tags" });
    await page.getByRole("button", { name: "Tags menu" }).click();
    await expect(rail.getByRole("button", { name: /^Trash \(\d+\)$/ })).toBeVisible();
    await expect(rail.getByRole("button", { name: "Export", exact: true })).toBeVisible();
    await expect(rail.getByLabel("Import", { exact: true })).toBeAttached();

    await rail.getByRole("button", { name: "#work (1)" }).click();
    await expect(rail).toBeHidden();
    await expect(page.getByRole("button", { name: "Plan #work", exact: true })).toBeVisible();
  });

  test("picking a Tag while editing shows the filtered list, not the editor", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    await page.getByRole("textbox", { name: "Note text" }).fill("Plan #work");
    await page.getByRole("button", { name: "Tags menu" }).click();
    await page.getByRole("navigation", { name: "Tags" }).getByRole("button", { name: "#work (1)" }).click();
    await expect(page.getByRole("textbox", { name: "Note text" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Plan #work", exact: true })).toBeVisible();
  });

  test("selecting an existing Note does not steal focus", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    await page.getByRole("textbox", { name: "Note text" }).fill("First");
    await page.getByRole("button", { name: "Back to notes" }).click();
    await page.getByRole("button", { name: "First", exact: true }).click();
    await expect(page.getByRole("textbox", { name: "Note text" })).not.toBeFocused();
  });

  test("Back to notes saves the draft first", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    await page.getByRole("textbox", { name: "Note text" }).fill("Saved on back");
    await page.getByRole("button", { name: "Back to notes" }).click();
    await expect(page.getByRole("button", { name: "Saved on back", exact: true })).toBeVisible();
  });

  test("interactive controls are at least 44px tall", async ({ page }) => {
    await page.goto("./");
    await page.getByRole("button", { name: "New note" }).click();
    await page.getByRole("textbox", { name: "Note text" }).fill("Tall enough");
    const heights = async (names: string[]) => {
      for (const name of names) {
        const box = await page.getByRole("button", { name, exact: true }).boundingBox();
        expect(box?.height, name).toBeGreaterThanOrEqual(44);
      }
    };
    await heights(["Back to notes", "Delete"]);
    await page.getByRole("button", { name: "Back to notes" }).click();
    await heights(["New note", "Tags menu"]);
    const search = await page.getByRole("searchbox", { name: "Search notes" }).boundingBox();
    expect(search?.height).toBeGreaterThanOrEqual(44);
    await page.getByRole("button", { name: "Tags menu" }).click();
    await heights(["All notes", "Export"]);
  });
});
