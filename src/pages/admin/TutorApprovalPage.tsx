import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { useToast } from '@/hooks/useToast';
import { userService } from '@/services/userService';
import type { User } from '@/types';

export function TutorApprovalPage() {
  const [tutors, setTutors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    userService.getPendingTutors().then(setTutors).finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    await userService.approveTutor(id);
    setTutors(tutors.filter((t) => t.id !== id));
    addToast({ title: 'Tutor approved', type: 'success' });
  };

  const handleReject = async (id: string) => {
    await userService.rejectTutor(id);
    setTutors(tutors.filter((t) => t.id !== id));
    addToast({ title: 'Tutor rejected', type: 'warning' });
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tutor Approval</h1>
        <p className="text-slate-500">Review and approve tutor applications</p>
      </div>

      {tutors.length === 0 ? (
        <Card className="py-12 text-center text-slate-500">No pending tutor applications</Card>
      ) : (
        <div className="space-y-4">
          {tutors.map((tutor) => (
            <Card key={tutor.id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <img src={tutor.avatar} alt="" className="h-14 w-14 rounded-full" />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">{tutor.name}</h3>
                <p className="text-sm text-slate-500">{tutor.email}</p>
                <p className="mt-1 text-xs text-slate-400">Applied: {tutor.createdAt}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleApprove(tutor.id)}>
                  <Check className="h-4 w-4" /> Approve
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleReject(tutor.id)}>
                  <X className="h-4 w-4" /> Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
