import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

export function AdminSettingsPage() {
  const { addToast } = useToast();

  const handleSave = () => {
    addToast({ title: 'Settings saved', message: 'System settings updated', type: 'success' });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
        <p className="text-slate-500">Configure platform-wide settings</p>
      </div>

      <Card>
        <CardHeader><CardTitle>General</CardTitle></CardHeader>
        <div className="space-y-4">
          <Input id="platform" label="Platform Name" defaultValue="PUGI" />
          <Input id="support" label="Support Email" defaultValue="support@pugi.com" />
          <Input id="maxCourses" label="Max Courses per Tutor" type="number" defaultValue="10" />
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Security</CardTitle></CardHeader>
        <div className="space-y-3">
          {['Require email verification', 'Enable two-factor authentication', 'Auto-approve tutor applications'].map((item) => (
            <label key={item} className="flex items-center justify-between">
              <span className="text-sm">{item}</span>
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary-600" />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>AI Features</CardTitle></CardHeader>
        <div className="space-y-3">
          {['Enable AI learning assistant', 'Auto-generate quiz questions', 'Personalized course recommendations'].map((item) => (
            <label key={item} className="flex items-center justify-between">
              <span className="text-sm">{item}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-primary-600" />
            </label>
          ))}
        </div>
      </Card>

      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
