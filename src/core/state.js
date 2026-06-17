export const gameState = {
  score: 0,
  wpm: 0,
  health: 100,
  currentWord: '',
  gameActive: true,
  difficulty: 'medium',
  mode: 'essay'
};

export const runtime = {
  startTime: null,
  currentEssay: '',
  essayProgress: 0,
  currentWordIndex: 0,
  wordsTyped: 0,
  wordsCount: 30,
  currentWordList: [],
  survivalDecayInterval: null,
  survivalLastTypedTime: null,
  survivalModeActive: false,
  survivalBaseDecay: 2,
  survivalCombo: 0,
  survivalComboTimer: null
};

export function resetGameState() {
  gameState.score = 0;
  gameState.wpm = 0;
  gameState.health = 100;
  gameState.currentWord = '';
  gameState.gameActive = true;
}

export function resetRuntime() {
  runtime.startTime = null;
  runtime.wordsTyped = 0;
  runtime.currentWordIndex = 0;
  runtime.currentEssay = '';
  runtime.essayProgress = 0;
  runtime.survivalCombo = 0;
  runtime.survivalModeActive = false;
  runtime.survivalLastTypedTime = null;
}

export function clearSurvival() {
  if (runtime.survivalDecayInterval) {
    clearInterval(runtime.survivalDecayInterval);
    runtime.survivalDecayInterval = null;
  }
  if (runtime.survivalComboTimer) {
    clearTimeout(runtime.survivalComboTimer);
    runtime.survivalComboTimer = null;
  }
  runtime.survivalModeActive = false;
  runtime.survivalCombo = 0;
}
