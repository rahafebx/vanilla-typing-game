import { loadTheme, getSystemTheme, applyTheme } from "./modules/theme";
import {
  fetchEssayParagraph,
  fetchRandomWords,
  generateWordsFromList,
} from "./modules/api";
import { gameState, resetState } from "./modules/states";
import { calculateWPM } from "./modules/game";
import { updateStatsDisplay, updateLeaderboardDisplay } from "./modules/ui";
import { saveScore } from "./modules/storage";
import { WORDS_1K } from "./modules/words";

let currentMode = "essay", // game level
  startTime = null,
  gameActive = true,
  currentDifficulty = "medium",
  currentEssay = "", // essay mode
  essayProgress = 0,
  currentWordIndex = 0, // word mode
  wordsTyped = 0,
  wordsCount = 30,
  currentWordList = [];

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
  leaderboardList: document.getElementById("leaderboardList"),
  leaderboardFilter: document.querySelectorAll(".lb-filter"),
  modalCloseBtns: document.querySelectorAll(".modal-close"),
  difficultyBtns: document.querySelectorAll(".difficulty-btn"),
  modeBtns: document.querySelectorAll(".mode-btn"),
  modeHint: document.getElementById("modeHint"),
  inputHint: document.getElementById("inputHint"),
  resetBtn: document.getElementById("resetGame"),
  skipBtn: document.getElementById("skipWord"),
};

// Initialization
async function init() {
  disableInput();
  const initialTheme = loadTheme();
  applyTheme(initialTheme, elements.themeToggle, elements.themeContext);
  elements.themeToggle?.addEventListener("click", handleThemeToggle);
  elements.navToggle?.addEventListener("click", handleNavToggle);
  document.addEventListener("click", handleDocumentClick);

  elements.userInput?.addEventListener("input", handleTyping);
  elements.userInput?.addEventListener("keydown", handleKeyDown);
  elements.saveScore?.addEventListener("click", saveGameScore);
  elements.playAgain?.addEventListener("click", () => {
    closeModals();
    resetGame();
  });

  document
    .querySelector('[data-nav="leaderboard"]')
    .addEventListener("click", showLeaderboard);
  document
    .querySelector('[data-nav="about"]')
    .addEventListener("click", showAbout);
  elements.modalCloseBtns.forEach((close) => {
    close.addEventListener("click", closeModals);
  });

  elements.leaderboardFilter.forEach((filter) => {
    filter.addEventListener("click", () => {
      elements.leaderboardFilter.forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");
      updateLeaderboardDisplay(filter.dataset.lb);
    });
  });

  elements.difficultyBtns.forEach((btn) => {
    btn.addEventListener("click", () => setDifficulty(btn.dataset.diff));
  });

  elements.modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => setMode(btn.dataset.mode));
  });

  elements.resetBtn.addEventListener("click", resetGame);
  elements.skipBtn.addEventListener("click", skipCurrentWord);

  await loadNewContent();
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
    elements.navToggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }
}

function handleNavToggle() {
  const isExpanded =
    elements.navToggle.getAttribute("aria-expanded") === "true";
  if (isExpanded) {
    elements.navToggle.setAttribute("aria-expanded", "false");
    elements.nav.classList.remove("is-open");
    return;
  }
  elements.navToggle.setAttribute("aria-expanded", "true");
  elements.nav.classList.add("is-open");
}

function showLeaderboard() {
  updateLeaderboardDisplay("medium");
  elements.leaderboardFilter.forEach((f) => f.classList.remove("active"));
  const med = document.querySelector('[data-lb="medium"]');
  if (med) med.classList.add("active");
  const modal = document.getElementById("leaderboardModal");
  if (modal) modal.classList.add("active");
}

function showAbout() {
  const modal = document.getElementById("aboutModal");
  if (modal) modal.classList.add("active");
}

async function loadNewContent() {
  // essay mode
  prepareContent();
  if (currentMode === "essay") {
    currentEssay = await fetchEssayParagraph();
    renderEssay();
  } else {
    // word mode
    currentWordList = await fetchRandomWords(wordsCount, currentDifficulty);
    currentWordIndex = 0;
    displayNextWord();
    updateWordPool();
  }
  enableInput();
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

function handleKeyDown(e) {
  if (!gameActive) return;

  if (currentMode === "word" && e.key === "Enter") {
    e.preventDefault();
    checkWord();
  }
}

function updateEssayState() {
  const typed = elements.userInput.value;
  essayProgress = typed.length;
  renderEssay();

  const target = currentEssay;

  // Calculate score based on correctly typed characters
  let correctChars = 0;
  const maxLength = Math.min(typed.length, target.length);
  for (let i = 0; i < maxLength; i++) {
    if (typed[i] === target[i]) {
      correctChars++;
    }
  }

  // Score is the number of correctly typed characters at their correct positions
  gameState.score = correctChars;

  // Count mistakes for health penalty
  let mistakes = 0;
  for (let i = 0; i < maxLength; i++) {
    if (typed[i] !== target[i]) {
      mistakes++;
    }
  }

  const progressRatio = currentEssay.length
    ? typed.length / currentEssay.length
    : 0;

  if (!startTime && typed.length > 0) {
    startTime = Date.now();
  }

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

  if (gameState.health <= 0) {
    endGame();
  }
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
  disableInput();
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
}

async function resetGame() {
  disableInput();
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
    // enableInput();
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

  if (!currentWordList[currentWordIndex]) return;
  const word = currentWordList[currentWordIndex];
  const percentage = (elements.userInput.value.length / word.length) * 100;
  elements.progressBar.style.width = Math.min(percentage, 100) + "%";
}

function setDifficulty(difficulty) {
  currentDifficulty = difficulty;
  elements.difficultyBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.diff === difficulty);
  });
  resetGame();
}

function setMode(mode) {
  currentMode = mode;
  elements.modeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  if (modeHint) {
    modeHint.textContent =
      mode === "essay"
        ? "Type the full paragraph exactly as shown."
        : "Type each word and press Enter.";
  }

  if (inputHint) {
    inputHint.textContent =
      mode === "essay"
        ? "essay mode highlights mistakes live."
        : "Type each word and press Enter.";
  }
  resetGame();
}

function displayNextWord() {
  if (!currentWordList[currentWordIndex]) {
    loadNewContent();
    return;
  }

  elements.currentWordDisplay.textContent =
    currentWordList[currentWordIndex].toLowerCase();
  elements.userInput.value = "";
  updateProgressBar();
}

function updateWordPool() {
  if (!elements.wordPool) return;
  if (currentMode === "essay") {
    elements.wordPool.innerHTML =
      '<div class="pool-word essay-tag">essay mode</div><div class="pool-word next">paragraph</div>';
    return;
  }

  elements.wordPool.innerHTML = "";
  for (
    let i = currentWordIndex;
    i < Math.min(currentWordIndex + 5, currentWordList.length);
    i++
  ) {
    const el = document.createElement("div");
    el.className = "pool-word" + (i === currentWordIndex ? " next" : "");
    el.textContent = currentWordList[i];
    elements.wordPool.appendChild(el);
  }
}

function checkWord() {
  const currentWord = currentWordList[currentWordIndex];
  const userWord = userInput.value.trim().toLowerCase();
  const isCorrect = userWord === currentWord.toLowerCase();

  if (!startTime) startTime = Date.now();

  if (isCorrect) {
    elements.userInput.classList.add("correct");
    wordsTyped++;
    gameState.score += getScoreIncrease(currentDifficulty);
    gameState.health = Math.min(
      100,
      gameState.health + getHealthChange(currentDifficulty, true),
    );
  } else {
    userInput.classList.add("wrong");
    gameState.health = Math.max(
      0,
      gameState.health + getHealthChange(currentDifficulty, false),
    );
  }

  updateStatsDisplay(
    gameState.score,
    gameState.health,
    calculateWPM(startTime, wordsTyped),
    elements.scoreEl,
    elements.healthEl,
    elements.wpmEl,
  );

  if (gameState.health <= 0 || currentWordIndex == wordsCount - 1) {
    endGame();
    return;
  }

  currentWordIndex++;
  displayNextWord();
  updateWordPool();

  setTimeout(() => {
    elements.userInput.classList.remove("correct", "wrong");
  }, 200);
}

function getScoreIncrease(difficulty) {
  return { easy: 10, hard: 30 }[difficulty] || 20;
}

function getHealthChange(difficulty, correct) {
  if (correct) {
    return { easy: 2, hard: 0 }[difficulty] || 1;
  }
  return difficulty === "hard" ? -15 : -5;
}

function skipCurrentWord() {
  if (!gameActive) return;
  if (currentMode === "essay") {
    userInput.value = "";
    updateEssayState();
    return;
  }

  gameState.health = Math.max(0, gameState.health - 5);
  if (gameState.health <= 0) {
    endGame();
    return;
  }
  currentWordIndex++;
  displayNextWord();
  updateWordPool();
  updateStatsDisplay(
    gameState.score,
    gameState.health,
    calculateWPM(startTime, wordsTyped),
    elements.scoreEl,
    elements.healthEl,
    elements.wpmEl,
  );
}

function prepareContent() {
  userInput.classList.remove("wrong");
  userInput.classList.remove("correct");
  if (currentMode === "essay") {
    elements.wordPool.classList.remove("show");

    elements.progressBarContainer.classList.add("essay");
    elements.essayDisplay.classList.add("show");
    if (elements.essayDisplay) {
      elements.essayDisplay.innerHTML =
        '<span class="essay-char pending">Loading essay...</span>';
    }
    essayProgress = 0;
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
  }
}

function disableInput() {
  console.log("input disabled");
  elements.userInput.disabled = true;
}

function enableInput() {
  elements.userInput.disabled = false;
  if (gameActive) elements.userInput.focus();
  console.log("input enabled");
}
// Start the app
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
