import { useState } from 'react';
import { Lock, Sparkles, ArrowUpCircle, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { paymentService } from '@/services/paymentService';
import { loadPaystackScript } from '@/utils/loadPaystackScript';
import { useToast } from '@/hooks/useToast';

export type UpgradeLimitReason = 'FREE_PLAN_LIMIT' | 'LEVEL_MISMATCH' | 'UPGRADE_PROMPT';

interface UpgradeLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: UpgradeLimitReason | null;
  onUpgraded?: () => void;
}

const REASON_COPY: Record<UpgradeLimitReason, { title: string; body: string }> = {
  FREE_PLAN_LIMIT: {
    title: 'Free plan limit reached',
    body: "You're already enrolled in a course on the Free plan, which allows just 1 active enrollment at a time. Upgrade to PUGI Pro for unlimited course enrollments.",
  },
  LEVEL_MISMATCH: {
    title: "This course isn't at your level",
    body: 'Free plan accounts can only enroll in courses that match their assessed skill level. Upgrade to PUGI Pro to unlock courses at every level, plus unlimited enrollments.',
  },
  UPGRADE_PROMPT: {
    title: 'Unlock PUGI Pro',
    body: 'Get unlimited course enrollments at any skill level, certificates, personalized roadmaps, downloadable resources, and priority support.',
  },
};

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? '';

export function UpgradeLimitModal({ isOpen, onClose, reason, onUpgraded }: UpgradeLimitModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!reason) return null;

  const copy = REASON_COPY[reason];

  const verifyPayment = async (reference: string) => {
    try {
      await paymentService.verify(reference);
      showToast('Welcome to PUGI Pro! 🎉', 'success');
      onUpgraded?.();
      onClose();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Could not verify payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!PAYSTACK_PUBLIC_KEY) {
      showToast('Payment is not configured yet. Please try again later.', 'error');
      return;
    }
    setLoading(true);
    try {
      const { reference, amount, email } = await paymentService.initialize();
      await loadPaystackScript();
      const handler = (window as any).PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount,
        currency: 'NGN',
        ref: reference,
        callback: (response: any) => {
          void verifyPayment(response.reference);
        },
        onClose: () => {
          setLoading(false);
        },
      });
      handler.openIframe();
    } catch (err: any) {
      setLoading(false);
      showToast(err?.response?.data?.message || 'Could not start payment', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={copy.title}>
      <div className="flex flex-col items-center text-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500">
          <Lock size={26} />
        </span>
        <p className="text-sm text-slate-600 dark:text-slate-300">{copy.body}</p>
        <div className="w-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-left text-white">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <Sparkles size={15} />
            PUGI Pro — ₦2,500/month
          </p>
          <ul className="mt-2 space-y-1 text-xs text-blue-50">
            <li>• Unlimited course enrollments, any skill level</li>
            <li>• Certificates &amp; learning roadmaps</li>
            <li>• Downloadable resources + priority support</li>
          </ul>
        </div>
        <div className="flex w-full gap-3 mt-1">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
          >
            Maybe later
          </button>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <ArrowUpCircle size={15} />}
            {loading ? 'Processing...' : 'Upgrade to PUGI Pro'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
