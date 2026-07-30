import { ReactNode } from "react";

const variantStyles = {
  default: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
  success:
    "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800",
  warning:
    "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 ring-1 ring-amber-200 dark:ring-amber-800",
  danger:
    "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-800",
  info: "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 ring-1 ring-sky-200 dark:ring-sky-800",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}) {
  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.replace(/\s+/g, " ")}
    >
      {children}
    </span>
  );
}
