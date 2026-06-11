import { useState } from 'react';
import { Menu, Bell, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useNavigate } from 'react-router-dom';
interface TopbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function Topbar({ onMenuClick, title }: TopbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h1>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <h3 className="mb-3 text-sm font-semibold">Notifications</h3>
              <div className="space-y-2">
                <div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-700/50">
                  <p className="font-medium">New Course Available</p>
                  <p className="text-xs text-slate-500">Advanced GraphQL is now live</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-700/50">
                  <p className="font-medium">Quiz Reminder</p>
                  <p className="text-xs text-slate-500">Complete Module 1 Quiz by Friday</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <img
              src={user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              alt={user?.name}
              className="h-8 w-8 rounded-full bg-slate-200"
            />
            <span className="hidden text-sm font-medium text-slate-700 md:block dark:text-slate-300">
              {user?.name}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-[min(12rem,calc(100vw-2rem))] rounded-xl border border-slate-200 bg-white py-1 shadow-lg sm:w-48 dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-200 px-4 py-2 dark:border-slate-700">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                <span className="mt-1 inline-block rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium capitalize text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
