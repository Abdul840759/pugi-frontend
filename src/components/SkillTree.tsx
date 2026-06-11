import { motion } from 'framer-motion';
import { Lock, Star } from 'lucide-react';
import type { SkillNode } from '@/types';
import { cn } from '@/utils/cn';

interface SkillTreeProps {
  skills: SkillNode[];
}

export function SkillTree({ skills }: SkillTreeProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            'relative rounded-xl border p-4 text-center transition-all',
            skill.unlocked
              ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
              : 'border-slate-200 bg-slate-50 opacity-60 dark:border-slate-700 dark:bg-slate-800/50',
          )}
        >
          <div className="mb-2 flex justify-center">
            {skill.unlocked ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">
                <Star className="h-5 w-5" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-600">
                <Lock className="h-4 w-4 text-slate-500" />
              </div>
            )}
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{skill.name}</h4>
          <div className="mt-2 flex justify-center gap-0.5">
            {Array.from({ length: skill.maxLevel }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 w-3 rounded-full',
                  i < skill.level ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-600',
                )}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Level {skill.level}/{skill.maxLevel}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
