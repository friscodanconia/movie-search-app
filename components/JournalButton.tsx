'use client';

import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import JournalEntryModal from './JournalEntryModal';

interface JournalButtonProps {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
  };
  variant?: 'default' | 'fab';
}

export default function JournalButton({ movie, variant = 'default' }: JournalButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (variant === 'fab') {
    return (
      <>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 neon-glow-purple shadow-2xl flex items-center justify-center"
          aria-label="Add to journal"
        >
          <BookOpen className="w-6 h-6" />
        </motion.button>
        <JournalEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          movie={movie}
        />
      </>
    );
  }

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 neon-glow-purple font-bold ripple"
      >
        <BookOpen className="w-5 h-5" />
        Add to Journal
      </motion.button>
      <JournalEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={movie}
      />
    </>
  );
}
