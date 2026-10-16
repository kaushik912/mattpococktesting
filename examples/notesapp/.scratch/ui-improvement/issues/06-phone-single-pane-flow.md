# 06: Phone single-pane flow

**What to build:** On a phone, one pane shows at a time. A menu button (still named "Tags menu") opens the Tags with the footer actions (Trash, Export, Import, Install). Selecting a Tag closes the menu and shows the filtered list. "Back to notes" saves the draft first and returns to the list. Touch targets are at least 44px. See spec.md.

**Blocked by:** 04, 05

**Status:** done

- [x] At phone width, list, editor and Tags menu show one pane at a time
- [x] "Tags menu" opens Tags and footer actions; Export/Import/Trash reachable from it
- [x] Selecting a Tag or Trash closes the menu and shows the result
- [x] "Back to notes" flushes the draft before returning
- [x] Interactive controls are at least 44px tall at phone width
- [x] Responsive e2e extended and passing (breakpoint may move 640 to 760px only if tests are updated together)

## Comments

- 44px is asserted for New note, Tags menu, Back to notes, Delete, All notes, Export and the search box (new tests in `e2e/ui.spec.ts`). Tag buttons, Trash, Import label and Restore/Empty Trash rely on the same `--target` token but are not individually asserted.
- Breakpoint is now 760px; existing responsive tests (375/1280 viewports) unchanged.
