import { WORD_API_URL, ESSAY_API_URL } from "../modules/constants";
import { BASE_WORDS, EASY_WORD, MEDIUM_WORD, HARD_WORD } from "../modules/words";
import { FALLBACK_ESSAYS } from "../modules/essays";

export async function fetchRandomWords(count = 15, level = "medium") {
  try {
    let wordLength = getLevelWordLength(level);
    const response = await fetch(
      `${WORD_API_URL}&words=${count}&length=${wordLength}`,
    );
    if (!response.ok) throw new Error("API request failed");
    const words = await response.json();
    const wordsArray = words.map((item) => item.word);
    return wordsArray;
  } catch (error) {
    console.warn("Using fallback words:", error);
    let wordLength = getLevelWordLength(level);
    return getRandomFallbackWords(wordLength, count);
  }
}

function getLevelWordLength(level) {
  switch (level) {
    case "easy":
      return 5;
    case "hard":
      return 11;
    default:
      return 8;
  }
}

function getRandomFallbackWords(wordLength, count) {
  let shuffled = [...BASE_WORDS];
  if(wordLength == 5) {
    shuffled = [...EASY_WORD];
  } else if(wordLength == 8) {
    shuffled = [...MEDIUM_WORD];
  } else if(wordLength == 11){
    shuffled = [...HARD_WORD];
  }

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
    if (!response.ok) throw new Error("Essay API request failed");

    const paragraph = await response.text();
    const normalized = normalizeParagraph(paragraph);

    if (!normalized) throw new Error("Empty essay response");
    return normalized;
  } catch (error) {
    console.warn("Using fallback essay paragraph:", error);
    return FALLBACK_ESSAYS[Math.floor(Math.random() * FALLBACK_ESSAYS.length)];
  }
}

function normalizeParagraph(text) {
  return text.replace(/\s+/g, " ").trim();
}
