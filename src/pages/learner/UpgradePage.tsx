import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, CheckCircle2, Clock, XCircle, Sparkles, UploadCloud, Loader2, ArrowLeft } from 'lucide-react';
import { paymentService } from '@/services/paymentService';
import type { BankDetails, PaymentRequestRecord } from '@/services/paymentService';
import { useToast } from '@/hooks/useToast';

export function UpgradePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [bank, setBank] = useState<BankDetails | null>(null);
  const [requests, setRequests] = useState<PaymentRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [reference, setReference] = useState('');

  useEffect(() => {
    Promise.all([paymentService.getBankDetails(), paymentService.myRequests()])
      .then(([bankData, requestsData]) => {
        setBank(bankData);
        setRequests(requestsData);
      })
      .catch(() => showToast('Failed to load payment info', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const pendingRequest = requests.find(r => r.status === 'pending');
  const latestRequest = requests[0];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied`, 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Receipt image must be under 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!receiptPreview) {
      showToast('Please upload your payment receipt first', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const result = await paymentService.submitRequest({
        receiptUrl: receiptPreview,
        reference: reference || undefined,
        amount: bank?.amount,
      });
      setRequests([result, ...requests]);
      setReceiptPreview(null);
      setReference('');
      showToast('Payment request submitted! We will review it shortly.', 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to submit request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles size={16} /> Upgrade to PUGI Pro
        </p>
        <p className="mt-2 text-2xl font-bold">
          ₦{bank?.amount.toLocaleString()} <span className="text-sm font-normal text-blue-50">/ month</span>
        </p>
        <ul className="mt-3 space-y-1 text-sm text-blue-50">
          <li>• Unlimited course enrollments, any skill level</li>
          <li>• Certificates &amp; learning roadmaps</li>
          <li>• Downloadable resources + priority support</li>
        </ul>
      </div>

      {pendingRequest ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-4 flex items-start gap-3">
          <Clock className="text-amber-500 mt-0.5" size={20} />
          <div>
            <p className="font-medium text-amber-700 dark:text-amber-300 text-sm">Request pending review</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              We are reviewing your payment receipt. This usually takes a few hours. You will be upgraded automatically once approved.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Payment Instructions</h2>

            {bank?.note && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
                {bank.note}
              </div>
            )}

            <div className="space-y-2">
              {[
                { label: 'Account Name', value: bank?.accountName },
                { label: 'Bank Name', value: bank?.bankName },
                { label: 'Account Number', value: bank?.accountNumber },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-900/40 px-3 py-2.5">
                  <div>
                    <p className="text-xs text-slate-400">{row.label}</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{row.value}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(row.value || '', row.label)}
                    className="text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    <Copy size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Upload Payment Receipt</h2>

            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 p-6 cursor-pointer hover:border-blue-400 transition-colors">
              {receiptPreview ? (
                <img src={receiptPreview} alt="Receipt preview" className="max-h-48 rounded-lg object-contain" />
              ) : (
                <>
                  <UploadCloud className="text-slate-400" size={28} />
                  <span className="text-sm text-slate-500">Click to upload receipt screenshot</span>
                  <span className="text-xs text-slate-400">PNG or JPG, max 5MB</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>

            <input
              type="text"
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder="Transaction reference (optional)"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={handleSubmit}
              disabled={submitting || !receiptPreview}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              {submitting ? 'Submitting...' : 'Submit Payment Request'}
            </button>
          </div>
        </>
      )}

      {latestRequest && latestRequest.status !== 'pending' && (
        <div className={`rounded-xl border p-4 flex items-start gap-3 ${
          latestRequest.status === 'approved'
            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
            : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
        }`}>
          {latestRequest.status === 'approved' ? (
            <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
          ) : (
            <XCircle className="text-red-500 mt-0.5" size={20} />
          )}
          <div>
            <p className={`font-medium text-sm ${latestRequest.status === 'approved' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
              {latestRequest.status === 'approved' ? 'Last request approved' : 'Last request rejected'}
            </p>
            {latestRequest.rejectionReason && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{latestRequest.rejectionReason}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
