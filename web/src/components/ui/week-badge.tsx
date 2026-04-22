import { Badge } from "./badge";
import type { Locale } from "@/lib/constants";
import { WEEKS } from "@/lib/constants";

export function WeekBadge({ week, locale }: { week: number; locale: Locale }) {
  const weekData = WEEKS[week - 1];
  const variant = `week-${week}` as "week-1" | "week-2" | "week-3" | "week-4";
  return <Badge variant={variant}>W{week}: {weekData.title[locale]}</Badge>;
}
