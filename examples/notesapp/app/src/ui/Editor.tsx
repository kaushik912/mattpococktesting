import { useEffect, useRef } from "react";

export type SaveStatus = "idle" | "saving" | "saved";

export function Editor({
  hasNote,
  draft,
  saveStatus,
  focusSignal,
  onEdit,
  onBack,
  onDelete,
}: {
  hasNote: boolean;
  draft: string;
  saveStatus: SaveStatus;
  /** Changes whenever the textarea should grab focus (a new Note was created). */
  focusSignal: number;
  onEdit: (text: string) => void;
  onBack: () => void;
  onDelete: () => void;
}) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const focused = useRef(0);
  useEffect(() => {
    // Focus once per new Note; selecting an existing Note must not pop the keyboard.
    if (focusSignal > focused.current && textarea.current) {
      focused.current = focusSignal;
      textarea.current.focus();
    }
  }, [focusSignal, hasNote]);

  if (!hasNote) {
    return (
      <section className="editor editor--empty">
        <p>Select a note or create a new one.</p>
      </section>
    );
  }
  return (
    <section className="editor">
      <div className="editor__bar">
        <button className="btn narrow-only" onClick={onBack}>
          Back to notes
        </button>
        <span role="status" aria-label="Save status" className="editor__status">
          {saveStatus === "saving" && "Saving…"}
          {saveStatus === "saved" && "Saved"}
        </span>
        <button className="btn btn--icon" onClick={onDelete} aria-label="Delete" title="Delete">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path
              d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <textarea
        ref={textarea}
        aria-label="Note text"
        value={draft}
        onChange={(e) => onEdit(e.target.value)}
      />
    </section>
  );
}
