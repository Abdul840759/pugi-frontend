import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { APP_NAME } from '@/utils/constants';

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
  accentColor?: string;
}

export function Sidebar({ items, isOpen, onClose, accentColor = 'bg-primary-600' }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-[280px] sm:w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:h-screen lg:sticky lg:top-0 lg:self-stretch',
          'dark:border-slate-700 dark:bg-slate-900',
          'lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white', accentColor)}>
              P
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">{APP_NAME}</span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
