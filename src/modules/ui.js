export function updateStatsDisplay(score, health, wpm, scoreEl, healthEl, wpmEl) {  
    if (scoreEl) scoreEl.textContent = score;
    if (healthEl) healthEl.textContent = health;
    if (wpmEl) wpmEl.textContent = wpm;
}