import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { adminAuthService } from '@/services/adminAuthService';
import { storage } from '@/utils/storage';
import { Loader } from '@/components/ui/Loader';

type GateState = 'checking' | 'denied' | 'pin' | 'verifying';

export function AdminGatePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState<GateState>('checking');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    adminAuthService
      .checkEligibility()
      .then((res) => setState(res.eligible ? 'pin' : 'denied'))
      .catch(() => setState('denied'));
  }, [isLoading, isAuthenticated]);

  const handleGoogleSignIn = () => {
    sessionStorage.setItem('pugi_post_login_redirect', '/admin');
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
    window.location.href = `${apiUrl}/auth/google`;
  };

  const handleVerifyPin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!pin) return;
    setState('verifying');
    try {
      const { adminToken } = await adminAuthService.verifyPin(pin);
      storage.setAdminToken(adminToken);
      const from = (location.state as { from?: string } | null)?.from || '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Verification failed');
      setState('pin');
      setPin('');
    }
  };

  if (isLoading || (isAuthenticated && state === 'checking')) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-sm text-center">
          <ShieldCheck className="mx-auto mb-4 text-slate-500" size={40} />
          <h1 className="text-xl font-semibold text-white mb-2">Restricted Area</h1>
          <p className="text-sm text-slate-400 mb-6">Sign in to continue.</p>
          <button
            onClick={handleGoogleSignIn}
            className="w-full rounded-lg bg-white text-slate-900 py-2.5 text-sm font-medium hover:bg-slate-100 transition-colors"
          >
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  if (state === 'denied') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <ShieldAlert className="mx-auto mb-4 text-slate-500" size={40} />
          <h1 className="text-xl font-semibold text-white mb-2">Access Denied</h1>
          <p className="text-sm text-slate-400">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form onSubmit={handleVerifyPin} className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Lock className="mx-auto mb-3 text-slate-500" size={32} />
          <h1 className="text-lg font-semibold text-white">Enter Admin PIN</h1>
          <p className="text-sm text-slate-400 mt-1">Signed in as {user?.email}</p>
        </div>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          disabled={state === 'verifying'}
          className="w-full rounded-lg bg-slate-900 border border-slate-700 text-white text-center text-lg tracking-widest py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          placeholder="••••"
        />
        {error && <p className="text-sm text-red-400 text-center mb-3">{error}</p>}
        <button
          type="submit"
          disabled={state === 'verifying' || !pin}
          className="w-full rounded-lg bg-red-600 hover:bg-red-700 text-white py-2.5 text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {state === 'verifying' && <Loader2 size={15} className="animate-spin" />}
          {state === 'verifying' ? 'Verifying...' : 'Unlock'}
        </button>
      </form>
    </div>
  );
}
