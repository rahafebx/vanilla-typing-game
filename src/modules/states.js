// Game state management
export const gameState = {
    score: 0,
    wpm: 0,
    health: 100,
    currentWord: '',
    gameActive: true,
    difficulty: 'medium',
    mode: 'english1k'
};

export function initState() {
    return {
        score: 0,
        wpm: 0,
        health: 100,
        currentWord: '',
        gameActive: true,
        difficulty: 'medium',
        mode: 'english1k'
    };
}

export function updateState(newState) {
    Object.assign(gameState, newState);
}

export function resetState() {
    gameState.score = 0;
    gameState.wpm = 0;
    gameState.health = 100;
    gameState.currentWord = '';
    gameState.gameActive = true;
}