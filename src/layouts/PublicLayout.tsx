import { Outlet, Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { APP_NAME, ROLE_DASHBOARD_PATH } from '@/utils/constants';

export function PublicLayout() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isOnboarding = location.pathname === '/onboarding';

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-sm font-bold text-white">
              P
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{APP_NAME}</span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link to="/about" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block dark:text-slate-400 dark:hover:text-white">
              About
            </Link>
            <button onClick={toggleTheme} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {isAuthenticated && user && !isOnboarding ? (
              <Link to={ROLE_DASHBOARD_PATH[user.role]}>
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="text-xs sm:text-sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
