import { loadTheme, getSystemTheme, applyTheme } from "./modules/theme";
import {
  fetchEssayParagraph,
  fetchRandomWords,
  generateWordsFromList,
} from "./modules/api";
import { gameState, resetState } from "./modules/states";
import { calculateWPM } from "./modules/game";
import { updateStatsDisplay } from "./modules/ui";
import { saveScore } from "./modules/storage";

let currentMode = "essay",
  currentEssay = "",
  essayProgress = 0,
  currentWordIndex = 0,
  startTime = null,
  currentDifficulty = "medium",
  gameActive = true,
  wordsTyped = 0;

// DOM Elements
const elements = {
  themeToggle: document.getElementById("themeToggle"),
  navToggle: document.getElementById("navToggle"),
  nav: document.getElementById("nav"),
  themeContext: document.getElementById("themeContext"),
  currentWordDisplay: document.getElementById("currentWord"),
  userInput: document.getElementById("userInput"),
  essayDisplay: document.getElementById("essayDisplay"),
  wordPool: document.getElementById("wordPool"),
  scoreEl: document.getElementById("scoreValue"),
  healthEl: document.getElementById("healthValue"),
  wpmEl: document.getElementById("wpmValue"),
  progressBarContainer: document.getElementById("progress"),
  progressBar: document.getElementById("progressBar"),
  modal: document.getElementById("gameOverModal"),
  title: document.getElementById("gameOverTitle"),
  finalScoreEl: document.getElementById("finalScore"),
  finalWPMEl: document.getElementById("finalWPM"),
  playerNameInput: document.getElementById("playerName"),
  saveScore: document.getElementById("saveScore"),
  playAgain: document.getElementById("playAgain"),
};

// Initialization
async function init() {
  const initialTheme = loadTheme();
  applyTheme(initialTheme, elements.themeToggle, elements.themeContext);
  elements.themeToggle?.addEventListener("click", handleThemeToggle);
  elements.navToggle?.addEventListener("click", handleNavToggle);
  document.addEventListener("click", handleDocumentClick);

  await loadNewContent();

  elements.userInput?.addEventListener("input", handleTyping);
  elements.saveScore?.addEventListener("click", saveGameScore);
  elements.playAgain?.addEventListener("click", () => {
    closeModals();
    resetGame();
  });

  resetGameLogic();
}

// Helper Functions
function handleThemeToggle() {
  const currentTheme = loadTheme();
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme, elements.themeToggle, elements.themeContext);
}

function handleDocumentClick(event) {
  if (!event.target.closest(".navbar")) {
    navToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }
}

function handleNavToggle() {
  const isExpanded =
    elements.navToggle.getAttribute("aria-expanded") === "true";
  if (isExpanded) {
    navToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    return;
  }
  navToggle.setAttribute("aria-expanded", "true");
  nav.classList.add("is-open");
}
async function loadNewContent() {
  if (currentMode === "essay") {
    elements.wordPool.classList.remove("show");

    elements.progressBarContainer.classList.add("essay");
    if (elements.essayDisplay) {
      elements.essayDisplay.innerHTML =
        '<span class="essay-char pending">Loading essay...</span>';
    }
    currentEssay = await fetchEssayParagraph();
    essayProgress = 0;
    elements.currentWordDisplay.textContent = "essay task";
    elements.userInput.classList.remove("word-mode");
    elements.userInput.classList.add("essay-mode");
    elements.userInput.disabled = false;
    renderEssay();
  } else {
    elements.wordPool.classList.add("show");
    elements.progressBarContainer.classList.remove("essay");
    elements.userInput.classList.remove("essay-mode");
  }
}

function renderEssay() {
  const text = currentEssay || "";
  const typed = elements.userInput.value;
  const safeTyped = typed;
  const compareLength = Math.max(text.length, safeTyped.length);
  let html = "";

  for (let i = 0; i < compareLength; i++) {
    const targetChar = text[i] ?? "";
    const typedChar = safeTyped[i] ?? "";

    if (i < safeTyped.length) {
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

function handleTyping() {
  if (!gameActive) return;
  if (!startTime && elements.userInput.value.length > 0) {
    startTime = Date.now();
  }

  if (currentMode === "essay") {
    updateEssayState();
    return;
  }
  updateProgressBar();
}

function updateEssayState() {
  const typed = elements.userInput.value;
  essayProgress = typed.length;
  renderEssay();

  const target = currentEssay.slice(0, typed.length);
  const mistakes = countEssayMistakes(typed, target);
  const progressRatio = currentEssay.length
    ? typed.length / currentEssay.length
    : 0;

  if (!startTime && typed.length > 0) {
    startTime = Date.now();
  }

  gameState.score = Math.round(progressRatio * 1000);
  gameState.health = Math.max(0, 100 - mistakes * getEssayPenalty());
  gameState.wpm = calculateWPM(
    startTime,
    Math.max(1, Math.floor(typed.length / 5)),
  );

  updateStatsDisplay(
    gameState.score,
    gameState.health,
    gameState.wpm,
    elements.scoreEl,
    elements.healthEl,
    elements.wpmEl,
  );

  if (typed.length === currentEssay.length) {
    wordsTyped = Math.max(1, Math.floor(typed.length / 5));
    finishEssay();
  }

  // if (gameState.health <= 0) {
  //     endGame();
  // }
}

function countEssayMistakes(typed, target) {
  let mistakes = 0;
  const maxLength = Math.max(typed.length, target.length);
  for (let i = 0; i < maxLength; i++) {
    if ((typed[i] || "") !== (target[i] || "")) {
      mistakes++;
    }
  }
  return mistakes;
}

function getEssayPenalty() {
  switch (currentDifficulty) {
    case "easy":
      return 1;
    case "hard":
      return 3;
    default:
      return 2;
  }
}

function finishEssay() {
  gameActive = false;
  showGameCompleteModal();
  // Disable input when essay is completed
  if (elements.userInput) {
    elements.userInput.disabled = true;
  }
}

function resetGameLogic() {
  gameActive = true;
  startTime = null;
  wordsTyped = 0;
  resetState();
  updateStatsDisplay(
    0,
    100,
    0,
    elements.scoreEl,
    elements.healthEl,
    elements.wpmEl,
  );
}

function showGameCompleteModal() {
  if (elements.title) elements.title.textContent = "Essay completed";
  if (elements.finalScoreEl)
    elements.finalScoreEl.textContent = gameState.score;

  if (elements.finalWPMEl) {
    const finalWPM = calculateWPM(startTime, Math.max(1, wordsTyped));
    elements.finalWPMEl.textContent = finalWPM;
  }

  if (elements.playerNameInput) elements.playerNameInput.value = "";
  if (elements.modal) elements.modal.classList.add("active");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function endGame() {
  gameActive = false;

  const finalWPM = calculateWPM(startTime, Math.max(1, wordsTyped));
  if (elements.title) elements.title.textContent = "GAME OVER";
  if (elements.finalScoreEl)
    elements.finalScoreEl.textContent = gameState.score;
  if (elements.finalWPMEl) elements.finalWPMEl.textContent = finalWPM;
  if (elements.playerNameInput) elements.playerNameInput.value = "";
  if (elements.modal) elements.modal.classList.add("active");
}

function saveGameScore() {
  const playerName = elements.playerNameInput?.value.trim() || "Anonymous";
  saveScore(playerName, gameState.score, currentDifficulty);
  closeModals();
  resetGame();
}

function closeModals() {
  document
    .querySelectorAll(".modal")
    .forEach((m) => m.classList.remove("active"));
  if (gameActive) elements.userInput.focus();
}

async function resetGame() {
  gameActive = true;
  resetState();
  gameState.difficulty = currentDifficulty;
  gameState.mode = currentMode;
  startTime = null;

  // Reset essay-specific variables
  currentEssay = "";
  essayProgress = 0;
  currentWordIndex = 0;
  wordsTyped = 0;

  updateStatsDisplay(
    gameState.score,
    gameState.health,
    0,
    elements.scoreEl,
    elements.healthEl,
    elements.wpmEl,
  );

  // Clear input and display
  if (elements.userInput) {
    elements.userInput.value = "";
    elements.userInput.disabled = false;
    elements.userInput.focus();
  }

  // Clear essay display
  if (elements.essayDisplay) {
    elements.essayDisplay.innerHTML = "";
  }

  // Reset progress bar
  if (elements.progressBar) {
    elements.progressBar.style.width = "0%";
  }

  await loadNewContent();
  closeModals();
}

function updateProgressBar() {
  if (currentMode === "essay") {
    const ratio = currentEssay.length
      ? elements.userInput.value.length / currentEssay.length
      : 0;
    elements.progressBar.style.width = Math.min(ratio * 100, 100) + "%";
    return;
  }
}

// Start the app
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
