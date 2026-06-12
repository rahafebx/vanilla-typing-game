import { loadTheme, getSystemTheme, applyTheme } from './modules/theme';

// DOM Elements
const elements = {
    themeToggle: document.getElementById("themeToggle"),
    themeContext: document.getElementById("themeContext"),
};

// Helper Functions
function handleThemeToggle() {
    const currentTheme = loadTheme();
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme, elements.themeToggle, elements.themeContext);
}

// Initialization
function init() {
    const initialTheme = loadTheme();
    applyTheme(initialTheme, elements.themeToggle, elements.themeContext);
    elements.themeToggle.addEventListener("click", handleThemeToggle);
}

// Start the app
init();