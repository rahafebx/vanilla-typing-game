import { WORD_API_URL, ESSAY_API_URL, FALLBACK_WORDS, FALLBACK_ESSAYS } from './constants';

export async function fetchRandomWords(count = 15) {
    try {
        const response = await fetch(`${WORD_API_URL}&swear=0`);
        if (!response.ok) throw new Error('API request failed');
        const words = await response.json();
        return words.slice(0, count);
    } catch (error) {
        console.warn('Using fallback words:', error);
        // Return random subset of fallback words
        return getRandomFallbackWords(count);
    }
}

function getRandomFallbackWords(count) {
    const shuffled = [...FALLBACK_WORDS];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

export function generateWordsFromList(wordList, count) {
    const shuffled = [...wordList];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

export async function fetchEssayParagraph() {
    try {
        const response = await fetch(ESSAY_API_URL);
        if (!response.ok) throw new Error('Essay API request failed');

        const paragraph = await response.text();
        const normalized = normalizeParagraph(paragraph);

        if (!normalized) throw new Error('Empty essay response');
        return normalized;
    } catch (error) {
        console.warn('Using fallback essay paragraph:', error);
        return FALLBACK_ESSAYS[Math.floor(Math.random() * FALLBACK_ESSAYS.length)];
    }
}

function normalizeParagraph(text) {
    return text.replace(/\s+/g, ' ').trim();
}