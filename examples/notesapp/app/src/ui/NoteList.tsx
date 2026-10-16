import { memo } from "react";
import type { NoteView } from "../core";
import { preview, relativeDate } from "./format";

/** Memoised so a refresh re-renders only Notes that changed, not all 10k rows. */
export const NoteRow = memo(function NoteRow({
  note,
  selected,
  onSelect,
}: {
  note: NoteView;
  selected: boolean;
  onSelect: (note: NoteView) => void;
}) {
  const snippet = preview(note.text);
  return (
    <li className="note-row" data-selected={selected}>
      {/* The button's name is exactly the Title; the rest is supporting detail. */}
      <button className="note-row__title" onClick={() => onSelect(note)} aria-current={selected}>
        {note.title}
      </button>
      <span className={snippet ? "note-row__preview" : "note-row__preview note-row__preview--empty"}>
        {snippet || "No additional text"}
      </span>
      <span className="note-row__date">{relativeDate(note.updatedAt)}</span>
      {note.tags.length > 0 && (
        <span className="note-row__tags">
          {note.tags.map((tag) => (
            <span key={tag} className="chip" data-testid="tag-chip">
              #{tag}
            </span>
          ))}
        </span>
      )}
    </li>
  );
});

export function NoteList({
  notes,
  shown,
  selectedId,
  onSelect,
  onShowMore,
}: {
  notes: NoteView[];
  shown: number;
  selectedId: string | null;
  onSelect: (note: NoteView) => void;
  onShowMore: () => void;
}) {
  return (
    <>
      <ul aria-label="Notes" className="notes">
        {notes.slice(0, shown).map((note) => (
          <NoteRow key={note.id} note={note} selected={note.id === selectedId} onSelect={onSelect} />
        ))}
      </ul>
      {notes.length > shown && (
        <button className="btn show-more" onClick={onShowMore}>
          Show more notes ({notes.length - shown} more)
        </button>
      )}
    </>
  );
}
