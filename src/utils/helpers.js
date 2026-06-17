export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function calculateWPM(startTime, wordsTyped) {
  if (!startTime || wordsTyped === 0) return 0;
  const elapsedMs = Date.now() - startTime;
  if (elapsedMs < 3000) return 0;
  const minutes = elapsedMs / 60000;
  return Math.round((wordsTyped / minutes) / 5);
}
