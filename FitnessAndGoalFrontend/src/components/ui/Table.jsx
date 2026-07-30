import { cn } from "./utils";

const Table = ({ children, className, ...props }) => {
  return (
    <table
      className={cn(
        "w-full text-sm text-left text-gray-500 dark:text-gray-400",
        className,
      )}
      {...props}
    >
      {children}
    </table>
  );
};

const TableHead = ({ children, className, ...props }) => {
  return (
    <thead
      className={cn("bg-gray-50 dark:bg-slate-700/50", className)}
      {...props}
    >
      {children}
    </thead>
  );
};

const TableBody = ({ children, className, ...props }) => {
  return (
    <tbody
      className={cn(
        "divide-y divide-gray-200 dark:divide-slate-700",
        className,
      )}
      {...props}
    >
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className, ...props }) => {
  return (
    <tr
      className={cn(
        "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700/30",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

const TableHeader = ({ children, className, ...props }) => {
  return (
    <th
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
};

const TableCell = ({ children, className, ...props }) => {
  return (
    <td className={cn("px-6 py-4 whitespace-nowrap", className)} {...props}>
      {children}
    </td>
  );
};

export { Table, TableHead, TableBody, TableRow, TableHeader, TableCell };
