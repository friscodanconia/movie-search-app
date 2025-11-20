'use client';

import React, { useState } from 'react';
import { X, Heart, Calendar, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournalStore } from '@/lib/store/useJournalStore';
import type { MoodTag } from '@/lib/types';

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
  };
}

const MOODS: { tag: MoodTag; emoji: string; color: string; gradient: string }[] = [
  { tag: 'euphoric', emoji: '🤩', color: '#fbbf24', gradient: 'from-yellow-400 to-orange-500' },
  { tag: 'melancholic', emoji: '😢', color: '#3b82f6', gradient: 'from-blue-400 to-blue-600' },
  { tag: 'tense', emoji: '😰', color: '#ef4444', gradient: 'from-red-400 to-red-600' },
  { tag: 'contemplative', emoji: '🤔', color: '#8b5cf6', gradient: 'from-purple-400 to-purple-600' },
  { tag: 'nostalgic', emoji: '🥹', color: '#f59e0b', gradient: 'from-amber-400 to-orange-500' },
  { tag: 'uplifting', emoji: '😊', color: '#10b981', gradient: 'from-green-400 to-emerald-500' },
  { tag: 'dark', emoji: '😈', color: '#1f2937', gradient: 'from-gray-700 to-gray-900' },
  { tag: 'whimsical', emoji: '🪄', color: '#ec4899', gradient: 'from-pink-400 to-rose-500' },
  { tag: 'intense', emoji: '🔥', color: '#dc2626', gradient: 'from-red-500 to-orange-600' },
  { tag: 'peaceful', emoji: '🧘', color: '#06b6d4', gradient: 'from-cyan-400 to-blue-500' },
];

const CONTEXTS = ['Theater', 'Home', 'Flight', 'Hotel', 'Friends Place', 'Outdoor', 'Festival'];

export default function JournalEntryModal({ isOpen, onClose, movie }: JournalEntryModalProps) {
  const addEntry = useJournalStore((state) => state.addEntry);

  const [selectedMoods, setSelectedMoods] = useState<MoodTag[]>([]);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [emotionalNotes, setEmotionalNotes] = useState('');
  const [memoryAnchor, setMemoryAnchor] = useState('');
  const [context, setContext] = useState<string>('');

  const handleSubmit = () => {
    if (selectedMoods.length === 0 || !emotionalNotes.trim()) {
      return;
    }

    addEntry({
      movieId: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      mood: selectedMoods,
      rating,
      emotionalNotes,
      memoryAnchor: memoryAnchor || undefined,
      context: context || undefined,
    });

    // Reset form
    setSelectedMoods([]);
    setRating(undefined);
    setEmotionalNotes('');
    setMemoryAnchor('');
    setContext('');

    onClose();
  };

  const toggleMood = (mood: MoodTag) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const selectedGradient = selectedMoods.length > 0
    ? MOODS.find((m) => m.tag === selectedMoods[0])?.gradient || 'from-purple-500 to-pink-500'
    : 'from-purple-500 to-pink-500';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-strong rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${selectedGradient} p-6 rounded-t-2xl relative`}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <Sparkles className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-display font-bold">{movie.title}</h2>
                    <p className="text-sm opacity-90 font-mono">Cinema Journal Entry</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Mood Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#ec4899]" />
                    How did it make you feel?
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {MOODS.map((mood) => (
                      <motion.button
                        key={mood.tag}
                        onClick={() => toggleMood(mood.tag)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-xl text-center transition-all ${
                          selectedMoods.includes(mood.tag)
                            ? `bg-gradient-to-br ${mood.gradient} neon-glow-purple`
                            : 'glass hover:bg-white/10'
                        }`}
                      >
                        <div className="text-2xl mb-1">{mood.emoji}</div>
                        <div className="text-xs capitalize">{mood.tag}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        onClick={() => setRating(star)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-3xl transition-all"
                      >
                        <span
                          className={
                            rating && rating >= star
                              ? 'text-[#fbbf24] drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                              : 'text-gray-600'
                          }
                        >
                          ⭐
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Emotional Notes */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    What thoughts or feelings linger?
                  </label>
                  <textarea
                    value={emotionalNotes}
                    onChange={(e) => setEmotionalNotes(e.target.value)}
                    placeholder="The cinematography reminded me of a dream I had..."
                    className="w-full px-4 py-3 rounded-xl glass focus:ring-2 focus:ring-[#a855f7] outline-none resize-none h-32 font-sans"
                  />
                </div>

                {/* Memory Anchor */}
                <div>
                  <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#00f5ff]" />
                    Memory Anchor (optional)
                  </label>
                  <input
                    type="text"
                    value={memoryAnchor}
                    onChange={(e) => setMemoryAnchor(e.target.value)}
                    placeholder="Watched with Sarah on a rainy Sunday afternoon"
                    className="w-full px-4 py-3 rounded-xl glass focus:ring-2 focus:ring-[#a855f7] outline-none font-sans"
                  />
                </div>

                {/* Context */}
                <div>
                  <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#10b981]" />
                    Where did you watch?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CONTEXTS.map((ctx) => (
                      <button
                        key={ctx}
                        onClick={() => setContext(ctx)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          context === ctx
                            ? 'bg-[#10b981] text-white neon-glow-cyan'
                            : 'glass hover:bg-white/10'
                        }`}
                      >
                        {ctx}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  onClick={handleSubmit}
                  disabled={selectedMoods.length === 0 || !emotionalNotes.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    selectedMoods.length === 0 || !emotionalNotes.trim()
                      ? 'glass opacity-50 cursor-not-allowed'
                      : `bg-gradient-to-r ${selectedGradient} neon-glow-purple hover:shadow-2xl`
                  }`}
                >
                  Save to Journal ✨
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
