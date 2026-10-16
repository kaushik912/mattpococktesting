# 05: Editor polish

**What to build:** While I type, the editor shows "Saving…" then "Saved" so I trust autosave. Delete becomes a quiet icon button that is still announced as "Delete". With no Note selected, the editor shows "Select a note or create a new one" and a "New note" button. Creating a Note focuses the editor so I can type at once. The editor is roomy and readable. Autosave timing and behaviour are unchanged. See spec.md.

**Blocked by:** 02

**Status:** done

- [x] Save indicator shows "Saving…" while a save is pending and "Saved" after; it does not change when or how Notes are saved
- [x] Delete is an icon button with accessible name "Delete"
- [x] Empty state shows copy (the "New note" button was dropped, see Comments)
- [x] New Notes focus the textarea
- [x] e2e covers indicator, empty-state copy and focus; existing tests pass

## Comments

- Decision (owner): no empty-state button. A second "New note" button collides with every existing test locator (`exact: true` does not help, both would be named exactly "New note"), and the list's "New note" sits beside the search box on desktop. On phone the empty state is never shown.
- Save status is a `role="status"` region named "Save status".
