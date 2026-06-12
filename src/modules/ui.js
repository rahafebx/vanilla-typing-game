import { getLeaderboard } from './storage';

export function updateStatsDisplay(score, health, wpm, scoreEl, healthEl, wpmEl) {  
    if (scoreEl) scoreEl.textContent = score;
    if (healthEl) healthEl.textContent = health;
    if (wpmEl) wpmEl.textContent = wpm;
}

export function updateLeaderboardDisplay(difficulty) {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    
    const scores = getLeaderboard(difficulty);
    
    if (scores.length === 0) {
        leaderboardList.innerHTML = '<div class="leaderboard-item">No scores yet. Play a game!</div>';
        return;
    }
    
    leaderboardList.innerHTML = scores.map((entry, index) => `
        <div class="leaderboard-item">
            <span class="leaderboard-rank">#${index + 1}</span>
            <span class="leaderboard-name">${escapeHtml(entry.name)}</span>
            <span class="leaderboard-score">${entry.score} pts</span>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

