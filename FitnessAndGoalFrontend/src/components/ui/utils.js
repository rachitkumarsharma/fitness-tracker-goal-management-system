import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Reusable dark mode style constants
export const cardStyle =
  "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700";

export const textPrimary = "text-slate-800 dark:text-slate-100";

export const textSecondary = "text-slate-500 dark:text-slate-400";

export const textHeading = "text-slate-900 dark:text-slate-100";

export const inputStyle =
  "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder-slate-400 dark:placeholder-slate-500";

export const labelStyle = "text-slate-700 dark:text-slate-300";

export const tableHeaderStyle =
  "bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300";

export const tableBodyStyle =
  "bg-white dark:bg-slate-800 divide-slate-200 dark:divide-slate-700";

export const tableRowHover = "hover:bg-slate-50 dark:hover:bg-slate-700/30";

export const badgeVariants = {
  default: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
  success:
    "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800",
  warning:
    "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800",
  danger:
    "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-800",
  info: "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 ring-1 ring-sky-200 dark:ring-sky-800",
};
