import { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center py-12 px-6 text-center
        ${className}
      `.replace(/\s+/g, " ")}
    >
      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        {icon || (
          <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
