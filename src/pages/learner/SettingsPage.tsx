import { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/utils/cn';

export function LearnerSettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const handleSave = () => {
    addToast({ title: 'Settings saved', message: 'Your profile has been updated', type: 'success' });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500">Manage your account preferences</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
              alt=""
              className="h-16 w-16 rounded-full"
            />
            <Button variant="outline" size="sm">Change Avatar</Button>
          </div>
          <Input id="name" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
        <div className="flex gap-3">
          {(['light', 'dark'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                'flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium capitalize transition-colors',
                theme === t
                  ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20'
                  : 'border-slate-200 dark:border-slate-700',
              )}
            >
              {t} Mode
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <div className="space-y-3">
          {['Course updates', 'Quiz reminders', 'Message notifications', 'Weekly progress report'].map((item) => (
            <label key={item} className="flex items-center justify-between">
              <span className="text-sm">{item}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-primary-600" />
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
