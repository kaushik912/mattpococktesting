import type { TagCount } from "../core";
import { InstallPrompt } from "../pwa/InstallPrompt";

export function TagsRail({
  tags,
  activeTag,
  trashCount,
  showTrash,
  ready,
  onFilter,
  onToggleTrash,
  onExport,
  onImport,
}: {
  tags: TagCount[];
  activeTag: string | null;
  trashCount: number;
  showTrash: boolean;
  ready: boolean;
  onFilter: (tag: string | null) => void;
  onToggleTrash: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}) {
  return (
    <nav aria-label="Tags" className="tags">
      <ul>
        <li>
          <button className="tag-btn" onClick={() => onFilter(null)} aria-pressed={activeTag === null}>
            All notes
          </button>
        </li>
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <button className="tag-btn" onClick={() => onFilter(tag)} aria-pressed={activeTag === tag}>
              #{tag} ({count})
            </button>
          </li>
        ))}
      </ul>
      <div className="tags__footer">
        <button className="tag-btn" onClick={onToggleTrash} aria-pressed={showTrash}>
          Trash ({trashCount})
        </button>
        <button className="tag-btn" onClick={onExport} disabled={!ready}>
          Export
        </button>
        <label className="tag-btn file-btn">
          Import
          <input
            type="file"
            accept=".zip,application/zip"
            disabled={!ready}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) onImport(file);
            }}
          />
        </label>
        <InstallPrompt />
      </div>
    </nav>
  );
}
