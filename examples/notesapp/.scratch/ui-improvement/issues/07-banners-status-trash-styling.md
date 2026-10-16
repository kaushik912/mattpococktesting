# 07: Banners, status and Trash view styling

**What to build:** The Export reminder banner, the Import summary and error message, and the Trash view (list, Restore, Empty Trash confirmation) are styled consistently with the new look. The reminder stays a clearly visible top banner. Import messages stay announced as status. Behaviour is unchanged. See spec.md.

**Blocked by:** 04

**Status:** done

- [x] Export reminder is a visible top banner with its "Export now" button; behaviour unchanged
- [x] Import summary and error render styled and keep their status role and accessible name
- [x] Trash view, Restore buttons and the empty-Trash confirmation dialog are styled; flow unchanged
- [x] Both light and dark themes look correct for these elements
- [x] Existing trash, export and import tests pass

## Comments

- No e2e triggers the Export reminder banner (it needs a stale export date), so it is styled but not exercised by tests.
- Light and dark appearance verified by the owner in a browser.
