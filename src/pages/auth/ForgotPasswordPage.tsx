import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Zap } from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ForgotPasswordPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      addToast({ title: 'Reset token sent! Check your email.', type: 'success' });
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to send reset token');
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
          <p className="text-gray-500 dark:text-gray-400">Recover your password</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
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
            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset token'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Remembered your password?{' '}
            <Link to="/login" className="text-blue-500 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
