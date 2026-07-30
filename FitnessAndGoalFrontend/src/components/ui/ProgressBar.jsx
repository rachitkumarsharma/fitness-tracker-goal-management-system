const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const colorStyles = {
  emerald: "bg-emerald-600",
  sky: "bg-sky-600",
  amber: "bg-amber-600",
  rose: "bg-rose-600",
};

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = "md",
  color = "emerald",
  className = "",
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      <div
        className={`
          w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden
          ${sizeStyles[size]}
        `.replace(/\s+/g, " ")}
      >
        <div
          className={`
            ${colorStyles[color]} rounded-full
            transition-all duration-500 ease-out
            ${sizeStyles[size]}
          `.replace(/\s+/g, " ")}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {value}
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            / {max}
          </span>
        </div>
      )}
    </div>
  );
}
