import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Zap } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

type Step = 'register' | 'verify';

export function RegisterPage() {
  const { register, verifyEmail } = useAuthContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep]         = useState<Step>('register');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [role, setRole]         = useState<'learner' | 'tutor'>('learner');
  const [otp, setOtp]           = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const ROLE_PATH: Record<string, string> = {
    learner: '/learner/dashboard',
    tutor:   '/tutor/dashboard',
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirm) {
      setError('All fields are required');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, role);
      showToast('Verification code sent to your email!', 'success');
      setStep('verify');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(email, otp);
      showToast('Email verified! Welcome to PUGI', 'success');
      const stored = localStorage.getItem('pugi_user');
      const user   = stored ? JSON.parse(stored) : null;
      navigate(user ? ROLE_PATH[user.role] ?? '/learner/dashboard' : '/learner/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Zap className="text-blue-500" size={32} />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">PUGI</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {step === 'register' ? 'Create your account' : 'Verify your email'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">

          {/* STEP 1 — Register */}
          {step === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User size={16} />}
                disabled={loading}
              />
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                disabled={loading}
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                leftIcon={<Lock size={16} />}
                disabled={loading}
              />

              {/* Role toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  I want to join as
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['learner', 'tutor'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-colors capitalize
                        ${role === r
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-300'
                        }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )}

          {/* STEP 2 — OTP Verify */}
          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-2">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  We sent a 6-digit code to your email.
                  Enter it below to verify your account.
                </p>
                <p className="text-xs text-blue-500 mt-1">{email}</p>
              </div>

              <Input
                label="6-Digit OTP"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={loading}
              />

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>

              <button
                type="button"
                onClick={() => { setStep('register'); setError(''); setOtp(''); }}
                className="w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ← Back to registration
              </button>
            </form>
          )}


          {/* Google OAuth */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-400">or continue with</span>
              </div>
            </div>
            
              <a
            
                href={`${import.meta.env.VITE_API_URL ?? "http://localhost:3001/api"}/auth/google`}
              className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Continue with Google</span>
            </a>
          </div>
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
