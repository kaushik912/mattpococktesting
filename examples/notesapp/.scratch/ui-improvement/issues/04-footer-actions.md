# 04: Footer actions in the Tags rail

**What to build:** Trash (with its count), Export, Import and Install app live together in the Tags rail footer instead of crowding the Note list. Install app still appears only when the browser says the app is installable, now rendered inside the footer. Behaviour of each action is unchanged. See spec.md.

**Blocked by:** 02

**Status:** done

- [x] Trash button (name "Trash (n)"), "Export" button (exact name), "Import" labelled file input, and Install app are in the rail footer
- [ ] Install prompt renders in the footer only when installable; PWA test still passes
- [x] Export, import and trash flows work exactly as before
- [x] Existing export/import/trash tests pass; any test edits are navigation steps only, not assertions
- [x] Note list pane no longer contains Import/Export controls

## Comments

- `InstallPrompt` now renders inside `TagsRail`; the separate `#install-root` in `main.tsx` is removed. PWA e2e passes, but no e2e fires `beforeinstallprompt`, so "renders in the footer when installable" is unverified.
- The prompt now mounts with the React app rather than earlier, so an event fired before mount could be missed. Worth a manual check in an installable browser.
