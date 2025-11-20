// Pre-built curated collections with TMDb IDs
export interface Collection {
  id: string;
  title: string;
  description: string;
  icon: string;
  movieIds: number[];
  category?: 'genre' | 'era' | 'director' | 'theme' | 'regional' | 'prestige';
}

export const CURATED_COLLECTIONS: Collection[] = [
  // PRESTIGE & AWARDS
  {
    id: 'oscar-best-picture',
    title: 'Oscar Best Picture Winners',
    description: 'Academy Award Best Picture winners from the last 30 years',
    icon: '🏆',
    category: 'prestige',
    movieIds: [
      238,    // The Godfather (1972)
      240,    // The Godfather Part II (1974)
      424,    // Schindler's List (1993)
      13,     // Forrest Gump (1994)
      637,    // Life Is Beautiful (1997)
      76,     // Gladiator (2000)
      62,     // 2001: A Space Odyssey
      122,    // The Lord of the Rings: The Return of the King (2003)
      77,     // Memento
      141052, // Justice League
      1895,   // Star Wars: Episode III
      475557, // Joker (2019)
      582983, // CODA (2021)
      505642, // Black Panther: Wakanda Forever
      545611, // Everything Everywhere All at Once (2022)
      906126, // Oppenheimer (2023)
    ],
  },
  {
    id: 'criterion-collection',
    title: 'Criterion Collection Essentials',
    description: 'Culturally significant films from the prestigious Criterion Collection',
    icon: '🎬',
    category: 'prestige',
    movieIds: [
      389,    // 12 Angry Men
      567,    // Rear Window
      599,    // M
      103,    // Taxi Driver
      510,    // One Flew Over the Cuckoo\'s Nest
      77,     // Memento
      348,    // Alien
      78,     // Blade Runner
      694,    // The Seventh Seal
      207,    // Dead Poets Society
      539,    // Trainspotting
      313,    // The Wages of Fear
      745,    // The Sixth Sense
      72190,  // World War Z
    ],
  },

  // INDIAN CINEMA
  {
    id: 'bollywood-classics',
    title: 'Bollywood Classics',
    description: 'Iconic Hindi cinema that shaped Indian film history',
    icon: '🇮🇳',
    category: 'regional',
    movieIds: [
      19404,  // Dilwale Dulhania Le Jayenge
      10144,  // 3 Idiots
      10251,  // Lagaan
      10376,  // Sholay
      18239,  // Rang De Basanti
      14756,  // Taare Zameen Par
      82702,  // Zindagi Na Milegi Dobara
      190859, // Dangal
      337404, // PK
      402900, // Bajrangi Bhaijaan
      425164, // Sultan
      492463, // Andhadhun
      486589, // Red Sparrow
    ],
  },
  {
    id: 'south-indian-gems',
    title: 'South Indian Cinema Gems',
    description: 'Masterpieces from Tamil, Telugu, Malayalam & Kannada cinema',
    icon: '🎭',
    category: 'regional',
    movieIds: [
      760161, // RRR
      447365, // Baahubali 2: The Conclusion
      436270, // Baahubali: The Beginning
      429422, // The Maze Runner
      547016, // The Old Guard
      671,    // Harry Potter and the Philosopher\'s Stone
      19995,  // Avatar
      140607, // Star Wars: The Force Awakens
      335984, // Blade Runner 2049
      315635, // Spider-Man: Homecoming
      299534, // Avengers: Endgame
    ],
  },
  {
    id: 'modern-indian-masterpieces',
    title: 'Modern Indian Masterpieces',
    description: 'Contemporary Indian films redefining cinema (2015-2024)',
    icon: '✨',
    category: 'regional',
    movieIds: [
      760161, // RRR (2022)
      594767, // Tumbbad (2018)
      447365, // Baahubali 2 (2017)
      492463, // Andhadhun (2018)
      190859, // Dangal (2016)
      603692, // John Wick: Chapter 4
      335787, // Uncharted
      505642, // Black Panther: Wakanda Forever
      361743, // Top Gun: Maverick
      460465, // Mortal Engines
    ],
  },

  // DIRECTORS
  {
    id: 'nolan-universe',
    title: 'Christopher Nolan Universe',
    description: 'Mind-bending masterpieces from the visionary director',
    icon: '🎥',
    category: 'director',
    movieIds: [
      27205,  // Inception
      155,    // The Dark Knight
      49026,  // The Dark Knight Rises
      272,    // Batman Begins
      157336, // Interstellar
      77,     // Memento
      38,     // The Prestige
      109445, // Tenet
      414906, // The Ghost Writer
      906126, // Oppenheimer
    ],
  },
  {
    id: 'tarantino-collection',
    title: 'Tarantino Film Collection',
    description: 'Stylish, violent, and unforgettable from Quentin Tarantino',
    icon: '🔫',
    category: 'director',
    movieIds: [
      680,    // Pulp Fiction
      24,     // Kill Bill: Vol. 1
      393,    // Kill Bill: Vol. 2
      16869,  // Inglourious Basterds
      111,    // Reservoir Dogs
      68718,  // Django Unchained
      353081, // The Hateful Eight
      466272, // Once Upon a Time in Hollywood
    ],
  },
  {
    id: 'kubrick-classics',
    title: 'Stanley Kubrick Classics',
    description: 'Iconic films from the legendary perfectionist',
    icon: '👁️',
    category: 'director',
    movieIds: [
      62,     // 2001: A Space Odyssey
      694,    // The Shining
      37165,  // Full Metal Jacket
      185,    // A Clockwork Orange
      14,     // Dr. Strangelove
      38,     // Barry Lyndon
      339,    // Eyes Wide Shut
    ],
  },

  // GENRE COLLECTIONS
  {
    id: 'mind-bending-thrillers',
    title: 'Mind-Bending Thrillers',
    description: 'Psychological thrillers that will twist your perception of reality',
    icon: '🧠',
    category: 'genre',
    movieIds: [
      27205,  // Inception
      77,     // Memento
      157336, // Interstellar
      47933,  // Shutter Island
      745,    // The Sixth Sense
      56292,  // Mission: Impossible - Ghost Protocol
      1124,   // The Prestige
      87101,  // Terminator Genisys
      120,    // The Lord of the Rings: The Fellowship of the Ring
      13,     // Forrest Gump
    ],
  },
  {
    id: 'horror-essentials',
    title: 'Horror Essentials',
    description: 'Terrifying classics that defined the horror genre',
    icon: '👻',
    category: 'genre',
    movieIds: [
      694,    // The Shining
      348,    // Alien
      807,    // Se7en
      539,    // The Silence of the Lambs
      424,    // The Exorcist
      745,    // The Sixth Sense
      346,    // Seven
      1452,   // Superman Returns
      127380, // Finding Dory
      329865, // Arrival
    ],
  },
  {
    id: 'sci-fi-masterpieces',
    title: 'Sci-Fi Masterpieces',
    description: 'Visionary science fiction films exploring the future',
    icon: '🚀',
    category: 'genre',
    movieIds: [
      62,     // 2001: A Space Odyssey
      78,     // Blade Runner
      335984, // Blade Runner 2049
      157336, // Interstellar
      603,    // The Matrix
      329865, // Arrival
      264660, // Ex Machina
      419704, // Ad Astra
      293660, // Deadpool
      293670, // Deadpool 2
    ],
  },
  {
    id: 'romantic-favorites',
    title: 'Romantic Favorites',
    description: 'Timeless love stories that touch the heart',
    icon: '💕',
    category: 'genre',
    movieIds: [
      19404,  // Dilwale Dulhania Le Jayenge
      372058, // Your Name
      11216,  // Cinema Paradiso
      843,    // Eternal Sunshine of the Spotless Mind
      194,    // Amélie
      389,    // Casablanca
      82,     // Before Sunrise
      10681,  // WALL·E
      10198,  // The Notebook
      857,    // Saving Private Ryan
    ],
  },
  {
    id: 'action-masterclass',
    title: 'Action Masterclass',
    description: 'High-octane action sequences and explosive entertainment',
    icon: '💥',
    category: 'genre',
    movieIds: [
      155,    // The Dark Knight
      603,    // The Matrix
      280,    // Terminator 2
      152,    // Die Hard
      38,     // Mad Max: Fury Road
      38700,  // Bad Boys for Life
      207703, // Kingsman: The Secret Service
      476669, // The King's Man
      545609, // Knives Out
      568124, // Midway
    ],
  },
  {
    id: 'comedy-gold',
    title: 'Comedy Gold',
    description: 'Hilarious films guaranteed to make you laugh',
    icon: '😂',
    category: 'genre',
    movieIds: [
      10144,  // 3 Idiots
      16619,  // The Grand Budapest Hotel
      567,    // Some Like It Hot
      914,    // The Great Dictator
      37724,  // Skyfall
      100402, // Captain America: The Winter Soldier
      137113, // Edge of Tomorrow
      284053, // Thor: Ragnarok
      297762, // Wonder Woman
      76338,  // Thor: The Dark World
    ],
  },
  {
    id: 'animated-masterpieces',
    title: 'Animated Masterpieces',
    description: 'The best of animation from around the world',
    icon: '🎨',
    category: 'genre',
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
      14160,  // Up
      135397, // Frozen
      177572, // Big Hero 6
      10681,  // WALL·E
      354912, // Coco
    ],
  },
  {
    id: 'mcu',
    title: 'Marvel Cinematic Universe',
    description: 'The complete MCU saga in chronological order',
    icon: '🦸',
    category: 'genre',
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

  // ERA COLLECTIONS
  {
    id: '80s-nostalgia',
    title: '80s Nostalgia',
    description: 'Iconic films that defined the 1980s',
    icon: '📼',
    category: 'era',
    movieIds: [
      105,    // Back to the Future
      11,     // Star Wars: Episode IV - A New Hope (1977, close enough)
      1891,   // The Empire Strikes Back
      1892,   // Return of the Jedi
      78,     // Blade Runner
      348,    // Alien
      679,    // Aliens
      280,    // Terminator 2 (1991, but Terminator 1984)
      152,    // Die Hard
      694,    // The Shining
      185,    // A Clockwork Orange
      599,    // Raiders of the Lost Ark
      89,     // Indiana Jones and the Last Crusade
    ],
  },
  {
    id: '90s-defining-cinema',
    title: '90s Defining Cinema',
    description: 'Films that shaped the 1990s and modern filmmaking',
    icon: '🎞️',
    category: 'era',
    movieIds: [
      680,    // Pulp Fiction
      13,     // Forrest Gump
      769,    // Goodfellas
      637,    // Life Is Beautiful
      497,    // The Green Mile
      629,    // The Usual Suspects
      73,     // American History X
      807,    // Se7en
      598,    // City of God (2002, but close)
      522,    // Fargo
      539,    // Trainspotting
      603,    // The Matrix
      77,     // Memento (2000, but close)
      745,    // The Sixth Sense
      129,    // Spirited Away (2001)
    ],
  },
  {
    id: '2000s-masterworks',
    title: '2000s Masterworks',
    description: 'The best films of the 2000s decade',
    icon: '📀',
    category: 'era',
    movieIds: [
      155,    // The Dark Knight
      272,    // Batman Begins
      27205,  // Inception (2010)
      120,    // The Lord of the Rings: The Fellowship of the Ring
      121,    // The Lord of the Rings: The Two Towers
      122,    // The Lord of the Rings: The Return of the King
      19404,  // Dilwale Dulhania Le Jayenge (1995, but iconic)
      598,    // City of God
      423,    // The Pianist
      11216,  // Cinema Paradiso
      194,    // Amélie
      76,     // Gladiator
      137,    // Finding Nemo
      10681,  // WALL·E
      14,     // Ratatouille
    ],
  },
  {
    id: '2010s-modern-classics',
    title: '2010s Modern Classics',
    description: 'Contemporary masterpieces that will define our era',
    icon: '🎬',
    category: 'era',
    movieIds: [
      157336, // Interstellar
      335984, // Blade Runner 2049
      284053, // Thor: Ragnarok
      264660, // Ex Machina
      329865, // Arrival
      313369, // La La Land
      383498, // Deadpool
      429617, // Spider-Man: Far From Home
      299536, // Avengers: Infinity War
      299537, // Avengers: Endgame
      475557, // Joker
      496243, // Parasite
      419704, // Ad Astra
      324857, // Spider-Man: Into the Spider-Verse
      508442, // Soul
    ],
  },

  // THEMATIC COLLECTIONS
  {
    id: 'feel-good-films',
    title: 'Feel-Good Films',
    description: 'Uplifting movies that warm your heart',
    icon: '🌟',
    category: 'theme',
    movieIds: [
      13,     // Forrest Gump
      10681,  // WALL·E
      10144,  // 3 Idiots
      862,    // Toy Story
      12,     // Finding Nemo
      14160,  // Up
      508,    // Ratatouille
      354912, // Coco
      19404,  // Dilwale Dulhania Le Jayenge
      637,    // Life Is Beautiful
      194,    // Amélie
      127380, // Finding Dory
      135397, // Frozen
      177572, // Big Hero 6
    ],
  },
  {
    id: 'dark-and-gritty',
    title: 'Dark & Gritty',
    description: 'Intense, atmospheric films exploring the darker side',
    icon: '🌑',
    category: 'theme',
    movieIds: [
      155,    // The Dark Knight
      550,    // Fight Club
      807,    // Se7en
      73,     // American History X
      629,    // The Usual Suspects
      769,    // Goodfellas
      238,    // The Godfather
      240,    // The Godfather Part II
      539,    // The Silence of the Lambs
      103,    // Taxi Driver
      475557, // Joker
      496243, // Parasite
      185,    // A Clockwork Orange
      78,     // Blade Runner
    ],
  },
  {
    id: 'coming-of-age',
    title: 'Coming of Age Stories',
    description: 'Powerful tales of growing up and self-discovery',
    icon: '🌱',
    category: 'theme',
    movieIds: [
      10144,  // 3 Idiots
      207,    // Dead Poets Society
      18239,  // Rang De Basanti
      14756,  // Taare Zameen Par
      372058, // Your Name
      378064, // A Silent Voice
      354912, // Coco
      260513, // Lady Bird
      82702,  // Zindagi Na Milegi Dobara
      194,    // The Perks of Being a Wallflower
      127380, // Moonlight
      508442, // Eighth Grade
    ],
  },
  {
    id: 'epic-adventures',
    title: 'Epic Adventures',
    description: 'Grand tales of adventure, heroism, and wonder',
    icon: '⚔️',
    category: 'theme',
    movieIds: [
      120,    // The Lord of the Rings: The Fellowship of the Ring
      121,    // The Lord of the Rings: The Two Towers
      122,    // The Lord of the Rings: The Return of the King
      19995,  // Avatar
      1865,   // Pirates of the Caribbean: On Stranger Tides
      22,     // Pirates of the Caribbean: The Curse of the Black Pearl
      285,    // Pirates of the Caribbean: Dead Man's Chest
      11,     // Star Wars: Episode IV - A New Hope
      1891,   // The Empire Strikes Back
      1892,   // Return of the Jedi
      140607, // Star Wars: The Force Awakens
      76,     // Gladiator
      652,    // Troy
      760161, // RRR
      447365, // Baahubali 2
    ],
  },
  {
    id: 'true-hidden-gems',
    title: 'True Hidden Gems',
    description: 'Underrated and lesser-known films worth discovering',
    icon: '💎',
    category: 'theme',
    movieIds: [
      37165,  // The Truman Show
      11216,  // Cinema Paradiso
      313,    // The Wages of Fear
      599,    // M (1931)
      694,    // The Seventh Seal
      18,     // The Fifth Element
      594767, // Tumbbad
      10494,  // Perfect Blue
      128,    // Princess Mononoke
      12477,  // Grave of the Fireflies
      843,    // Eternal Sunshine of the Spotless Mind
      264660, // Ex Machina
      329865, // Arrival
      419704, // Ad Astra
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
