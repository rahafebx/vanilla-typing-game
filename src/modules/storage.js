import { STORAGE_KEYS } from './constants';

export function saveScore(playerName, score, difficulty) {
    const key = getLeaderboardKey(difficulty);
    const leaderboard = getLeaderboard(difficulty);
    
    leaderboard.push({
        name: playerName.slice(0, 20),
        score: score,
        date: new Date().toISOString()
    });
    
    // Sort descending and keep top 10
    leaderboard.sort((a, b) => b.score - a.score);
    const topScores = leaderboard.slice(0, 10);
    
    localStorage.setItem(key, JSON.stringify(topScores));
    
    // Also save overall stats
    saveGameStats(score, difficulty);
}

export function getLeaderboard(difficulty) {
    const key = getLeaderboardKey(difficulty);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function getLeaderboardKey(difficulty) {
    switch(difficulty) {
        case 'easy': return STORAGE_KEYS.LEADERBOARD_EASY;
        case 'hard': return STORAGE_KEYS.LEADERBOARD_HARD;
        default: return STORAGE_KEYS.LEADERBOARD_MEDIUM;
    }
}

export function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { soundEnabled: true, theme: 'dark' };
}

function saveGameStats(score, difficulty) {
    const stats = getGameStats();
    stats.totalGames = (stats.totalGames || 0) + 1;
    stats.highestScore = Math.max(stats.highestScore || 0, score);
    stats.totalScore = (stats.totalScore || 0) + score;
    stats.averageScore = Math.round(stats.totalScore / stats.totalGames);
    
    if (!stats[difficulty]) stats[difficulty] = { games: 0, bestScore: 0 };
    stats[difficulty].games++;
    stats[difficulty].bestScore = Math.max(stats[difficulty].bestScore, score);
    
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

export function getGameStats() {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : { totalGames: 0, highestScore: 0, totalScore: 0, averageScore: 0 };
}

export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}