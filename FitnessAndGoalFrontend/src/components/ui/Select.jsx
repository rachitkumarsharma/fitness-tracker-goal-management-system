import { forwardRef, SelectHTMLAttributes } from "react";

export const Select = forwardRef(
  ({ label, error, options, placeholder, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl border-2
            bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-0
            cursor-pointer
            ${
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20"
            }
            disabled:bg-slate-50 dark:disabled:bg-slate-800/50 disabled:cursor-not-allowed disabled:text-slate-500 dark:disabled:text-slate-400
            ${className}
          `.replace(/\s+/g, " ")}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-rose-600 font-medium">{error}</p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
