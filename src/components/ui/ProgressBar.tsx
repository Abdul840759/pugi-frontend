import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  color = 'bg-primary-600',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          {label && <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>}
          {showValue && <span className="text-slate-500">{percentage}%</span>}
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
