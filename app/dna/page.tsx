'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useJournalStore } from '@/lib/store/useJournalStore';
import { Sparkles, TrendingUp, Award, Film, Calendar, Trophy } from 'lucide-react';
import Link from 'next/link';

const MOOD_COLORS: Record<string, string> = {
  euphoric: 'from-yellow-400 to-orange-500',
  melancholic: 'from-blue-400 to-blue-600',
  tense: 'from-red-400 to-red-600',
  contemplative: 'from-purple-400 to-purple-600',
  nostalgic: 'from-amber-400 to-orange-500',
  uplifting: 'from-green-400 to-emerald-500',
  dark: 'from-gray-700 to-gray-900',
  whimsical: 'from-pink-400 to-rose-500',
  intense: 'from-red-500 to-orange-600',
  peaceful: 'from-cyan-400 to-blue-500',
};

export default function CinemaDNAPage() {
  const getCinemaDNA = useJournalStore((state) => state.getCinemaDNA);
  const entries = useJournalStore((state) => state.entries);

  const dna = getCinemaDNA();

  if (entries.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-12 text-center max-w-md"
        >
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-3xl font-display font-bold gradient-text mb-4">
            Your Cinema DNA Awaits
          </h2>
          <p className="text-cinema-text-dim mb-8">
            Start logging movies in your journal to unlock your personalized cinema insights!
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 neon-glow-purple font-bold"
          >
            <Film className="w-5 h-5" />
            Explore Movies
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-[#00f5ff]" />
            <h1 className="text-5xl md:text-6xl font-display font-bold gradient-text">
              Your Cinema DNA
            </h1>
            <Sparkles className="w-8 h-8 text-[#ff00ff]" />
          </div>
          <p className="text-xl text-cinema-text-dim font-mono">
            A deep dive into your cinematic journey
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Watched */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-strong rounded-2xl p-6 card-3d"
          >
            <div className="flex items-center gap-3 mb-4">
              <Film className="w-6 h-6 text-[#a855f7]" />
              <h3 className="font-bold text-lg">Films Watched</h3>
            </div>
            <p className="text-5xl font-display font-bold gradient-text">
              {dna.totalWatched}
            </p>
          </motion.div>

          {/* Average Rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-strong rounded-2xl p-6 card-3d"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-[#fbbf24]" />
              <h3 className="font-bold text-lg">Avg Rating</h3>
            </div>
            <p className="text-5xl font-display font-bold text-[#fbbf24]">
              {dna.avgRating.toFixed(1)}
            </p>
          </motion.div>

          {/* Watch Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-strong rounded-2xl p-6 card-3d"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-[#00f5ff]" />
              <h3 className="font-bold text-lg">Current Streak</h3>
            </div>
            <p className="text-5xl font-display font-bold text-[#00f5ff]">
              {dna.currentStreak}
            </p>
            <p className="text-sm text-cinema-text-dim mt-2">films this week</p>
          </motion.div>

          {/* Rewatch Champion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-strong rounded-2xl p-6 card-3d"
          >
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-[#ec4899]" />
              <h3 className="font-bold text-lg">Rewatched</h3>
            </div>
            {dna.rewatchChampion ? (
              <>
                <p className="text-2xl font-bold mb-1 truncate">
                  {dna.rewatchChampion.title}
                </p>
                <p className="text-sm text-cinema-text-dim">
                  {dna.rewatchChampion.count} times
                </p>
              </>
            ) : (
              <p className="text-lg text-cinema-text-dim">No rewatches yet</p>
            )}
          </motion.div>
        </div>

        {/* Dominant Moods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-strong rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-[#a855f7]" />
            <h2 className="text-2xl font-display font-bold">Your Dominant Moods</h2>
          </div>

          {dna.dominantMoods.length > 0 ? (
            <div className="space-y-4">
              {dna.dominantMoods.map((moodData, index) => {
                const percentage = (moodData.count / dna.totalWatched) * 100;
                const gradient = MOOD_COLORS[moodData.mood] || 'from-purple-500 to-pink-500';

                return (
                  <motion.div
                    key={moodData.mood}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold capitalize">{moodData.mood}</span>
                      <span className="text-cinema-text-dim">
                        {moodData.count} films ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-cinema-text-dim">No mood data yet. Keep journaling!</p>
          )}
        </motion.div>

        {/* Recent Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-strong rounded-2xl p-8"
        >
          <h2 className="text-2xl font-display font-bold mb-6">Recent Journal Entries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entries.slice(0, 4).map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="glass rounded-xl p-4 hover:bg-white/10 transition-all"
              >
                <h3 className="font-bold text-lg mb-2">{entry.title}</h3>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {entry.mood.slice(0, 3).map((mood) => (
                    <span
                      key={mood}
                      className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${
                        MOOD_COLORS[mood]
                      }`}
                    >
                      {mood}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-cinema-text-dim line-clamp-2">
                  {entry.emotionalNotes}
                </p>
                {entry.rating && (
                  <div className="mt-2 text-[#fbbf24]">
                    {'⭐'.repeat(entry.rating)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
