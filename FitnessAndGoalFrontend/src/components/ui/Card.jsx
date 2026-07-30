import { ReactNode } from 'react';

export function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60
        p-6 shadow-sm text-slate-800 dark:text-slate-100
        transition-all duration-200 ease-in-out
        ${hover ? 'hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-600 cursor-pointer' : ''}
        ${className}
      `.replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-bold text-slate-800 dark:text-slate-100 ${className}`}>{children}</h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 ${className}`}>
      {children}
    </div>
  );
}