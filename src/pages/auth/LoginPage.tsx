import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { ROLE_DASHBOARD_PATH, DEMO_USERS } from '@/utils/constants';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login({ email, password });
      addToast({ title: 'Welcome back!', message: `Logged in as ${user.name}`, type: 'success' });
      navigate(ROLE_DASHBOARD_PATH[user.role]);
    } catch (err) {
      addToast({ title: 'Login failed', message: err instanceof Error ? err.message : 'Invalid credentials', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (role: 'learner' | 'tutor' | 'admin') => {
    const demo = DEMO_USERS.find((u) => u.role === role);
    if (demo) {
      setEmail(demo.email);
      setPassword(demo.password);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="mt-2 text-slate-500">Sign in to your PUGI account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
            <p className="mb-3 text-center text-xs text-slate-500">Demo accounts (password: password123)</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => fillDemo('learner')}>Learner</Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => fillDemo('tutor')}>Tutor</Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => fillDemo('admin')}>Admin</Button>
            </div>
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
