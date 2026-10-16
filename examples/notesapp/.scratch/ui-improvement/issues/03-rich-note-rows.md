# 03: Rich Note rows

**What to build:** Each Note in the list shows its Title, a one-line preview of the body, a relative date ("12m ago", "2h ago", "3d ago") and its Tag chips, so the list can be scanned. The selected Note is highlighted and long text truncates to one line. The row button's accessible name stays exactly the Title. A Note with no body shows a quiet placeholder preview; an empty Note still shows "Untitled". See spec.md.

**Blocked by:** 02

**Status:** done

- [x] Row shows Title, preview (second non-blank line, `#tag` words stripped), relative date, Tag chips
- [x] Row button accessible name is exactly the Title (existing selectors still match)
- [x] `data-testid="tag-chip"` preserved; rows remain memoised; paging unchanged
- [x] Relative date: minutes under an hour, hours under a day, days beyond, minimum "1m ago"
- [x] e2e covers row content using controlled clock; empty body placeholder and "Untitled" covered
- [x] 10k-Note scale test does not regress

## Comments

- Existing assertions of the form `listitem toHaveText(["Standup #work#work"])` (smoke.spec.ts, responsive.spec.ts) were changed to `toContainText(["Standup #work"])`. Unavoidable: a row's text now also holds preview and date. This is an assertion edit, not only navigation; call out in the PR.
- Rows are memoised, so relative dates refresh on reload/Note change, not by clock tick.
- Placeholder text is "No additional text".
- Scale e2e passed; reload-to-list ~2.1s vs ~1.9s baseline (noise-level, one run each).
