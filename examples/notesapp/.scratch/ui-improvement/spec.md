Status: ready-for-agent

# Notes app UI refresh (Variant A, calm minimal)

Sources: `decisions.md` (grilling, Q1–Q13 + prototype verdict), prototype primary source on branch `prototype/ui-variants` (Variant A). Domain terms per `GLOSSARY.md`; no glossary or ADR changes.

## Problem Statement

The Notes app works, but it looks unfinished: the UI is browser-default, with 30 lines of layout CSS and no colours, type, spacing or theme. The Note list shows only Titles, so I can't scan it. On a phone the flow is clumsy: a "Tags menu" button, with Import, Export and status text crowding the list. Autosave gives no feedback, and the empty state is a bare sentence.

## Solution

A calm, minimal visual refresh built mobile-first, scaling up to desktop. On desktop: three columns (Tags rail | Note list | editor) with Tags always visible. On a phone: one pane at a time, with a menu button opening the Tags. Each Note row shows its Title, a one-line preview, a relative date and its Tag chips. Search and "New note" sit together above the list. Import, Export, Trash and Install live in the Tags rail footer. The editor is roomy, shows "Saving…/Saved", and has an icon Delete. Dark mode follows the system. Behaviour of Notes, Tags, search, Trash and Export bundles is unchanged.

## User Stories

1. As a user, I want a calm, consistent visual style (type, spacing, colour), so that the app feels finished and pleasant to use daily.
2. As a user, I want the app to follow my system light/dark setting, so that it is comfortable at night without a toggle.
3. As a desktop user, I want Tags, the Note list and the editor visible together, so that I can browse and edit without switching views.
4. As a phone user, I want one pane at a time, so that each screen is readable at 375px.
5. As a phone user, I want a clear menu button that opens the Tags, so that I can filter without hunting.
6. As a phone user, I want selecting a Tag to close the Tags menu and show the filtered list, so that I see the result at once.
7. As a user, I want each Note row to show its Title, so that I recognise a Note.
8. As a user, I want each Note row to show a one-line preview of its body, so that I can tell similar Titles apart.
9. As a user, I want each Note row to show a relative date ("12m ago", "2h ago", "3d ago"), so that I can judge how recent it is.
10. As a user, I want each Note row to show its Tag chips, so that I see what a Note is about without opening it.
11. As a user, I want a Note with no body to show a quiet placeholder in the preview, so that the row does not look broken.
12. As a user, I want an empty Note still shown as "Untitled", so that the list is never blank.
13. As a user, I want the selected Note highlighted in the list, so that I know what the editor shows.
14. As a user, I want the Tag preview not to include the `#tag` words twice, so that the row stays compact.
15. As a user, I want long Titles and previews truncated on one line, so that rows stay a consistent height.
16. As a user, I want the search box and the "New note" button together above the list, so that finding and capturing are one glance apart.
17. As a user, I want typing `#tag` in search to keep working, so that my existing habit still works.
18. As a user, I want the sidebar Tag filter and search to keep composing, so that I can narrow results both ways.
19. As a user, I want "All notes" and each Tag to show a count and a clear selected state, so that I know which filter is on.
20. As a user, I want Trash, Export, Import and Install app together in the Tags rail footer, so that rarely used actions do not crowd the list.
21. As a phone user, I want those footer actions reachable from the Tags menu, so that they remain available on a small screen.
22. As a user, I want the Trash count shown on its button, so that I know whether anything is waiting there.
23. As a user, I want Trash to look consistent with the rest of the app, with restore and empty-trash confirmation unchanged in behaviour, so that nothing destructive surprises me.
24. As a user, I want the Export reminder to remain a clearly visible banner at the top, so that I do not forget to back up.
25. As a user, I want the Import summary and error message styled and announced, so that I understand what happened.
26. As a user, I want the "Install app" button to appear only when the browser says the app is installable, and to sit in the footer, so that it is available but not intrusive.
27. As a user, I want a roomy, readable editor, so that long writing feels comfortable.
28. As a user, I want a "Saving…" then "Saved" indicator while I type, so that I trust autosave.
29. As a user, I want Delete to be an icon button, with the accessible name "Delete", so that the editor header stays quiet but screen readers still announce it.
30. As a user, I want an empty state ("Select a note or create a new one") with a "New note" button, so that I know what to do next.
31. As a phone user, I want a "Back to notes" control in the editor, so that I can return to the list and have my text saved first.
32. As a user, I want creating a new Note to focus the editor, so that I can type immediately.
33. As a keyboard user, I want visible focus rings on every interactive element, so that I can see where I am.
34. _(Dropped by owner: AA contrast measurement.)_
35. As a phone user, I want touch targets at least 44px tall, so that I do not mis-tap.
36. As a user who prefers reduced motion, I want transitions suppressed, so that the app does not animate against my setting.
37. As a screen-reader user, I want every control to keep its role and accessible name (Tags nav, Notes list, search box, Note text), so that the app stays usable.
38. As a user with 10,000 Notes, I want the list to stay fast, so that the visual refresh costs nothing in speed.
39. As a user, I want all existing behaviour (create, autosave, tags, search, Trash, Export, Import, reminder, PWA install, offline) unchanged, so that nothing I rely on breaks.

## Implementation Decisions

- **Scope is presentation only.** The `core` module and its public interface are unchanged. `NoteView` already supplies Title, Tags, text and `updatedAt`; the preview and relative date are derived at render time.
- **Styling:** plain CSS with custom properties (colour, spacing, radius, type tokens). No Tailwind, no component library. Dark theme via `prefers-color-scheme`; no manual toggle.
- **Layout:** desktop is a three-column grid (Tags rail, Note list, editor). At the existing phone breakpoint (≤ 640px, may be nudged to match Variant A's 760px if tests are updated together) it collapses to one pane at a time; a menu button opens the Tags, replacing the current "Tags menu" button but keeping that accessible name.
- **Note row:** Title is the only content of the row's button (its accessible name stays exactly the Title). Preview (second non-blank line, with `#tag` words stripped), relative date and Tag chips render alongside, outside the button's name. Tag chips keep `data-testid="tag-chip"`. Rows stay memoised so a refresh re-renders only changed Notes; `PAGE_SIZE` paging stays.
- **Relative date format:** minutes under an hour, hours under a day, days beyond. Minimum "1m ago".
- **Footer actions:** Trash (with count), Export, Import, Install app live in the Tags rail footer. "Export" stays a button with the exact name "Export"; "Import" stays a labelled file input. Trash button keeps its "Trash (n)" name. The Export reminder stays a top banner (restyle only).
- **Install prompt:** `InstallPrompt` keeps its behaviour (renders only when installable) but renders into the footer instead of a separate root above the app, so it needs a mount point inside the footer.
- **Editor:** Delete becomes an icon button named "Delete". A save-status flag (idle / saving / saved) is driven by the existing 400ms autosave debounce and flush; it must not change when or how Notes are saved. Empty state shows copy plus a "New note" button. Creating a Note focuses the textarea.
- **Accessibility:** keep all roles, labels and the structure tests rely on; add focus-visible rings, ≥ 44px touch targets on phone, and `prefers-reduced-motion` handling.
- **Code organisation:** the 343-line single-file UI component may be split into small presentational components (Tags rail, Note list and row, editor) and a stylesheet organised by token + component. The split is allowed because accessible names and roles are the contract, not the DOM shape.
- **Prototype carry-over:** Variant A on `prototype/ui-variants` is the visual reference (column widths 200 / 320 / flexible, pill search, "+ New" button, serif editor). It is stub-driven and untested, so it is a reference to rewrite, not to copy-promote. The `?variant` hook, switcher and stub store are not part of this work.

## Testing Decisions

- **One seam: the Playwright end-to-end suite**, the existing top seam, driving the app through roles and accessible names. UI behaviour is the thing being changed, so it is tested where the user sees it. No new seams; no unit tests of internal helpers or CSS.
- **Good test:** asserts what a user sees or can do (text visible, control reachable, state announced), by role and accessible name; never class names or DOM structure.
- **Existing suites must stay green unchanged** (smoke, trash, export, import, pwa, responsive, scale). Where a layout change alters how a control is reached on a phone (e.g. Export now behind the Tags menu), update the test's navigation steps, not its assertions, and say so in the PR.
- **New e2e coverage** (extend existing specs where possible):
  - Note row shows Title, preview, relative date and Tag chips; row button name is exactly the Title (use Playwright clock control for the date).
  - "Saving…" appears while typing then "Saved" after the debounce.
  - Empty state shows the "New note" button, and it creates a Note and focuses the editor.
  - Phone: Tags menu opens, selecting a Tag closes it and shows the filtered list; footer actions (Trash, Export, Import) are reachable from the menu.
  - Desktop: Tags rail, list and editor are visible together.
  - Dark scheme (emulated) renders without losing visible controls.
- **Performance guard:** the 10k-Note scale test and `perf:core` must not regress; the memoised row and paging stay.
- **Prior art:** `responsive.spec.ts` (viewport-based pane tests), `trash.spec.ts` and `export.spec.ts` (role-based flows), `scale.spec.ts`.

## Out of Scope

- Markdown or rich text; sorting; pinning; multi-select; drag and drop; settings screens.
- A manual dark-mode toggle.
- Any change to `core`, storage, search ranking, Tag rules, Export bundle format or PWA caching.
- Tailwind or any UI dependency.
- Screenshot / visual-regression tests and Lighthouse score thresholds.
- Variants B and C (kept only on the prototype branch). Ideas parked from them: capture-on-Enter from search (C), search and "+" in the bottom thumb zone (B).

## Further Notes

- Success is judged by the user's eye on desktop and phone, plus green unit and e2e tests.
- The prototype code is currently uncommitted in the working tree; capture it on `prototype/ui-variants` and remove it from `main` before or while implementing, so the real implementation starts clean.
- Keep UI wording to GLOSSARY terms (Note, Title, Tag, Trash, Export bundle).
