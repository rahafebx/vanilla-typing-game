import { gameState, runtime, resetGameState, resetRuntime, clearSurvival } from "./state";
import { elements } from "../ui/dom";
import {
  updateStatsDisplay, updateComboDisplay, prepareContent,
  renderEssay, displayNextWord, updateWordPool, updateProgressBar,
  updateLeaderboardDisplay, disableInput, enableInput
} from "../ui/renderer";
import { showGameModal, showLeaderboard, showAbout, closeModals } from "../ui/modals";
import { loadTheme, applyTheme, handleThemeToggle } from "../ui/theme";
import { fetchEssayParagraph, fetchRandomWords } from "../services/api";
import { saveScore } from "../services/storage";
import { calculateWPM } from "../utils/helpers";

//
// Scoring helpers
//
function getScoreIncrease(difficulty) {
  return { easy: 10, hard: 30 }[difficulty] || 20;
}

function getHealthChange(difficulty, correct) {
  if (correct) {
    if (gameState.mode === "survival") {
      return { easy: 3, hard: 1 }[difficulty] || 2;
    }
    return { easy: 2, hard: 0 }[difficulty] || 1;
  }
  if (gameState.mode === "survival") {
    return difficulty === "hard" ? -20 : -8;
  }
  return difficulty === "hard" ? -15 : -5;
}

function getEssayPenalty() {
  switch (gameState.difficulty) {
    case "easy": return 1;
    case "hard": return 3;
    default: return 2;
  }
}

function getEssaySkipPenalty() {
  switch (gameState.difficulty) {
    case "easy": return 15;
    case "hard": return 35;
    default: return 25;
  }
}

//
// Survival mode
//
function startSurvivalMode() {
  if (runtime.survivalDecayInterval) {
    clearInterval(runtime.survivalDecayInterval);
    runtime.survivalDecayInterval = null;
  }

  runtime.survivalModeActive = true;
  runtime.survivalLastTypedTime = Date.now();
  runtime.survivalCombo = 0;

  runtime.survivalDecayInterval = setInterval(() => {
    if (!gameState.gameActive || !runtime.survivalModeActive || gameState.mode !== "survival") {
      if (gameState.mode !== "survival") {
        stopSurvivalMode();
      }
      return;
    }

    let decayRate = runtime.survivalBaseDecay;
    switch (gameState.difficulty) {
      case "easy": decayRate = runtime.survivalBaseDecay * 0.8; break;
      case "hard": decayRate = runtime.survivalBaseDecay * 1.5; break;
      default: decayRate = runtime.survivalBaseDecay;
    }

    if (runtime.survivalCombo > 0 && Date.now() - runtime.survivalLastTypedTime > 2000) {
      runtime.survivalCombo = Math.max(0, runtime.survivalCombo - 1);
      updateComboDisplay();
    }

    gameState.health = Math.max(0, gameState.health - decayRate);
    updateStatsDisplay(gameState.score, gameState.health, calculateWPM(runtime.startTime, runtime.wordsTyped));

    if (gameState.health < 30) {
      elements.healthEl?.classList.add("low-health");
      document.body.classList.add("health-warning");
    } else {
      elements.healthEl?.classList.remove("low-health");
      document.body.classList.remove("health-warning");
    }

    if (gameState.health <= 0) {
      endGame();
    }
  }, 1000);

  elements.currentWordDisplay?.classList.add("survival-mode");
}

function stopSurvivalMode() {
  runtime.survivalModeActive = false;

  if (runtime.survivalDecayInterval) {
    clearInterval(runtime.survivalDecayInterval);
    runtime.survivalDecayInterval = null;
  }

  if (runtime.survivalComboTimer) {
    clearTimeout(runtime.survivalComboTimer);
    runtime.survivalComboTimer = null;
  }

  runtime.survivalCombo = 0;

  elements.healthEl?.classList.remove("low-health");
  document.body.classList.remove("health-warning");
  elements.currentWordDisplay?.classList.remove("survival-mode");

  const comboElement = document.getElementById("comboDisplay");
  if (comboElement) {
    comboElement.parentElement?.remove();
  }
}

//
// Game flow: load, reset, end
//
async function loadNewContent() {
  if (runtime.survivalModeActive || runtime.survivalDecayInterval) {
    stopSurvivalMode();
  }

  prepareContent();

  if (gameState.mode === "essay") {
    runtime.currentEssay = await fetchEssayParagraph();
    renderEssay();
  } else if (gameState.mode === "survival") {
    runtime.currentWordList = await fetchRandomWords(runtime.wordsCount, gameState.difficulty);
    runtime.currentWordIndex = 0;
    displayNextWord();
    updateWordPool();
    startSurvivalMode();
  } else {
    runtime.currentWordList = await fetchRandomWords(runtime.wordsCount, gameState.difficulty);
    runtime.currentWordIndex = 0;
    displayNextWord();
    updateWordPool();
  }
  enableInput();
}

async function loadNewEssay() {
  try {
    runtime.currentEssay = await fetchEssayParagraph();
    renderEssay();
    runtime.essayProgress = 0;
    if (elements.userInput) {
      elements.userInput.value = "";
    }
    if (elements.progressBar) {
      elements.progressBar.style.width = "0%";
    }
  } catch (error) {
    console.error("Failed to load new essay:", error);
  }
}

async function loadMoreWords() {
  const newWords = await fetchRandomWords(15, gameState.difficulty);
  runtime.currentWordList.push(...newWords);
  displayNextWord();
  updateWordPool();
}

function resetGameLogic() {
  gameState.gameActive = true;
  runtime.startTime = null;
  runtime.wordsTyped = 0;
  runtime.survivalCombo = 0;
  resetGameState();
  updateStatsDisplay(0, 100, 0);
  updateComboDisplay();
}

async function resetGame() {
  if (runtime.survivalModeActive || runtime.survivalDecayInterval) {
    stopSurvivalMode();
  }

  disableInput();
  gameState.gameActive = true;
  resetGameState();
  gameState.difficulty = gameState.difficulty;
  gameState.mode = gameState.mode;
  runtime.startTime = null;
  runtime.survivalCombo = 0;
  runtime.currentEssay = "";
  runtime.essayProgress = 0;
  runtime.currentWordIndex = 0;
  runtime.wordsTyped = 0;

  updateStatsDisplay(gameState.score, gameState.health, 0);

  if (gameState.mode === "survival") {
    updateComboDisplay();
  } else {
    const comboElement = document.getElementById("comboDisplay");
    if (comboElement) {
      comboElement.parentElement?.remove();
    }
  }

  if (elements.userInput) {
    elements.userInput.value = "";
    elements.userInput.disabled = false;
  }

  if (elements.essayDisplay) {
    elements.essayDisplay.innerHTML = "";
  }

  if (elements.progressBar) {
    elements.progressBar.style.width = "0%";
  }

  await loadNewContent();
  closeModals();
}

function endGame() {
  gameState.gameActive = false;

  if (gameState.mode === "survival" || runtime.survivalModeActive) {
    stopSurvivalMode();
  }

  const finalWPM = calculateWPM(runtime.startTime, Math.max(1, runtime.wordsTyped));
  showGameModal("GAME OVER", gameState.score, finalWPM);
}

function finishEssay() {
  gameState.gameActive = false;
  const finalWPM = calculateWPM(runtime.startTime, Math.max(1, runtime.wordsTyped));
  const title = gameState.mode === "survival" ? "SURVIVAL MODE COMPLETE!" : "Essay completed";
  showGameModal(title, gameState.score, finalWPM);
  disableInput();
}

function saveGameScore() {
  const playerName = elements.playerNameInput?.value.trim() || "Anonymous";
  saveScore(playerName, gameState.score, gameState.difficulty);
  closeModals();
  resetGame();
}

//
// Game interaction: typing, word checking, skipping
//
function handleTyping() {
  if (!gameState.gameActive) return;

  if (gameState.mode === "survival" && runtime.survivalModeActive) {
    runtime.survivalLastTypedTime = Date.now();
  }

  if (!runtime.startTime && elements.userInput.value.length > 0) {
    runtime.startTime = Date.now();
  }

  if (gameState.mode === "essay") {
    updateEssayState();
    return;
  }
  updateProgressBar();
}

function handleKeyDown(e) {
  if (!gameState.gameActive) return;

  if (
    (gameState.mode === "word" || gameState.mode === "survival") &&
    e.key === "Enter"
  ) {
    e.preventDefault();
    checkWord();
  }
}

function updateEssayState() {
  const typed = elements.userInput.value;
  runtime.essayProgress = typed.length;
  renderEssay();

  const target = runtime.currentEssay;

  let correctChars = 0;
  const maxLength = Math.min(typed.length, target.length);
  for (let i = 0; i < maxLength; i++) {
    if (typed[i] === target[i]) {
      correctChars++;
    }
  }

  gameState.score = correctChars;

  let mistakes = 0;
  for (let i = 0; i < maxLength; i++) {
    if (typed[i] !== target[i]) {
      mistakes++;
    }
  }

  if (!runtime.startTime && typed.length > 0) {
    runtime.startTime = Date.now();
  }

  gameState.health = Math.max(0, 100 - mistakes * getEssayPenalty());
  gameState.wpm = calculateWPM(
    runtime.startTime,
    Math.max(1, Math.floor(typed.length / 5)),
  );

  updateStatsDisplay(gameState.score, gameState.health, gameState.wpm);

  if (typed.length === runtime.currentEssay.length) {
    runtime.wordsTyped = Math.max(1, Math.floor(typed.length / 5));
    finishEssay();
  }

  if (gameState.health <= 0) {
    endGame();
  }
}

function checkWord() {
  const currentWord = runtime.currentWordList[runtime.currentWordIndex];
  const userWord = elements.userInput.value.trim().toLowerCase();
  const isCorrect = userWord === currentWord.toLowerCase();

  if (!runtime.startTime) runtime.startTime = Date.now();

  if (isCorrect) {
    elements.userInput.classList.add("correct");
    runtime.wordsTyped++;

    let scoreIncrease = getScoreIncrease(gameState.difficulty);
    let healthIncrease = getHealthChange(gameState.difficulty, true);

    if (gameState.mode === "survival") {
      runtime.survivalCombo = Math.min(20, runtime.survivalCombo + 1);
      runtime.survivalLastTypedTime = Date.now();

      const comboBonus = Math.floor(runtime.survivalCombo / 3);
      scoreIncrease += comboBonus;
      healthIncrease += Math.floor(comboBonus / 2);

      updateComboDisplay();
      const comboElement = document.getElementById("comboDisplay");
      if (comboElement) {
        comboElement.classList.add("combo-pop");
        setTimeout(() => comboElement.classList.remove("combo-pop"), 200);
      }
    }

    gameState.score += scoreIncrease;
    gameState.health = Math.min(100, gameState.health + healthIncrease);
  } else {
    elements.userInput.classList.add("wrong");
    gameState.health = Math.max(
      0,
      gameState.health + getHealthChange(gameState.difficulty, false),
    );

    if (gameState.mode === "survival") {
      runtime.survivalCombo = Math.max(0, runtime.survivalCombo - 3);
      updateComboDisplay();
    }
  }

  updateStatsDisplay(
    gameState.score,
    Math.round(gameState.health),
    calculateWPM(runtime.startTime, runtime.wordsTyped),
  );

  if (gameState.health <= 0) {
    endGame();
    return;
  }

  runtime.currentWordIndex++;

  if (
    gameState.mode === "survival" &&
    runtime.currentWordIndex >= runtime.currentWordList.length - 5
  ) {
    loadMoreWords();
  } else if (runtime.currentWordIndex >= runtime.currentWordList.length) {
    if (gameState.mode === "survival") {
      loadMoreWords();
    } else {
      endGame();
      return;
    }
  } else {
    displayNextWord();
  }

  updateWordPool();

  setTimeout(() => {
    elements.userInput.classList.remove("correct", "wrong");
  }, 200);
}

function skipCurrentTask() {
  if (!gameState.gameActive) return;

  if (gameState.mode === "essay") {
    const penalty = getEssaySkipPenalty();
    gameState.health = Math.max(0, gameState.health - penalty);
    loadNewEssay();

    elements.userInput.value = "";
    runtime.essayProgress = 0;

    updateStatsDisplay(
      gameState.score,
      gameState.health,
      calculateWPM(runtime.startTime, Math.max(1, Math.floor(elements.userInput.value.length / 5))),
    );

    if (gameState.health <= 0) {
      endGame();
    }
    return;
  }

  gameState.health = Math.max(0, gameState.health - 5);

  if (gameState.mode === "survival") {
    runtime.survivalCombo = Math.max(0, runtime.survivalCombo - 2);
    updateComboDisplay();
  }

  if (gameState.health <= 0) {
    endGame();
    return;
  }

  runtime.currentWordIndex++;
  displayNextWord();
  updateWordPool();
  updateStatsDisplay(
    gameState.score,
    gameState.health,
    calculateWPM(runtime.startTime, runtime.wordsTyped),
  );
}

function setDifficulty(difficulty) {
  gameState.difficulty = difficulty;
  elements.difficultyBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.diff === difficulty);
  });
  resetGame();
}

function setMode(mode) {
  if (gameState.mode === "survival" && runtime.survivalModeActive) {
    stopSurvivalMode();
  }

  gameState.mode = mode;
  elements.modeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  if (elements.modeHint) {
    if (mode === "essay") {
      elements.modeHint.textContent = "Type the full paragraph exactly as shown.";
    } else if (mode === "survival") {
      elements.modeHint.textContent =
        "SURVIVAL MODE: Health decays over time! Type quickly to stay alive. Each correct word gives bonus health and increases your combo!";
    } else {
      elements.modeHint.textContent = "Type each word and press Enter.";
    }
  }

  if (elements.inputHint) {
    if (mode === "essay") {
      elements.inputHint.textContent = "essay mode highlights mistakes live.";
    } else if (mode === "survival") {
      elements.inputHint.textContent =
        "Type words FAST! Health decays every second. Combos give bonus points and health!";
    } else {
      elements.inputHint.textContent = "Type each word and press Enter.";
    }
  }

  const comboElement = document.getElementById("comboDisplay");
  if (comboElement && mode !== "survival") {
    comboElement.parentElement?.remove();
  }

  resetGame();
}

//
// Event handlers
//
function handleDocumentClick(event) {
  if (!event.target.closest(".navbar")) {
    elements.navToggle.setAttribute("aria-expanded", "false");
    elements.nav.classList.remove("is-open");
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

//
// Initialization
//
export async function init() {
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
  elements.skipBtn.addEventListener("click", skipCurrentTask);

  elements.commandTrigger.addEventListener("click", () =>
    elements.userInput.focus(),
  );

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      elements.userInput.focus();
    }
  });

  await loadNewContent();
  resetGameLogic();
}
