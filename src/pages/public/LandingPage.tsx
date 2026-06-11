import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Brain, Trophy, Users, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const features = [
  { icon: BookOpen, title: 'Expert-Led Courses', description: 'Learn from industry professionals with structured, hands-on curricula.' },
  { icon: Brain, title: 'AI Learning Assistant', description: 'Get personalized help and recommendations powered by AI.' },
  { icon: Trophy, title: 'Gamified Progress', description: 'Earn XP, badges, and maintain streaks as you learn.' },
  { icon: Users, title: 'Community Learning', description: 'Connect with peers, tutors, and study groups.' },
  { icon: Zap, title: 'Live Classes', description: 'Attend real-time sessions with expert tutors.' },
  { icon: Star, title: 'Skill Tracking', description: 'Visualize your growth with skill trees and analytics.' },
];

const stats = [
  { value: '15K+', label: 'Active Learners' },
  { value: '1.2K+', label: 'Courses' },
  { value: '340+', label: 'Expert Tutors' },
  { value: '98%', label: 'Satisfaction Rate' },
];

export function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-900 dark:to-primary-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              The Future of Tech Education
            </span>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              Learn Tech Skills with{' '}
              <span className="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
                PUGI
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              A modern learning platform with AI-powered assistance, gamified progress tracking,
              and expert-led courses. Start your journey today.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  Start Learning Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Everything you need to succeed</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Powerful features designed for modern learners</p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-primary-600 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to level up your skills?</h2>
          <p className="mt-4 text-primary-100">Join thousands of learners already on PUGI</p>
          <Link to="/register" className="mt-8 inline-block">
            <Button size="lg" variant="secondary">Create Free Account</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
