import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Zap } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const ROLE_PATH: Record<string, string> = {
  learner: '/learner/dashboard',
  tutor:   '/tutor/dashboard',
  admin:   '/admin/dashboard',
};

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
  </svg>
);

export function LoginPage() {
  const { login } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password'); return; }
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      const u = JSON.parse(localStorage.getItem('pugi_user') || '{}');
      if (u.role === 'learner' && !u.onboardingComplete) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate(ROLE_PATH[u.role] || '/learner/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const googleUrl = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'}/auth/google`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(66,133,244,0.4), 0 4px 15px rgba(66,133,244,0.2); }
          50% { box-shadow: 0 0 0 8px rgba(66,133,244,0), 0 4px 25px rgba(66,133,244,0.4); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .google-btn {
          animation: pulse-glow 2.5s ease-in-out infinite, float 3s ease-in-out infinite;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .google-btn:hover {
          animation: none;
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 30px rgba(66,133,244,0.4);
        }
        @keyframes badge-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .recommended-badge { animation: badge-bounce 2s ease-in-out infinite; }
      `}</style>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Zap className="text-blue-500" size={32} />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">PUGI</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">

          {/* Google Button — HERO */}
          <div className="mb-6">
            <div className="flex items-center justify-center mb-3">
              <span className="recommended-badge inline-flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                <span className="inline-flex items-center gap-1"><Zap className="w-3 h-3" /> Fastest way in</span>
              </span>
            </div>
            <a
              href={googleUrl}
              className="google-btn w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white dark:bg-gray-700 border-2 border-blue-400 dark:border-blue-500 text-gray-800 dark:text-white font-semibold text-base"
            >
              <GoogleIcon />
              Continue with Google
            </a>
          </div>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-400">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email" type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} leftIcon={<Mail size={16} />} disabled={loading}
            />
            <Input
              label="Password" type="password" placeholder="********" value={password}
              onChange={(e) => setPassword(e.target.value)} leftIcon={<Lock size={16} />} disabled={loading}
            />
            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline font-medium">Sign up</Link>
            </p>
            <p>
              <Link to="/forgot-password" className="text-blue-500 hover:underline font-medium">Forgot password?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
