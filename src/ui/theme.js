import { THEME_KEY } from '../modules/constants';

export function loadTheme() {
    return localStorage.getItem(THEME_KEY) || getSystemTheme();
}

export function getSystemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme, themeToggle, themeContext) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
    if (themeToggle) {
        themeToggle.setAttribute("aria-label", `Activate ${theme === "dark" ? "light" : "dark"} mode`);
        themeContext.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    }
}

export function handleThemeToggle() {
  const currentTheme = loadTheme();
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme, document.getElementById("themeToggle"), document.getElementById("themeContext"));
}
