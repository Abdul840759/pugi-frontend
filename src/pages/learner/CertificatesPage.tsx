import { useEffect, useState } from 'react';
import { Award, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { certificateService } from '@/services/certificateService';
import { Loader } from '@/components/ui/Loader';
import { useToast } from '@/hooks/useToast';

interface Certificate {
  _id: string;
  courseTitle: string;
  instructorName: string;
  studentName: string;
  verificationCode: string;
  issuedAt: string;
}

export function CertificatesPage() {
  const { showToast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await certificateService.getMyCertificates();
        setCertificates(data);
      } catch {
        showToast('Failed to load certificates', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCopyCode = async (cert: Certificate) => {
    await navigator.clipboard.writeText(cert.verificationCode);
    setCopiedId(cert._id);
    showToast('Verification code copied!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = async (cert: Certificate) => {
    setDownloadingId(cert._id);
    try {
      const url = certificateService.getDownloadUrl(cert._id);
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `pugi-certificate-${cert.verificationCode}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
      showToast('Certificate downloaded!', 'success');
    } catch {
      showToast('Failed to download certificate', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Certificates you've earned by completing courses
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
          <Award className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            No certificates yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Complete a course to earn your first certificate.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex-shrink-0">
                  <Award className="text-blue-500" size={28} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2">
                    {cert.courseTitle}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Instructor: {cert.instructorName || 'PUGI'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Issued{' '}
                    {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Verification Code</p>
                  <p className="text-sm font-mono font-medium text-gray-700 dark:text-gray-200 tracking-widest truncate">
                    {cert.verificationCode}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyCode(cert)}
                  className="flex-shrink-0 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 transition-colors"
                  title="Copy code"
                >
                  {copiedId === cert._id ? (
                    <Check size={15} className="text-green-500" />
                  ) : (
                    <Copy size={15} />
                  )}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(cert)}
                  disabled={downloadingId === cert._id}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <Download size={15} />
                  {downloadingId === cert._id ? 'Downloading...' : 'Download PDF'}
                </button>
                <a
                  href={`/verify/${cert.verificationCode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                  title="View public certificate"
                >
                  <ExternalLink size={15} />
                  Verify
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
