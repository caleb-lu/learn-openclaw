export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getWeekColor(week: number): string {
  const colors: Record<number, string> = {
    1: "#3B82F6",
    2: "#10B981",
    3: "#8B5CF6",
    4: "#F59E0B",
  };
  return colors[week] || "#3B82F6";
}

export function getWeekBgClass(week: number): string {
  const map: Record<number, string> = {
    1: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    2: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    3: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    4: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };
  return map[week] || "";
}

export function getWeekBorderClass(week: number): string {
  const map: Record<number, string> = {
    1: "border-blue-500/30",
    2: "border-emerald-500/30",
    3: "border-purple-500/30",
    4: "border-amber-500/30",
  };
  return map[week] || "";
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}
