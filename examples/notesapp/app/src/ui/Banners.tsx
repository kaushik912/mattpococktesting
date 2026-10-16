import type { ImportSummary } from "../core";

export function ReminderBanner({ onExport }: { onExport: () => void }) {
  return (
    <div role="status" aria-label="Export reminder" className="banner">
      It has been a while since your last export. Back up your notes.{" "}
      <button className="btn" onClick={onExport}>
        Export now
      </button>
    </div>
  );
}

export function ImportStatus({ summary, error }: { summary: ImportSummary | null; error: string | null }) {
  return (
    <div role="status" aria-label="Import summary" className="import-status" data-error={!!error}>
      {summary && `Imported: ${summary.added} added, ${summary.updated} updated, ${summary.skipped} skipped`}
      {error}
    </div>
  );
}
