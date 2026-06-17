import { gameState, runtime } from "../core/state";
import { elements } from "./dom";
import { escapeHtml, calculateWPM } from "../utils/helpers";
import { getLeaderboard } from "../services/storage";

export function updateStatsDisplay(score, health, wpm) {
  if (elements.scoreEl) elements.scoreEl.textContent = Math.floor(score);

  if (elements.healthEl) {
    const roundedHealth = Math.min(100, Math.max(0, Math.round(health)));
    elements.healthEl.textContent = roundedHealth;
    if (roundedHealth < 30) {
      elements.healthEl.classList.add("low-health");
    } else {
      elements.healthEl.classList.remove("low-health");
    }
  }

  if (elements.wpmEl) {
    elements.wpmEl.textContent = Math.round(wpm);
  }
}

export function updateLeaderboardDisplay(difficulty = "medium") {
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

export function disableInput() {
  elements.userInput.disabled = true;
}

export function enableInput() {
  elements.userInput.disabled = false;
  if (gameState.gameActive) elements.userInput.focus();
}

export function renderEssay() {
  const text = runtime.currentEssay || "";
  const typed = elements.userInput.value;
  const compareLength = Math.max(text.length, typed.length);
  let html = "";

  for (let i = 0; i < compareLength; i++) {
    const targetChar = text[i] ?? "";
    const typedChar = typed[i] ?? "";

    if (i < typed.length) {
      if (typedChar === targetChar) {
        html += `<span class="essay-char correct">${escapeHtml(targetChar || typedChar)}</span>`;
      } else if (typedChar) {
        html += `<span class="essay-char wrong">${escapeHtml(targetChar || typedChar)}</span>`;
      }
    } else if (targetChar) {
      html += `<span class="essay-char pending">${escapeHtml(targetChar)}</span>`;
    }
  }

  elements.essayDisplay.innerHTML =
    html || '<span class="essay-char pending">Loading essay...</span>';
}

export function updateProgressBar() {
  if (gameState.mode === "essay") {
    const ratio = runtime.currentEssay.length
      ? elements.userInput.value.length / runtime.currentEssay.length
      : 0;
    elements.progressBar.style.width = Math.min(ratio * 100, 100) + "%";
    return;
  }

  if (!runtime.currentWordList[runtime.currentWordIndex]) return;
  const word = runtime.currentWordList[runtime.currentWordIndex];
  const percentage = (elements.userInput.value.length / word.length) * 100;
  elements.progressBar.style.width = Math.min(percentage, 100) + "%";
}

export function displayNextWord() {
  if (!runtime.currentWordList[runtime.currentWordIndex]) {
    return false;
  }

  elements.currentWordDisplay.textContent =
    runtime.currentWordList[runtime.currentWordIndex].toLowerCase();
  elements.userInput.value = "";
  updateProgressBar();
  return true;
}

export function updateWordPool() {
  if (!elements.wordPool) return;
  if (gameState.mode === "essay") {
    elements.wordPool.innerHTML =
      '<div class="pool-word essay-tag">essay mode</div><div class="pool-word next">paragraph</div>';
    return;
  }

  elements.wordPool.innerHTML = "";
  const displayCount = gameState.mode === "survival" ? 8 : 5;
  for (
    let i = runtime.currentWordIndex;
    i < Math.min(runtime.currentWordIndex + displayCount, runtime.currentWordList.length);
    i++
  ) {
    const el = document.createElement("div");
    el.className = "pool-word" + (i === runtime.currentWordIndex ? " next" : "");
    el.textContent = runtime.currentWordList[i];
    elements.wordPool.appendChild(el);
  }

  if (
    gameState.mode === "survival" &&
    runtime.currentWordList.length - runtime.currentWordIndex < 10
  ) {
    const remainingEl = document.createElement("div");
    remainingEl.className = "pool-word warning";
    remainingEl.textContent = `${runtime.currentWordList.length - runtime.currentWordIndex} left - loading more...`;
    elements.wordPool.appendChild(remainingEl);
  }
}

export function updateComboDisplay() {
  let comboElement = document.getElementById("comboDisplay");
  if (!comboElement && runtime.survivalModeActive) {
    const statsPanel = document.querySelector(".stats-panel");
    if (statsPanel && !document.getElementById("comboDisplay")) {
      const comboCard = document.createElement("div");
      comboCard.className = "stat-card";
      comboCard.innerHTML = `
        <div class="stat-label">COMBO</div>
        <div class="stat-value" id="comboDisplay">0</div>
      `;
      statsPanel.appendChild(comboCard);
    }
    comboElement = document.getElementById("comboDisplay");
  }

  if (comboElement) {
    comboElement.textContent = runtime.survivalCombo;
    if (runtime.survivalCombo > 5) {
      comboElement.style.color = "var(--accent-warning)";
    } else if (runtime.survivalCombo > 10) {
      comboElement.style.color = "var(--accent-success)";
    } else {
      comboElement.style.color = "";
    }
  }
}

export function prepareContent() {
  elements.userInput.classList.remove("wrong", "correct");

  if (gameState.mode === "essay") {
    elements.wordPool.classList.remove("show");
    elements.progressBarContainer.classList.add("essay");
    elements.essayDisplay.classList.add("show");
    if (elements.essayDisplay) {
      elements.essayDisplay.innerHTML =
        '<span class="essay-char pending">Loading essay...</span>';
    }
    runtime.essayProgress = 0;
    elements.currentWordDisplay.textContent = "essay task";
    elements.userInput.classList.remove("word-mode");
    elements.userInput.classList.add("essay-mode");
    elements.userInput.setAttribute("rows", 7);
  } else {
    elements.wordPool.classList.add("show");
    elements.essayDisplay.classList.remove("show");
    elements.progressBarContainer.classList.remove("essay");
    elements.userInput.classList.remove("essay-mode");
    elements.userInput.setAttribute("rows", 1);
    elements.currentWordDisplay.textContent = "loading...";

    if (gameState.mode === "survival") {
      elements.currentWordDisplay.classList.add("survival-mode");
    } else {
      elements.currentWordDisplay.classList.remove("survival-mode");
    }
  }
}
