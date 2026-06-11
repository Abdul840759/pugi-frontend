import { motion } from 'framer-motion';
import { Target, Heart, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const values = [
  { icon: Target, title: 'Our Mission', description: 'Democratize tech education by making high-quality learning accessible to everyone, everywhere.' },
  { icon: Heart, title: 'Our Values', description: 'We believe in inclusive learning, continuous improvement, and empowering every learner to reach their potential.' },
  { icon: Lightbulb, title: 'Our Vision', description: 'A world where anyone can acquire the tech skills they need to thrive in the digital economy.' },
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">About PUGI</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          PUGI is a next-generation learning management system built for the modern tech learner.
          We combine structured courses, AI assistance, and gamification to make learning engaging and effective.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {values.map((value, i) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <Card className="h-full text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30">
                <value.icon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{value.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{value.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">Built for Everyone</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { role: 'Learners', desc: 'Track progress, earn badges, and learn at your own pace with AI assistance.' },
            { role: 'Tutors', desc: 'Create courses, manage students, and deliver live classes with powerful analytics.' },
            { role: 'Admins', desc: 'Oversee the platform, moderate content, and ensure quality across all courses.' },
          ].map((item) => (
            <Card key={item.role}>
              <h3 className="font-semibold text-primary-600">{item.role}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
