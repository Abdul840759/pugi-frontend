import { cn } from '@/utils/cn';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullScreen?: boolean;
}

const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

export function Loader({ size = 'md', className, fullScreen }: LoaderProps) {
  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-primary-200 border-t-primary-600',
        sizes[size],
        className,
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
