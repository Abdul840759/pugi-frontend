import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Zap } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const DEMO_USERS = [
  { label: 'Learner', email: 'learner@pugi.com', password: 'password123' },
  { label: 'Tutor',   email: 'tutor@pugi.com',   password: 'password123' },
  { label: 'Admin',   email: 'admin@pugi.com',    password: 'password123' },
];

const ROLE_PATH: Record<string, string> = {
  learner: '/learner/dashboard',
  tutor:   '/tutor/dashboard',
  admin:   '/admin/dashboard',
};

export function LoginPage() {
  const { login } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: React.FormEvent, overrideEmail?: string, overridePassword?: string) => {
    e?.preventDefault();
    setError('');
    const finalEmail = overrideEmail ?? email;
    const finalPassword = overridePassword ?? password;

    if (!finalEmail || !finalPassword) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    try {
      await login(finalEmail, finalPassword);
      showToast('Welcome back!', 'success');
      // login() updates context user synchronously via setUser before resolving,
      // but to be 100% safe we read directly from the just-returned promise chain
      const path = ROLE_PATH[JSON.parse(localStorage.getItem('pugi_user') || '{}').role] || '/learner/dashboard';
      navigate(path, { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    handleLogin(undefined, demoEmail, demoPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Zap className="text-blue-500" size={32} />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">PUGI</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              disabled={loading}
            />
            <Input
              label="Password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              disabled={loading}
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-center text-gray-400 mb-3">Quick demo access</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.label}
                  onClick={() => handleDemo(u.email, u.password)}
                  disabled={loading}
                  className="text-xs py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-600
                             text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20
                             hover:border-blue-300 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline font-medium">
                Sign up
              </Link>
            </p>
            <p>
              <Link to="/forgot-password" className="text-blue-500 hover:underline font-medium">
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
