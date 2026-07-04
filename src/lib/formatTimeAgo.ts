export function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return "Few mins ago";
  if (diffHrs < 24) return "Few hours ago";
  if (diffDays < 7) return "Few days ago";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
