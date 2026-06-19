import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Zap } from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ResetPasswordPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) setEmail(emailFromUrl);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !token || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({ email, token, newPassword });
      addToast({ title: 'Password reset successfully. Please log in.', type: 'success' });
      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Zap className="text-blue-500" size={32} />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">PUGI</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Reset your password</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="text-sm text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg mb-4">
            Check your email for the reset token and enter it below.
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              label="Reset token"
              type="text"
              placeholder="Paste token from email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              leftIcon={<ShieldCheck size={16} />}
              disabled={loading}
            />
            <Input
              label="New password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              disabled={loading}
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              disabled={loading}
            />
            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
