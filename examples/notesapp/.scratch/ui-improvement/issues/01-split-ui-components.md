# 01: Split UI into components (no visual change)

**What to build:** The single-file UI is split into small presentational components (Tags rail, Note list and row, editor, Trash view, banners) so later tickets touch small files. From the user's perspective nothing changes: same looks, same behaviour, same accessible names and roles. Memoised rows, paging and autosave/flush behaviour are preserved. See spec.md (Implementation Decisions: Code organisation).

**Blocked by:** None (can start immediately)

**Status:** done

- [x] UI is split into components; state and behaviour logic keep working identically
- [x] All roles, accessible names and `data-testid="tag-chip"` unchanged
- [x] Row memoisation and `PAGE_SIZE` paging preserved
- [ ] Typecheck, unit tests and the full Playwright suite pass with no test edits
- [x] Prototype code (`?variant` hook, switcher, stub store) is not part of this change

## Comments

- Implemented together with 02–07 in one pass (single commit), not as separate 01-only step, so "no visual change" was not checked in isolation.
- Suites pass, but with test edits (see 03 comments), so the unchecked box is not met as written.
