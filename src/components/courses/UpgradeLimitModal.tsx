import { Lock, Sparkles, ArrowUpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/ui/Modal';

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

export function UpgradeLimitModal({ isOpen, onClose, reason }: UpgradeLimitModalProps) {
  const navigate = useNavigate();

  if (!reason) return null;

  const copy = REASON_COPY[reason];

  const handleUpgrade = () => {
    onClose();
    navigate('/upgrade');
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
            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-600 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Maybe later
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 py-2 text-sm font-medium text-white transition-colors"
          >
            <ArrowUpCircle size={15} />
            Upgrade to PUGI Pro
          </button>
        </div>
      </div>
    </Modal>
  );
}
