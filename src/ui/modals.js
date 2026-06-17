import { elements } from "./dom";
import { updateLeaderboardDisplay } from "./renderer";

export function closeModals() {
  document
    .querySelectorAll(".modal")
    .forEach((m) => m.classList.remove("active"));
  elements.appContainer.classList.remove("no-scroll");
}

export function showLeaderboard() {
  updateLeaderboardDisplay("medium");
  elements.leaderboardFilter.forEach((f) => f.classList.remove("active"));
  const med = document.querySelector('[data-lb="medium"]');
  if (med) med.classList.add("active");
  const modal = document.getElementById("leaderboardModal");
  if (modal) modal.classList.add("active");
  elements.appContainer.classList.add("no-scroll");
}

export function showAbout() {
  const modal = document.getElementById("aboutModal");
  if (modal) modal.classList.add("active");
  elements.appContainer.classList.add("no-scroll");
}

export function showGameModal(title, score, wpm) {
  if (elements.title)
    elements.title.textContent = title;
  if (elements.finalScoreEl)
    elements.finalScoreEl.textContent = score;
  if (elements.finalWPMEl)
    elements.finalWPMEl.textContent = wpm;
  if (elements.playerNameInput) elements.playerNameInput.value = "";
  if (elements.modal) elements.modal.classList.add("active");
}
