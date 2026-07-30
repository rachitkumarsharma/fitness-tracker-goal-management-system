const sizeStyles = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function Spinner({ size = "md", className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeStyles[size]}
          border-3 border-slate-200 dark:border-slate-700 border-t-emerald-600
          rounded-full animate-spin
        `.replace(/\s+/g, " ")}
      />
    </div>
  );
}

export function Loading({ message = "Loading...", className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <Spinner size="lg" className="mb-4" />
      <p className="text-slate-500 dark:text-slate-400 font-medium">
        {message}
      </p>
    </div>
  );
}
