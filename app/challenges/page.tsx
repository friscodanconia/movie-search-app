'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useJournalStore } from '@/lib/store/useJournalStore';
import { Trophy, Target, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';

const TYPE_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  director: { bg: 'from-purple-500 to-indigo-600', text: 'text-purple-300', icon: '🎬' },
  decade: { bg: 'from-blue-500 to-cyan-600', text: 'text-blue-300', icon: '📅' },
  genre: { bg: 'from-pink-500 to-rose-600', text: 'text-pink-300', icon: '🎭' },
  collection: { bg: 'from-amber-500 to-orange-600', text: 'text-amber-300', icon: '📽️' },
  milestone: { bg: 'from-green-500 to-emerald-600', text: 'text-green-300', icon: '🏆' },
};

export default function ChallengesPage() {
  const challenges = useJournalStore((state) => state.challenges);
  const entries = useJournalStore((state) => state.entries);

  const completedCount = challenges.filter((c) => c.completed).length;
  const inProgressCount = challenges.filter((c) => c.progress > 0 && !c.completed).length;

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-[#fbbf24]" />
            <h1 className="text-5xl md:text-6xl font-display font-bold gradient-text">
              Cinema Challenges
            </h1>
          </div>
          <p className="text-xl text-cinema-text-dim font-mono mb-8">
            Level up your film knowledge with curated challenges
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="glass rounded-xl px-6 py-3">
              <div className="text-3xl font-bold text-[#10b981]">{completedCount}</div>
              <div className="text-sm text-cinema-text-dim">Completed</div>
            </div>
            <div className="glass rounded-xl px-6 py-3">
              <div className="text-3xl font-bold text-[#3b82f6]">{inProgressCount}</div>
              <div className="text-sm text-cinema-text-dim">In Progress</div>
            </div>
            <div className="glass rounded-xl px-6 py-3">
              <div className="text-3xl font-bold text-cinema-text-dim">
                {challenges.length - completedCount}
              </div>
              <div className="text-sm text-cinema-text-dim">Remaining</div>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-2xl p-12 text-center mb-8"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-display font-bold mb-4">Start Your Journey</h2>
            <p className="text-cinema-text-dim mb-6">
              Begin logging movies in your journal to track challenge progress automatically!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 neon-glow-purple font-bold"
            >
              Explore Movies
            </Link>
          </motion.div>
        )}

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge, index) => {
            const progressPercentage = (challenge.progress / challenge.total) * 100;
            const typeStyle = TYPE_COLORS[challenge.type] || TYPE_COLORS.collection;

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-strong rounded-2xl p-6 card-3d hover:scale-[1.02] transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`text-4xl bg-gradient-to-br ${typeStyle.bg} w-14 h-14 rounded-xl flex items-center justify-center`}>
                      {typeStyle.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold mb-1">{challenge.title}</h3>
                      <p className={`text-xs uppercase font-mono ${typeStyle.text}`}>
                        {challenge.type}
                      </p>
                    </div>
                  </div>

                  {challenge.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.3 }}
                    >
                      <CheckCircle className="w-8 h-8 text-[#10b981]" />
                    </motion.div>
                  )}

                  {challenge.progress === 0 && !challenge.completed && (
                    <Lock className="w-6 h-6 text-cinema-text-dim" />
                  )}
                </div>

                {/* Description */}
                <p className="text-cinema-text-dim mb-4">{challenge.description}</p>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono">
                      {challenge.progress} / {challenge.total}
                    </span>
                    <span className="font-bold">{progressPercentage.toFixed(0)}%</span>
                  </div>

                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${typeStyle.bg} rounded-full ${
                        challenge.completed ? 'animate-breathe' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Badge */}
                {challenge.completed && challenge.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <div className="flex items-center gap-2 text-[#fbbf24]">
                      <Trophy className="w-5 h-5" />
                      <span className="font-bold">Badge Unlocked: {challenge.badge}</span>
                    </div>
                  </motion.div>
                )}

                {/* CTA */}
                {!challenge.completed && challenge.progress > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-cinema-text-dim text-sm">
                      <Target className="w-4 h-4" />
                      <span>
                        {challenge.total - challenge.progress} more to complete!
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Achievement Showcase */}
        {completedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 glass-strong rounded-2xl p-8 text-center"
          >
            <Trophy className="w-16 h-16 text-[#fbbf24] mx-auto mb-4 animate-float" />
            <h2 className="text-3xl font-display font-bold mb-2">
              {completedCount === 1 ? '1 Challenge Completed!' : `${completedCount} Challenges Completed!`}
            </h2>
            <p className="text-cinema-text-dim">
              You're building an impressive cinematic foundation. Keep watching! 🎬
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
