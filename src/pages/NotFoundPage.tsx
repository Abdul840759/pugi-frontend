import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <p className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Page not found</p>
      <p className="mt-2 text-slate-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="mt-8">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
