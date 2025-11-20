import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JournalEntry, Challenge, MoodTag, UserCinemaDNA } from '@/lib/types';

interface JournalState {
  entries: JournalEntry[];
  challenges: Challenge[];

  // Actions
  addEntry: (entry: Omit<JournalEntry, 'id' | 'watchedAt' | 'rewatchCount'>) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;

  // Challenge actions
  updateChallengeProgress: (challengeId: string, movieId: number) => void;
  completeChallenge: (challengeId: string) => void;

  // Analytics
  getCinemaDNA: () => UserCinemaDNA;
  getEntriesByMood: (mood: MoodTag) => JournalEntry[];
  getWatchStreak: () => number;
}

const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'kubrick-complete',
    title: 'Kubrick Mastery',
    description: 'Watch all Stanley Kubrick films',
    icon: '🎬',
    progress: 0,
    total: 13,
    completed: false,
    type: 'director',
    movies: [694, 5581, 96, 291, 114, 332, 904, 578, 70, 637, 185, 210, 1092],
  },
  {
    id: 'criterion-explorer',
    title: 'Criterion Explorer',
    description: 'Watch 50 Criterion Collection films',
    icon: '📽️',
    progress: 0,
    total: 50,
    completed: false,
    type: 'collection',
    movies: [],
  },
  {
    id: '90s-classics',
    title: '90s Cinema Revival',
    description: 'Experience 20 essential 90s films',
    icon: '💿',
    progress: 0,
    total: 20,
    completed: false,
    type: 'decade',
    movies: [680, 78, 807, 103, 629, 155, 122, 497, 489, 274],
  },
  {
    id: 'noir-master',
    title: 'Film Noir Expert',
    description: 'Dive into 15 classic noir films',
    icon: '🕵️',
    progress: 0,
    total: 15,
    completed: false,
    type: 'genre',
    movies: [],
  },
  {
    id: 'century-milestone',
    title: 'Century Club',
    description: 'Log 100 films in your journal',
    icon: '💯',
    progress: 0,
    total: 100,
    completed: false,
    type: 'milestone',
    movies: [],
  },
];

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      challenges: DEFAULT_CHALLENGES,

      addEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          watchedAt: Date.now(),
          rewatchCount: get().entries.filter(e => e.movieId === entry.movieId).length,
        };

        set((state) => ({
          entries: [newEntry, ...state.entries],
        }));

        // Update challenges
        get().challenges.forEach((challenge) => {
          if (challenge.type === 'milestone') {
            get().updateChallengeProgress(challenge.id, entry.movieId);
          } else if (challenge.movies.includes(entry.movieId)) {
            get().updateChallengeProgress(challenge.id, entry.movieId);
          }
        });
      },

      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },

      updateChallengeProgress: (challengeId, movieId) => {
        set((state) => ({
          challenges: state.challenges.map((challenge) => {
            if (challenge.id === challengeId) {
              const isNewProgress = !state.entries
                .slice(0, -1)
                .some((entry) => entry.movieId === movieId);

              if (isNewProgress || challenge.type === 'milestone') {
                const newProgress = challenge.type === 'milestone'
                  ? state.entries.length
                  : challenge.progress + 1;

                return {
                  ...challenge,
                  progress: Math.min(newProgress, challenge.total),
                  completed: newProgress >= challenge.total,
                };
              }
            }
            return challenge;
          }),
        }));
      },

      completeChallenge: (challengeId) => {
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === challengeId
              ? { ...challenge, completed: true, progress: challenge.total }
              : challenge
          ),
        }));
      },

      getCinemaDNA: () => {
        const { entries } = get();

        if (entries.length === 0) {
          return {
            dominantMoods: [],
            favoriteDecades: [],
            totalWatched: 0,
            avgRating: 0,
            currentStreak: 0,
            longestStreak: 0,
          };
        }

        // Calculate mood distribution
        const moodCounts: Record<string, number> = {};
        entries.forEach((entry) => {
          entry.mood.forEach((mood) => {
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
          });
        });

        const dominantMoods = Object.entries(moodCounts)
          .map(([mood, count]) => ({ mood: mood as MoodTag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        // Calculate average rating
        const ratingsEntries = entries.filter((e) => e.rating !== undefined);
        const avgRating =
          ratingsEntries.length > 0
            ? ratingsEntries.reduce((sum, e) => sum + (e.rating || 0), 0) /
              ratingsEntries.length
            : 0;

        // Find rewatch champion
        const rewatchCounts: Record<string, { title: string; count: number }> = {};
        entries.forEach((entry) => {
          if (!rewatchCounts[entry.movieId]) {
            rewatchCounts[entry.movieId] = { title: entry.title, count: 0 };
          }
          rewatchCounts[entry.movieId].count++;
        });

        const rewatchChampion = Object.values(rewatchCounts)
          .sort((a, b) => b.count - a.count)[0];

        // Calculate streak
        const currentStreak = get().getWatchStreak();

        return {
          dominantMoods,
          favoriteDecades: [],
          totalWatched: entries.length,
          avgRating,
          rewatchChampion: rewatchChampion?.count > 1 ? rewatchChampion : undefined,
          currentStreak,
          longestStreak: currentStreak,
        };
      },

      getEntriesByMood: (mood) => {
        return get().entries.filter((entry) => entry.mood.includes(mood));
      },

      getWatchStreak: () => {
        const { entries } = get();
        if (entries.length === 0) return 0;

        const sortedEntries = [...entries].sort((a, b) => b.watchedAt - a.watchedAt);
        let streak = 1;
        const oneDayMs = 24 * 60 * 60 * 1000;

        for (let i = 0; i < sortedEntries.length - 1; i++) {
          const daysDiff = Math.floor(
            (sortedEntries[i].watchedAt - sortedEntries[i + 1].watchedAt) / oneDayMs
          );

          if (daysDiff <= 7) {
            streak++;
          } else {
            break;
          }
        }

        return streak;
      },
    }),
    {
      name: 'cinema-journal-storage',
    }
  )
);
