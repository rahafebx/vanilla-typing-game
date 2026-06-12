// Core game logic
import { gameState } from './states';

export function calculateWPM(startTime, wordsTyped) {
    if (!startTime || wordsTyped === 0) return 0;
    const elapsedMs = Date.now() - startTime;
    
    // Don't calculate WPM for first 3 seconds - too unstable
    if (elapsedMs < 3000) return 0;
    
    const minutes = elapsedMs / 60000;
    return Math.round((wordsTyped / minutes) / 5);
}