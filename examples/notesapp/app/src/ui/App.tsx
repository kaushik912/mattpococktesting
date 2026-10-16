import { useCallback, useEffect, useRef, useState } from "react";
import "./app.css";
import { openNotes, type ImportSummary, type Notes, type NoteView, type TagCount } from "../core";
import { ImportStatus, ReminderBanner } from "./Banners";
import { Editor, type SaveStatus } from "./Editor";
import { NoteList } from "./NoteList";
import { TagsRail } from "./TagsRail";
import { TrashView } from "./TrashView";

const AUTOSAVE_DELAY_MS = 400;
/** Rows rendered at a time: keeps the DOM small at 10k Notes. Search or a Tag narrows further. */
const PAGE_SIZE = 200;

export function App() {
  const [notes, setNotes] = useState<Notes | null>(null);
  const [list, setList] = useState<NoteView[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [focusSignal, setFocusSignal] = useState(0);
  const pending = useRef<{ id: string; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const [tags, setTags] = useState<TagCount[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [reminderDue, setReminderDue] = useState(false);
  const [shown, setShown] = useState(PAGE_SIZE);
  const [query, setQuery] = useState("");
  const queryRef = useRef("");
  const [showTrash, setShowTrash] = useState(false);
  const [trashed, setTrashed] = useState<NoteView[]>([]);
  const [confirmingEmpty, setConfirmingEmpty] = useState(false);
  // Narrow screens only (CSS ignores these on wide): which pane is showing.
  const [pane, setPane] = useState<"list" | "editor">("list");
  const [tagsOpen, setTagsOpen] = useState(false);

  const refreshList = useCallback(async (store: Notes, tag: string | null) => {
    const q = queryRef.current.trim();
    // The sidebar Tag narrows search results too: both filters compose.
    if (q) {
      const hits = await store.search(q);
      setList(tag ? hits.filter((note) => note.tags.includes(tag)) : hits);
    } else setList(tag ? await store.notesByTag(tag) : await store.list());
  }, []);

  const refresh = useCallback(
    async (store: Notes, tag: string | null) => {
      const all = await store.listTags();
      setTags(all);
      // A Tag with no remaining Notes is gone: drop the filter with it.
      const live = tag && all.some((t) => t.tag === tag) ? tag : null;
      if (live !== tag) setActiveTag(live);
      setTrashed(await store.listTrash());
      setReminderDue(await store.exportReminderDue());
      await refreshList(store, live);
    },
    [refreshList],
  );

  useEffect(() => {
    openNotes().then(async (opened) => {
      setNotes(opened);
      await refresh(opened, null);
    });
  }, [refresh]);

  const flush = useCallback(async () => {
    clearTimeout(timer.current);
    const job = pending.current;
    if (!job || !notes) return;
    pending.current = null;
    await notes.update(job.id, job.text);
    // A newer edit may have queued while saving: only claim "Saved" when nothing is pending.
    if (!pending.current) setSaveStatus("saved");
    await refresh(notes, activeTag);
  }, [notes, activeTag, refresh]);

  async function filterBy(tag: string | null) {
    if (!notes) return;
    await flush();
    setTagsOpen(false);
    setPane("list");
    setShowTrash(false);
    setConfirmingEmpty(false);
    setShown(PAGE_SIZE);
    setActiveTag(tag);
    await refresh(notes, tag);
  }

  async function onSearch(value: string) {
    setQuery(value);
    setShown(PAGE_SIZE);
    queryRef.current = value;
    // Typing only changes the list; Tags, Trash and the reminder are unaffected.
    if (notes) await refreshList(notes, activeTag);
  }

  // Flush unsaved edits when the tab is hidden or closed.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [flush]);

  async function newNote() {
    if (!notes) return;
    await flush();
    const created = await notes.create("");
    await refresh(notes, activeTag);
    setSelectedId(created.id);
    setDraft(created.text);
    setSaveStatus("idle");
    setFocusSignal((n) => n + 1);
    setPane("editor");
  }

  async function trashSelected() {
    if (!notes || !selectedId) return;
    await flush();
    await notes.trash(selectedId);
    setSelectedId(null);
    setDraft("");
    setSaveStatus("idle");
    setPane("list");
    await refresh(notes, activeTag);
  }

  async function restore(id: string) {
    if (!notes) return;
    await notes.restore(id);
    await refresh(notes, activeTag);
  }

  async function emptyTrash() {
    if (!notes) return;
    await notes.emptyTrash();
    setConfirmingEmpty(false);
    await refresh(notes, activeTag);
  }

  async function exportNotes() {
    if (!notes) return;
    await flush();
    const zip = await notes.exportBundle();
    const url = URL.createObjectURL(new Blob([zip as BlobPart], { type: "application/zip" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    setReminderDue(await notes.exportReminderDue());
  }

  async function importNotes(file: File) {
    if (!notes) return;
    await flush();
    setImportSummary(null);
    setImportError(null);
    try {
      setImportSummary(await notes.importBundle(new Uint8Array(await file.arrayBuffer())));
    } catch {
      setImportError("Could not read that file as an Export bundle.");
    }
    await refresh(notes, activeTag);
  }

  async function select(note: NoteView) {
    await flush();
    setSelectedId(note.id);
    setDraft(note.text);
    setSaveStatus("idle");
    setPane("editor");
  }
  // Stable identity so memoised rows are not re-rendered by every App render.
  const selectRef = useRef(select);
  selectRef.current = select;
  const onSelect = useCallback((note: NoteView) => void selectRef.current(note), []);

  function edit(text: string) {
    if (!selectedId) return;
    setDraft(text);
    setSaveStatus("saving");
    pending.current = { id: selectedId, text };
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), AUTOSAVE_DELAY_MS);
  }

  return (
    <div className="app">
      {reminderDue && <ReminderBanner onExport={() => void exportNotes()} />}
      <header className="topbar narrow-only">
        <button className="btn" aria-expanded={tagsOpen} onClick={() => setTagsOpen((v) => !v)}>
          Tags menu
        </button>
      </header>
      <main className="layout" data-pane={pane} data-tags-open={tagsOpen}>
        <TagsRail
          tags={tags}
          activeTag={activeTag}
          trashCount={trashed.length}
          showTrash={showTrash}
          ready={!!notes}
          onFilter={(tag) => void filterBy(tag)}
          onToggleTrash={() => {
            setShowTrash((v) => !v);
            setTagsOpen(false);
            setConfirmingEmpty(false);
          }}
          onExport={() => void exportNotes()}
          onImport={(file) => void importNotes(file)}
        />
        {showTrash ? (
          <TrashView
            trashed={trashed}
            confirmingEmpty={confirmingEmpty}
            onAskEmpty={() => setConfirmingEmpty(true)}
            onCancelEmpty={() => setConfirmingEmpty(false)}
            onEmpty={() => void emptyTrash()}
            onRestore={(id) => void restore(id)}
          />
        ) : (
          <>
            <section className="list">
              <div className="list__bar">
                <input
                  type="search"
                  aria-label="Search notes"
                  placeholder="Search (try #tag)"
                  value={query}
                  onChange={(e) => void onSearch(e.target.value)}
                />
                <button className="btn btn--primary" onClick={newNote} disabled={!notes}>
                  New note
                </button>
              </div>
              <ImportStatus summary={importSummary} error={importError} />
              <NoteList
                notes={list}
                shown={shown}
                selectedId={selectedId}
                onSelect={onSelect}
                onShowMore={() => setShown((n) => n + PAGE_SIZE)}
              />
            </section>
            <Editor
              hasNote={!!selectedId}
              draft={draft}
              saveStatus={saveStatus}
              focusSignal={focusSignal}
              onEdit={edit}
              onBack={() => void flush().then(() => setPane("list"))}
              onDelete={() => void trashSelected()}
            />
          </>
        )}
      </main>
    </div>
  );
}
