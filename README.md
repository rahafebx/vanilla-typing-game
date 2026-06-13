# TypeEBx - Modern Typing Game

<div align="center">

<svg height="100" width="100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496.8 496.8" xml:space="preserve">
    <path style="fill:transparent" d="M480 385.2c0 12.8-10.4 23.2-23.2 23.2H31.2C18.4 408.4 8 398 8 385.2V103.6c0-12.8 10.4-23.2 23.2-23.2h426.4c12.8 0 23.2 10.4 23.2 23.2v281.6z"/>
    <path style="fill:#2b7fff" d="M460.8 96.4c6.4 0 11.2 3.2 11.2 9.6v284.8c0 6.4-4.8 9.6-11.2 9.6H35.2c-6.4 0-11.2-3.2-11.2-9.6V106c0-6.4 4.8-9.6 11.2-9.6H464m-3.2-24H35.2C16 72.4 0 86.8 0 106v284.8c0 19.2 16 33.6 35.2 33.6h426.4c19.2 0 35.2-14.4 35.2-33.6V106c-.8-19.2-16.8-33.6-36-33.6"/>
    <path style="fill:#2b7fff" d="M420 354c-6.4 0-12-5.6-12-12V154c0-6.4 5.6-12 12-12s12 5.6 12 12v188c0 7.2-5.6 12-12 12"/>
    <circle style="fill:#f0f3fa" cx="184" cy="248.4" r="45.6"/>
    <circle style="fill:#f0f3fa" cx="312" cy="248.4" r="45.6"/>
</svg>

**A modern, feature-rich typing game to improve your speed and accuracy**

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Modern-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
![Parcel](https://img.shields.io/badge/Bundler-Parcel-F7DF1E?logo=parcel)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-2ea44f?logo=githubpages)](https://rahafebx.github.io/vanilla-typing-game)

</div>

![Gameplay Screenshot](https://raw.githubusercontent.com/rahafebx/vanilla-typing-game/main/game_showcase.png)
## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Game Modes](#-game-modes)
- [Difficulty Levels](#-difficulty-levels)
- [How to Play](#-how-to-play)
- [Technical Stack](#-technical-stack)
- [Installation](#-installation)
- [Game Mechanics](#-game-mechanics)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)



## 🎮 About The Project

**TypeEBx** is an immersive typing game designed to help users improve their typing speed and accuracy through engaging gameplay. Whether you're a beginner looking to learn touch typing or an expert aiming for higher WPM, TypeEBx offers multiple game modes and difficulty levels to suit your skill level.

### ✨ Core Philosophy

- **Learn through play** - Gamified typing practice that doesn't feel like practice
- **Progressive challenge** - Gradually increasing difficulty to push your limits
- **Instant feedback** - Real-time visual and statistical feedback on your performance
- **Competitive spirit** - Leaderboards to track progress and compete with others


## 🚀 Key Features

### 🎯 Gameplay Features
- **Three unique game modes** - Essay, Word, and Survival modes
- **Three difficulty levels** - Easy, Medium, and Hard with distinct mechanics
- **Real-time WPM tracking** - See your typing speed update instantly
- **Health system** - Visual health bar with penalties for mistakes
- **Combo system** - Survival mode exclusive combo multiplier for bonus points
- **Progress indicators** - Visual progress bars for words and essays
- **Word pool preview** - See upcoming words in word-based modes

### 🎨 User Experience
- **Dark/Light theme** - Fully themable interface with system preference detection
- **Responsive design** - Works seamlessly on desktop, tablet, and mobile devices
- **Keyboard shortcuts** - Quick actions with Ctrl/Cmd + K to focus input
- **Smooth animations** - Polished transitions and visual feedback
- **Accessibility features** - ARIA labels and keyboard navigation support

### 📊 Statistics & Progression
- **Local leaderboards** - Persistent score tracking per difficulty
- **Game statistics** - Track total games, highest scores, and averages
- **Real-time score calculation** - Dynamic scoring based on difficulty and accuracy
- **Performance metrics** - WPM, accuracy, and health tracking

### 💾 Data Management
- **Local storage persistence** - All scores and settings saved locally
- **Clear data option** - Reset all game progress when needed
- **No account required** - Start playing immediately



## 🎲 Game Modes

### 📝 ESSAY MODE
*"Type entire paragraphs with precision"*

- **Gameplay**: Type complete paragraphs character by character
- **Scoring**: Points awarded for correctly typed characters
- **Feedback**: Real-time highlighting of correct/wrong characters
- **Health penalty**: Mistakes deduct health based on difficulty
- **Best for**: Improving accuracy and learning proper formatting

```javascript
// Example essay from fallback API
"Bacon ipsum dolor amet spare ribs ball tip beef ribs..."
```

### 🔤 WORD MODE
*"Master the 1000 most common English words"*

- **Gameplay**: Type individual words and press Enter to submit
- **Word source**: 1,000 most common English words + API integration
- **Progression**: 30 words per game session
- **Scoring**: Points per correct word based on difficulty
- **Best for**: Building vocabulary and increasing raw typing speed

### 💀 SURVIVAL MODE
*"Endless action where health constantly depletes"*

- **Gameplay**: Endless word typing with constant health decay
- **Health decay**: Base 2 health points lost per second
- **Combo system**: Chain correct words for bonus points and health
- **Dynamic difficulty**: Decay rate and penalties scale with difficulty
- **Endless content**: Automatically loads more words as you progress
- **Best for**: High-intensity practice and stress training

| Feature | Standard | Survival Exclusive |
|---------|----------|-------------------|
| Health decay | ❌ | ✅ (2/sec base) |
| Combo system | ❌ | ✅ (up to 20x) |
| Endless mode | ❌ | ✅ |
| Bonus mechanics | ❌ | ✅ (combo bonuses) |

---

## ⚔️ Difficulty Levels

### 🌱 EASY
*"Perfect for beginners"*

| Mechanic | Value |
|----------|-------|
| Score per word | +10 |
| Health gain (correct) | +2 |
| Health loss (mistake) | -5 |
| Essay penalty factor | 1x |
| Word length | ~5 characters |
| Survival decay | 1.6/sec (80% of base) |
| Survival health gain | +3 |

### ⚡ MEDIUM
*"Balanced for intermediate players"*

| Mechanic | Value |
|----------|-------|
| Score per word | +20 |
| Health gain (correct) | +1 |
| Health loss (mistake) | -5 |
| Essay penalty factor | 2x |
| Word length | ~8 characters |
| Survival decay | 2.0/sec (100% of base) |
| Survival health gain | +2 |

### 💀 HARD
*"For experienced typists seeking a challenge"*

| Mechanic | Value |
|----------|-------|
| Score per word | +30 |
| Health gain (correct) | 0 |
| Health loss (mistake) | -15 |
| Essay penalty factor | 3x |
| Word length | ~11 characters |
| Survival decay | 3.0/sec (150% of base) |
| Survival health gain | +1 |
| Survival mistake penalty | -20 |

---

## 🎯 How to Play

### Basic Controls

1. **Select your mode** - Click on ESSAY, WORD, or SURVIVAL
2. **Choose difficulty** - Pick EASY, MEDIUM, or HARD
3. **Start typing** - Focus on the input field and type what you see
4. **Submit answers**:
   - Essay mode: Type continuously, completion auto-submits
   - Word/Survival mode: Press **Enter** after each word
5. **Monitor your stats** - Watch your Score, WPM, and Health
6. **Skip if stuck** - Use the "Skip Task" button (-5 health penalty)

### Game Rules

#### Essay Mode Rules
- Type the displayed paragraph exactly as shown
- Character-by-character matching with case sensitivity
- Mistakes are highlighted in red with underline
- Complete the entire paragraph to finish
- Health penalty based on number of mistakes

#### Word Mode Rules
- Type each word exactly as shown (case insensitive)
- Press Enter to submit and move to next word
- Complete 30 words to finish the game
- Score based on difficulty and correctness

#### Survival Mode Rules
- Health decreases automatically over time
- Type words correctly to restore health
- Build combo streaks for bonus points
- Combo resets on mistakes or after 2 seconds of inactivity
- Game ends when health reaches 0
- Endless word generation - see how long you can survive!


## 🛠️ Technical Stack

### Frontend Technologies
```json
{
  "core": ["HTML5", "CSS3", "JavaScript (ES6+)"],
  "styling": ["CSS Variables", "CSS Grid", "Flexbox", "Keyframe Animations"],
  "storage": ["LocalStorage API"],
  "apis": ["Fetch API", "RESTful APIs"]
}
```

### External APIs
- **Word Generation**: [Random Words API](https://random-words-api.kushcreates.com/)
- **Essay Generation**: [Bacon Ipsum API](https://baconipsum.com/)

### Architecture
- **Modular JavaScript** - ES6 modules for clean code organization
- **Event-driven** - Reactive UI updates based on user actions
- **State management** - Centralized game state handling
- **Responsive design** - Mobile-first CSS with breakpoints


## 💻 Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely client-side

### Quick Start

1. **Clone the repository**
- Clone the repository:
   ```bash
   git clone https://github.com/rahafebx/vanilla-todo-crud.git
    ```
- Navigate to the project directory:
    ```bash
    cd vanilla-todo-crud
    ```
- Install dependencies (if any):
    ```bash
    npm install
    ```

- Start the development server:
    ```bash
    npm start
    ```
- Open your browser and go to `http://localhost:1234` to see the app in action.

3. **Start playing** 🎮

### Browser Support
| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Opera | 75+ | ✅ Full |
| Mobile browsers | Latest | ✅ Responsive |

---

## 🎮 Game Mechanics

### Scoring System

#### Base Scoring
```javascript
Easy:   10 points per correct word
Medium: 20 points per correct word
Hard:   30 points per correct word
```

#### Survival Mode Bonuses
- **Combo bonus**: +1 point per 3 combo count
- **Health bonus**: Half of combo bonus added to health
- **Maximum combo**: 20x multiplier potential

#### Essay Mode Scoring
- Points awarded for correctly positioned characters
- No bonus for completion (skill-based scoring)

### Health System

#### Standard Health Changes
```javascript
Correct word:   +1 to +2 health (based on difficulty)
Wrong word:     -5 to -15 health (based on difficulty)
Skip task:      -5 health (all modes)
Essay mistake:  -1 to -3 per mistake (difficulty based)
```

#### Survival Health Dynamics
```javascript
Passive decay:   2 health/second (modified by difficulty)
Correct word:    +1 to +3 health (difficulty based)
Wrong word:      -8 to -20 health (difficulty based)
Combo bonus:     +0.5 health per combo level
```

### Combo System (Survival Mode Only)

| Combo Level | Bonus Effect |
|-------------|--------------|
| 1-2 | No bonus |
| 3-5 | +1 point per word |
| 6-8 | +2 points, +1 health |
| 9-11 | +3 points, +1 health |
| 12-14 | +4 points, +2 health |
| 15-17 | +5 points, +2 health |
| 18-20 | +6 points, +3 health |

**Combo Reset Conditions:**
- Making a mistake (-3 combo)
- Skipping a word (-2 combo)
- No typing for 2 seconds (-1 combo per second)


## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Focus input field |
| `Enter` | Submit word (Word/Survival mode) |
| `Escape` | (Reserved for future use) |

---


## 🗺️ Roadmap

### Upcoming Features
- [ ] Multiplayer mode (race against friends)
- [ ] Custom word lists (import your own vocabulary)
- [ ] Daily challenges and achievements
- [ ] Sound effects and typing sounds
- [ ] More essay categories (programming, literature, etc.)
- [ ] Practice mode (no health, just improvement)
- [ ] Statistics dashboard with graphs
- [ ] Export/import game data
- [ ] Cloud save synchronization
- [ ] Mobile app version (React Native)

### Planned Improvements
- [ ] Accessibility enhancements (screen reader support)
- [ ] More animations and visual feedback
- [ ] Tutorial mode for beginners
- [ ] Typing lessons and drills
- [ ] Performance optimizations
- [ ] PWA support (play offline)


## 🤝 Contributing

Contributions make the open-source community amazing! Any contributions you make are **greatly appreciated**.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

### Getting Started

1. **Fork the Project**
2. **Create your Feature Branch**
```bash
git checkout -b feature/AmazingFeature
```
3. **Commit your Changes**
```bash
git commit -m 'Add some AmazingFeature'
```
4. **Push to the Branch**
```bash
git push origin feature/AmazingFeature
```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Test your changes across different browsers
- Update documentation as needed
- Add comments for complex logic

### Reporting Issues

When reporting issues, please include:
- Browser version and OS
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Console errors (if any)


## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### APIs & Services
- [Random Words API](https://random-words-api.kushcreates.com/) - For word generation
- [Bacon Ipsum](https://baconipsum.com/) - For essay text generation

### Inspiration
- Monkeytype - For clean UI design inspiration
- TypeRacer - For competitive typing mechanics
- Keybr.com - For progressive difficulty systems

### Libraries & Tools
- [Google Fonts](https://fonts.google.com/) - Inter font family
- [Font Awesome](https://fontawesome.com/) - Icon inspiration
- [Feather Icons](https://feathericons.com/) - SVG icon designs

### Contributors
- Thanks to all open-source contributors who help improve this project


## 📞 Contact & Support

- **Project Link**: [https://github.com/yourusername/type-ebx](https://github.com/yourusername/type-ebx)
- **Report Issues**: [GitHub Issues](https://github.com/yourusername/type-ebx/issues)
- **Feature Requests**: [Discussions](https://github.com/yourusername/type-ebx/discussions)

---

<div align="center">

**Made with 
<svg width="12" height="12" viewBox="0 0 16 16" fill="red" class="heart-icon">
<path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
</svg> for typing enthusiasts**

*Type fast, stay alive!*

[Report Bug](https://github.com/rahafebx/vanilla-typing-game/issues) • 
[Request Feature](https://github.com/rahafebx/vanilla-typing-game/issues) • 
[Star on GitHub](https://github.com/rahafebx/vanilla-typing-game)

</div>