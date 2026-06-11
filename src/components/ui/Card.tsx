import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, className, hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
        'dark:border-slate-700 dark:bg-slate-800/50',
        hover && 'transition-shadow hover:shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-white', className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-sm text-slate-500 dark:text-slate-400', className)}>{children}</p>;
}
