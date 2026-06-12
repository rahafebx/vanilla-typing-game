export const THEME_KEY = "type-ebx-theme";

export const WORD_API_URL = 'https://random-word-api.herokuapp.com/word?number=20';
export const ESSAY_API_URL = 'https://baconipsum.com/api/?type=meat-and-filler&paras=1&format=text';

export const FALLBACK_WORDS = ['apple', 'beach', 'cloud', 'dream', 'eagle', 'flame', 'grace', 'heart',
                         'image', 'jolly', 'knight', 'light', 'magic', 'night', 'ocean', 'peace',
                         'queen', 'river', 'storm', 'thunder'];

export const FALLBACK_ESSAYS = [
    'A calm morning can change the pace of an entire day. When the room is quiet and the mind is focused, even difficult work feels possible. Small steps repeated with care often become the difference between drifting and finishing well.',
    'Learning to type accurately is less about speed at the beginning and more about patience. The hands remember through repetition, and the mind learns to trust a steady rhythm. With enough practice, accuracy becomes the foundation of speed.',
    'Clear thinking grows from clear habits. A short paragraph typed carefully can train attention better than a long session of rushed mistakes. The goal is not perfection in one attempt but consistency across many attempts.'
];

export const STORAGE_KEYS = {
    LEADERBOARD_EASY: 'ebxtype_leaderboard_easy',
    LEADERBOARD_MEDIUM: 'ebxtype_leaderboard_medium',
    LEADERBOARD_HARD: 'ebxtype_leaderboard_hard',
    STATS: 'ebxtype_stats'
};