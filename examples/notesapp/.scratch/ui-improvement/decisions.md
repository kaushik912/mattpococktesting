# UI improvement — decisions

Source: `/grill-with-docs` session, 2026-10-16. Update as rounds settle.

## Facts found (code)
- UI is nearly unstyled: `app.css` = 30 lines, layout + one 640px breakpoint only. No colors/fonts/spacing/theme.
- Three panes: Tags nav, list (New note, search, Export, Import, status, Notes), editor. Phone = one pane at a time (`data-pane`, `data-tags-open`).
- Playwright e2e (`app/e2e/*.spec.ts`) selects by role + accessible name: "New note", "Note text", list "Notes", nav "Tags", "Tags menu", "Back to notes", "Delete" (exact), "Export" (exact), label "Import", region "Trash", "Empty Trash", "Confirm empty Trash", "Restore <title>", status "Import summary", note row button named by exact title, `data-testid="tag-chip"`, `getByRole("listitem")`.
  - Consequence: a Note row's button accessible name must remain exactly its Title. Preview/date must live outside the button name (or aria-hidden).
- `NoteView` has `title`, `tags`, `text`, `updatedAt` → preview and date need no core change.
- `InstallPrompt.tsx` renders a bare "Install app" button when installable.

## Settled (Round 1, user accepted recommended defaults)
| # | Decision |
|---|----------|
| Q1 | Pain: looks unfinished; clumsy mobile flow; hard-to-scan list |
| Q2 | Both devices equal; design mobile-first, scale up |
| Q3 | Visual direction undecided → show variants via `/prototype` |
| Q4 | Dark mode follows system (`prefers-color-scheme`), no toggle |
| Q5 | Plain CSS + custom properties; no Tailwind / component lib |
| Q6 | Markup may change (e.g. split App.tsx); accessible names, roles, test ids stay stable; e2e must pass |
| Q7 | Out of scope: rich text/markdown, sorting, pinning, multi-select, settings. Allowed: preview snippet / date in list rows (UI-only) |

## Settled (Round 2, user accepted recommended defaults)
| # | Decision |
|---|----------|
| Q8 | Row = Title button (accessible name stays exactly the Title) + one-line preview (2nd line of text) + relative date (`updatedAt`) + Tag chips (`data-testid="tag-chip"` kept). Preview/date outside the button name. |
| Q9 | Import, Export, Trash move to a footer area of the Tags nav/drawer. Verified: Export/Import e2e run at default desktop viewport (nav visible); phone test only covers panes + Tags drawer. Keep "Export" (exact) button and "Import" label. |
| Q10 | Export reminder stays a top banner (restyle only, no behavior change). "Install app" button goes in nav footer. |
| Q11 | Editor: "Saving…/Saved" indicator (state flag around autosave), icon Delete keeping accessible name "Delete", empty state with "New note" CTA. No word-count/Tag footer. |
| Q12 | A11y: keep roles/labels; add visible focus rings, 44px touch targets, `prefers-reduced-motion`. Dropped at implement time (owner): AA contrast measurement and the axe scan; ticket 08 removed. |
| Q13 | Done = your visual judgement on desktop + phone, all unit + e2e green, perf guard not regressed (`PAGE_SIZE` 200, memoised `NoteRow` stay). No screenshot tests, no Lighthouse threshold. |

## Glossary / ADR
- No new domain terms (presentation only) → `GLOSSARY.md` unchanged. "Saved indicator" etc. are UI, not domain.
- No ADR: easily reversible, not surprising.

## Prototype verdict (2026-10-16)
- Q3 resolved: **Variant A, calm minimal**. Desktop = three columns (Tags rail 200px | list 320px | editor), Tags always visible. Phone (<760px) = one pane at a time, ☰ opens Tags.
- A's details to carry: nav footer holds Trash/Export/Import/Install; list row = Title + preview + relative date + Tag chips; pill search + "+ New"; serif editor with Saving…/Saved + icon Delete; empty state with New note CTA; CSS variables + `prefers-color-scheme` dark; focus rings; 44px targets on phone.
- B and C dropped (kept only as primary source on the prototype branch).
- Prototype source: `app/src/prototype/` (to be moved to branch `prototype/ui-variants`; not for main). See `prototype/README.md`.
- Note: prototype code is under prototype constraints (no tests, stub data). Rewrite properly when folding in; do not copy-promote.

## Next
`/to-spec` → `/to-tickets` → `/implement`.
