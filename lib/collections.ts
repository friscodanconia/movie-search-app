// Pre-built curated collections with TMDb IDs
export interface Collection {
  id: string;
  title: string;
  description: string;
  icon: string;
  movieIds: number[];
}

export const CURATED_COLLECTIONS: Collection[] = [
  {
    id: 'oscar-winners',
    title: 'Oscar Winners',
    description: 'Best Picture winners that defined cinema',
    icon: '🏆',
    movieIds: [
      238,    // The Godfather
      424,    // Schindler's List
      389,    // 12 Angry Men
      278,    // The Shawshank Redemption
      19404,  // Dilwale Dulhania Le Jayenge
      372058, // Your Name
      129,    // Spirited Away
      497,    // The Green Mile
      13,     // Forrest Gump
      680,    // Pulp Fiction
      155,    // The Dark Knight
      550,    // Fight Club
      122,    // The Lord of the Rings: The Return of the King
      637,    // Life Is Beautiful
      769,    // Goodfellas
    ],
  },
  {
    id: 'mcu',
    title: 'Marvel Cinematic Universe',
    description: 'The complete MCU saga in chronological order',
    icon: '🦸',
    movieIds: [
      1726,   // Iron Man
      1724,   // The Incredible Hulk
      10138,  // Iron Man 2
      10195,  // Thor
      1771,   // Captain America: The First Avenger
      24428,  // The Avengers
      68721,  // Iron Man 3
      76338,  // Thor: The Dark World
      100402, // Captain America: The Winter Soldier
      118340, // Guardians of the Galaxy
      99861,  // Avengers: Age of Ultron
      102899, // Ant-Man
      271110, // Captain America: Civil War
      284053, // Thor: Ragnarok
      284054, // Black Panther
      299536, // Avengers: Infinity War
      299537, // Avengers: Endgame
      429617, // Spider-Man: Far From Home
    ],
  },
  {
    id: '90s-classics',
    title: '90s Classics',
    description: 'Defining films of the 1990s',
    icon: '📼',
    movieIds: [
      680,    // Pulp Fiction
      13,     // Forrest Gump
      769,    // Goodfellas
      637,    // Life Is Beautiful
      497,    // The Green Mile
      629,    // The Usual Suspects
      73,     // American History X
      807,    // Se7en
      10494,  // Perfect Blue
      11,     // Star Wars: Episode IV - A New Hope
      585,    // Monsters, Inc.
      598,    // City of God
      522,    // Fargo
      539,    // Trainspotting
    ],
  },
  {
    id: 'hidden-gems',
    title: 'Hidden Gems',
    description: 'Underrated masterpieces you might have missed',
    icon: '💎',
    movieIds: [
      37165,  // The Truman Show
      1422,   // The Departed
      77,     // Memento
      103,    // Taxi Driver
      510,    // One Flew Over the Cuckoo\'s Nest
      567,    // Rear Window
      423,    // The Pianist
      18,     // The Fifth Element
      78,     // Blade Runner
      207,    // Dead Poets Society
      11324,  // Shutter Island
      1893,   // Star Wars: Episode I - The Phantom Menace
      745,    // The Sixth Sense
      652,    // Troy
    ],
  },
  {
    id: 'epic-adventures',
    title: 'Epic Adventures',
    description: 'Grand tales of adventure and heroism',
    icon: '⚔️',
    movieIds: [
      122,    // The Lord of the Rings: The Return of the King
      120,    // The Lord of the Rings: The Fellowship of the Ring
      121,    // The Lord of the Rings: The Two Towers
      99861,  // Avengers: Age of Ultron
      127585, // X-Men: Days of Future Past
      1865,   // Pirates of the Caribbean: On Stranger Tides
      1568,   // Avatar
      11,     // Star Wars: Episode IV - A New Hope
      1891,   // The Empire Strikes Back
      1892,   // Return of the Jedi
      140607, // Star Wars: The Force Awakens
      181808, // Star Wars: The Last Jedi
      181812, // Star Wars: The Rise of Skywalker
      272,    // Batman Begins
    ],
  },
  {
    id: 'animated-masterpieces',
    title: 'Animated Masterpieces',
    description: 'The best of animation from around the world',
    icon: '🎨',
    movieIds: [
      129,    // Spirited Away
      4935,   // Howl's Moving Castle
      128,    // Princess Mononoke
      12477,  // Grave of the Fireflies
      372058, // Your Name
      378064, // A Silent Voice
      585,    // Monsters, Inc.
      12,     // Finding Nemo
      862,    // Toy Story
      863,    // Toy Story 2
      10193,  // Toy Story 3
      260513, // Incredibles 2
      9806,   // The Incredibles
      508,    // Ratatouille
    ],
  },
];

// Watchlist management with localStorage
const WATCHLIST_KEY = 'cinemagic_watchlist';

export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  media_type: 'movie' | 'tv';
  addedAt: number;
}

export const getWatchlist = (): WatchlistItem[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(WATCHLIST_KEY);
  return data ? JSON.parse(data) : [];
};

export const addToWatchlist = (item: WatchlistItem): void => {
  const watchlist = getWatchlist();
  const exists = watchlist.find((i) => i.id === item.id && i.media_type === item.media_type);
  if (!exists) {
    watchlist.unshift({ ...item, addedAt: Date.now() });
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }
};

export const removeFromWatchlist = (id: number, media_type: 'movie' | 'tv'): void => {
  const watchlist = getWatchlist();
  const filtered = watchlist.filter((i) => !(i.id === id && i.media_type === media_type));
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
};

export const isInWatchlist = (id: number, media_type: 'movie' | 'tv'): boolean => {
  const watchlist = getWatchlist();
  return watchlist.some((i) => i.id === id && i.media_type === media_type);
};
