import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { userService } from '@/services/userService';
import type { User } from '@/types';
import { cn } from '@/utils/cn';

const roleColors: Record<User['role'], string> = {
  learner: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  tutor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getAllUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">User Management</h1>
          <p className="text-sm text-slate-500 sm:text-base">View and manage platform users</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {/* Mobile & tablet card view */}
      <div className="space-y-3 md:hidden">
        {filtered.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img src={user.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900 dark:text-white">{user.name}</p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize', roleColors[user.role])}>
                {user.role}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
              <span className="text-xs text-slate-500">Joined {user.createdAt}</span>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop table view */}
      <Card className="hidden overflow-x-auto p-0 md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
              <th className="px-4 py-3 text-left font-medium text-slate-500 lg:px-6">User</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500 lg:px-6">Role</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500 lg:px-6">Joined</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500 lg:px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-4 py-4 lg:px-6">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="" className="h-8 w-8 rounded-full" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 lg:px-6">
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', roleColors[user.role])}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-500 lg:px-6">{user.createdAt}</td>
                <td className="px-4 py-4 lg:px-6">
                  <Button variant="ghost" size="sm">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
