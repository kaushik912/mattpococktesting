/** "12m ago", "2h ago", "3d ago": minutes under an hour, hours under a day, days beyond. Minimum "1m ago". */
export function relativeDate(updatedAt: number, now: number = Date.now()): string {
  const minutes = Math.max(1, Math.floor((now - updatedAt) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** Second non-blank line of the text with `#tag` words stripped; "" when there is none. */
export function preview(text: string): string {
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  return (lines[1] ?? "")
    .replace(/(?<=^|\s)#[a-z][a-z0-9-]*/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}
