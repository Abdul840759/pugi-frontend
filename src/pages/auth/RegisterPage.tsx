import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ROLE_DASHBOARD_PATH } from '@/utils/constants';
import { cn } from '@/utils/cn';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'learner' | 'tutor'>('learner');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await register({ name, email, password, role });
      addToast({ title: 'Account created!', message: 'Welcome to PUGI', type: 'success' });
      navigate(ROLE_DASHBOARD_PATH[user.role]);
    } catch (err) {
      addToast({ title: 'Registration failed', message: err instanceof Error ? err.message : 'Please try again', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create your account</h1>
          <p className="mt-2 text-slate-500">Start your learning journey with PUGI</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="name" label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input id="email" label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input id="password" label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {(['learner', 'tutor'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      'rounded-lg border-2 px-4 py-3 text-sm font-medium capitalize transition-colors',
                      role === r
                        ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400',
                    )}
                  >
                    {r === 'learner' ? 'Learn' : 'Teach'}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
