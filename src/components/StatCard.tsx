import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, change, icon: Icon, iconColor, trend }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card hover>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            {change && (
              <p
                className={cn(
                  'mt-1 text-xs font-medium',
                  trend === 'up' && 'text-green-600',
                  trend === 'down' && 'text-red-600',
                  trend === 'neutral' && 'text-slate-500',
                )}
              >
                {change}
              </p>
            )}
          </div>
          <div className={cn('rounded-lg p-2.5', iconColor ?? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30')}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
