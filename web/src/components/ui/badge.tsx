import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "week-1" | "week-2" | "week-3" | "week-4" | "outline";
  className?: string;
}) {
  const variants: Record<string, string> = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "week-1": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "week-2": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "week-3": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "week-4": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    outline: "border border-current bg-transparent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
