import type { NoteView } from "../core";

export function TrashView({
  trashed,
  confirmingEmpty,
  onAskEmpty,
  onCancelEmpty,
  onEmpty,
  onRestore,
}: {
  trashed: NoteView[];
  confirmingEmpty: boolean;
  onAskEmpty: () => void;
  onCancelEmpty: () => void;
  onEmpty: () => void;
  onRestore: (id: string) => void;
}) {
  return (
    <section aria-label="Trash" className="trash">
      <h2>Trash</h2>
      {trashed.length > 0 &&
        (confirmingEmpty ? (
          <div role="alertdialog" aria-label="Confirm empty Trash" className="confirm">
            Permanently delete {trashed.length} trashed note(s)? This cannot be undone.{" "}
            <button className="btn btn--danger" onClick={onEmpty}>
              Confirm empty Trash
            </button>{" "}
            <button className="btn" onClick={onCancelEmpty}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="btn" onClick={onAskEmpty}>
            Empty Trash
          </button>
        ))}
      <ul aria-label="Trashed notes" className="trash__list">
        {trashed.map((note) => (
          <li key={note.id}>
            <span className="trash__title">{note.title}</span>{" "}
            <button className="btn" aria-label={`Restore ${note.title}`} onClick={() => onRestore(note.id)}>
              Restore
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
