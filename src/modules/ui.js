import { getLeaderboard } from "./storage";

export function updateStatsDisplay(
  score,
  health,
  wpm,
  scoreEl,
  healthEl,
  wpmEl,
) {
  if (scoreEl) scoreEl.textContent = Math.floor(score); // Also round score just in case

  if (healthEl) {
    // Round health to nearest integer and ensure it's within bounds
    const roundedHealth = Math.min(100, Math.max(0, Math.round(health)));
    healthEl.textContent = roundedHealth;

    // Add visual feedback for low health
    if (roundedHealth < 30) {
      healthEl.classList.add("low-health");
    } else {
      healthEl.classList.remove("low-health");
    }
  }

  if (wpmEl) {
    // Round WPM to nearest integer
    const roundedWpm = Math.round(wpm);
    wpmEl.textContent = roundedWpm;
  }
}

export function updateLeaderboardDisplay(difficulty) {
  const leaderboardList = document.getElementById("leaderboardList");
  if (!leaderboardList) return;

  const scores = getLeaderboard(difficulty);

  if (scores.length === 0) {
    leaderboardList.innerHTML =
      '<div class="leaderboard-item">No scores yet. Play a game!</div>';
    return;
  }

  leaderboardList.innerHTML = scores
    .map(
      (entry, index) => `
        <div class="leaderboard-item">
            <span class="leaderboard-rank">#${index + 1}</span>
            <span class="leaderboard-name">${escapeHtml(entry.name)}</span>
            <span class="leaderboard-score">${entry.score} pts</span>
        </div>
    `,
    )
    .join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
