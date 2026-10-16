# 02: Theme foundation and three-column desktop shell

**What to build:** On desktop, the app looks calm and finished: Tags rail, Note list and editor sit side by side as three styled columns, with search and "New note" together above the list. Styling uses plain CSS custom properties; light/dark follows the system setting. Every interactive element has a visible focus ring, and motion is suppressed under reduced-motion. Visual reference: Variant A on branch `prototype/ui-variants` (rewrite, don't copy). See spec.md.

**Blocked by:** 01

**Status:** done

- [x] Design tokens (colour, spacing, radius, type) defined as CSS custom properties
- [x] Dark theme applies via `prefers-color-scheme`, no manual toggle
- [x] Desktop shows Tags rail, Note list and editor together
- [x] Search box and "New note" button sit together above the list; accessible names unchanged
- [x] Focus-visible rings on all interactive elements; `prefers-reduced-motion` respected
- [x] Existing Playwright suite passes; e2e asserts the three regions are visible together at desktop width

## Comments

- Focus rings and reduced-motion are CSS-only (global `:focus-visible`, `prefers-reduced-motion` block); no e2e asserts them.
- Phone breakpoint moved 640 → 760px per decisions.md; tests use 375/1280 so unaffected.
- Not yet eyeballed in a browser by the user (success criterion in spec).
