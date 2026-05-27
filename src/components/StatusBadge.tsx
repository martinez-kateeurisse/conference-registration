export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  let cls = "badge badge-pending";
  if (s.includes("approv") || s === "active" || s === "issued") cls = "badge badge-approved";
  if (s.includes("reject") || s === "expired") cls = "badge badge-rejected";
  return <span className={cls}>{status.replace(/_/g, " ")}</span>;
}
