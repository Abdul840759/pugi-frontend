import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { storage } from '@/utils/storage';
import { Loader } from '@/components/ui/Loader';

const ROLE_PATH: Record<string, string> = {
  learner: '/learner/dashboard',
  tutor: '/tutor/dashboard',
  admin: '/admin/dashboard',
};

export function GoogleSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuthContext();

  useEffect(() => {
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const role = params.get('role') || 'learner';
    const user = {
      id: params.get('userId') || '',
      name: params.get('name') || '',
      email: params.get('email') || '',
      role: role as any,
      avatar: params.get('avatar') || undefined,
    };

    if (!accessToken || !refreshToken) {
      navigate('/login?error=google_failed');
      return;
    }

    storage.setAccessToken(accessToken);
    storage.setRefreshToken(refreshToken);
    storage.setUser(user);
    updateUser(user);

    const adminRedirect = sessionStorage.getItem('pugi_post_login_redirect');
    if (adminRedirect) {
      sessionStorage.removeItem('pugi_post_login_redirect');
      navigate(adminRedirect, { replace: true });
      return;
    }

    // Redirect to onboarding if learner hasn't completed it
    if (role === 'learner' && params.get('onboardingComplete') !== 'true') {
      navigate('/onboarding', { replace: true });
    } else {
      navigate(ROLE_PATH[role] || '/learner/dashboard', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader />
        <p className="mt-4 text-gray-500">Signing you in with Google...</p>
      </div>
    </div>
  );
}
