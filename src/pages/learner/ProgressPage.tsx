import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { SkillTree } from '@/components/SkillTree';
import { Loader } from '@/components/ui/Loader';
import { progressService } from '@/services/progressService';
import type { ProgressData } from '@/types';

export function LearnerProgressPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService.getLearnerProgress().then(setProgress).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;
  if (!progress) return null;

  const xpChart = progress.weeklyProgress.map((d) => ({ name: d.day, value: d.xp }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your Progress</h1>
        <p className="text-slate-500">Track your learning journey and skill development</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Flame, label: 'Current Streak', value: `${progress.currentStreak} days`, color: 'text-orange-500' },
          { icon: Trophy, label: 'Total XP', value: progress.totalXp.toLocaleString(), color: 'text-amber-500' },
          { icon: Target, label: 'Longest Streak', value: `${progress.longestStreak} days`, color: 'text-green-500' },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="flex items-center gap-4">
              <stat.icon className={`h-10 w-10 ${stat.color}`} />
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Weekly XP Earned</CardTitle></CardHeader>
          <LineChart data={xpChart} color="#8b5cf6" />
        </Card>
        <Card>
          <CardHeader><CardTitle>Completion by Category</CardTitle></CardHeader>
          <PieChart data={progress.completionByCategory} />
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Skill Tree</CardTitle></CardHeader>
        <SkillTree skills={progress.skillTree} />
      </Card>

      <Card>
        <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {progress.badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-xl border p-4 text-center ${badge.earnedAt ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20' : 'border-slate-200 opacity-40 grayscale dark:border-slate-700'}`}
            >
              <span className="text-3xl">{badge.icon}</span>
              <p className="mt-2 text-sm font-medium">{badge.name}</p>
              {badge.earnedAt && <p className="text-xs text-slate-500">{badge.earnedAt}</p>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
