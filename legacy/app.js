const tiles = Array.from(document.querySelectorAll('.tile'));
const titleEl = document.getElementById('lessonTitle');
const promptEl = document.getElementById('lessonPrompt');
const displayEl = document.getElementById('lessonDisplay');
const hintEl = document.getElementById('lessonHint');
const starsEl = document.getElementById('starsValue');
const levelEl = document.getElementById('levelValue');
const accuracyEl = document.getElementById('accuracyValue');
const narrationEl = document.getElementById('narrationValue');
const moduleSelectEl = document.getElementById('moduleSelect');
const openFromDropdownEl = document.getElementById('openFromDropdown');

let focusedIndex = 0;
let mode = 'menu';
let alphabetIndex = 0;
let numberValue = 1;
let nextState = null;
let findState = null;
let speechEnabled = true;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const storageKey = 'uniLearnProgressV1';
const moduleOrder = ['alphabet', 'numbers', 'next', 'find'];

const progress = {
  stars: 0,
  level: 1,
  correctAnswers: 0,
  totalAnswers: 0,
  alphabetSeen: {},
  numbersSeen: {},
  narrationEnabled: true,
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);

    progress.stars = Number(parsed.stars) || 0;
    progress.correctAnswers = Number(parsed.correctAnswers) || 0;
    progress.totalAnswers = Number(parsed.totalAnswers) || 0;
    progress.alphabetSeen = parsed.alphabetSeen || {};
    progress.numbersSeen = parsed.numbersSeen || {};
    progress.narrationEnabled = parsed.narrationEnabled !== false;
    progress.level = 1 + Math.floor(progress.stars / 10);
    speechEnabled = progress.narrationEnabled;
  } catch (error) {
    console.warn('Could not read local progress:', error);
  }
}

function saveProgress() {
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        stars: progress.stars,
        level: progress.level,
        correctAnswers: progress.correctAnswers,
        totalAnswers: progress.totalAnswers,
        alphabetSeen: progress.alphabetSeen,
        numbersSeen: progress.numbersSeen,
        narrationEnabled: speechEnabled,
      })
    );
  } catch (error) {
    console.warn('Could not save local progress:', error);
  }
}

function updateStatusPanel() {
  const accuracy = progress.totalAnswers
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
    : 0;

  starsEl.textContent = String(progress.stars);
  levelEl.textContent = String(progress.level);
  accuracyEl.textContent = `${accuracy}%`;
  narrationEl.textContent = speechEnabled ? 'On' : 'Off';
}

function addStars(amount) {
  if (amount <= 0) return;

  progress.stars += amount;
  progress.level = 1 + Math.floor(progress.stars / 10);
  saveProgress();
  updateStatusPanel();
}

function markAnswer(isCorrect) {
  progress.totalAnswers += 1;
  if (isCorrect) progress.correctAnswers += 1;
  saveProgress();
  updateStatusPanel();
}

function speakText(text) {
  if (!speechEnabled) return;
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  utterance.pitch = 1.03;
  window.speechSynthesis.speak(utterance);
}

function toggleNarration() {
  speechEnabled = !speechEnabled;
  if (!speechEnabled && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  updateStatusPanel();
  saveProgress();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function setFocus(index) {
  focusedIndex = clamp(index, 0, tiles.length - 1);
  tiles.forEach((tile, i) => {
    tile.classList.toggle('is-focused', i === focusedIndex);
  });

  if (moduleSelectEl) {
    moduleSelectEl.selectedIndex = focusedIndex;
  }
}

function focusFromModuleValue(value) {
  const index = moduleOrder.indexOf(value);
  if (index >= 0) {
    setFocus(index);
  }
}

function showMenuMessage() {
  titleEl.textContent = 'Welcome';
  promptEl.textContent = 'Use your remote arrows and OK to begin.';
  displayEl.textContent = 'READY';
  hintEl.textContent = 'Tip: Left/Right to switch tiles, OK to open. Press M for narration.';
}

function renderAlphabet() {
  const letter = letters[alphabetIndex];
  titleEl.textContent = 'Alphabet A-Z';
  promptEl.textContent = `Letter ${alphabetIndex + 1} of 26`;
  displayEl.textContent = letter;
  hintEl.textContent = 'Left/Right: previous/next letter. Backspace: menu.';

  if (!progress.alphabetSeen[letter]) {
    progress.alphabetSeen[letter] = true;
    addStars(1);
    saveProgress();
  }

  speakText(`Letter ${letter}`);
}

function renderNumbers() {
  titleEl.textContent = 'Numbers 1-100';
  promptEl.textContent = `Number ${numberValue} of 100`;
  displayEl.textContent = String(numberValue);
  hintEl.textContent = 'Left/Right: minus/plus one. Backspace: menu.';

  if (!progress.numbersSeen[numberValue]) {
    progress.numbersSeen[numberValue] = true;
    addStars(1);
    saveProgress();
  }

  speakText(`Number ${numberValue}`);
}

function buildSequenceQuestion() {
  const patterns = [
    {
      question: '2, 4, 6, ?',
      options: ['7', '8', '10'],
      answer: 1,
    },
    {
      question: 'A, C, E, ?',
      options: ['F', 'G', 'H'],
      answer: 1,
    },
    {
      question: '1, 3, 5, ?',
      options: ['6', '7', '9'],
      answer: 1,
    },
    {
      question: '10, 9, 8, ?',
      options: ['7', '6', '5'],
      answer: 0,
    },
  ];

  return patterns[Math.floor(Math.random() * patterns.length)];
}

function renderNextQuestion() {
  if (!nextState) {
    nextState = {
      ...buildSequenceQuestion(),
      selected: 0,
      result: '',
    };
  }

  const marker = nextState.options
    .map((option, i) => `${i === nextState.selected ? '[' : ''}${option}${i === nextState.selected ? ']' : ''}`)
    .join('   ');

  titleEl.textContent = "What's Next?";
  promptEl.textContent = nextState.question;
  displayEl.textContent = marker;
  hintEl.textContent =
    nextState.result || 'Left/Right: move choice. OK: submit. Backspace: menu.';

  if (nextState.result) {
    speakText(nextState.result);
  } else {
    speakText(`What's next? ${nextState.question}`);
  }
}

function applyNextAnswer() {
  if (!nextState) return;
  const isCorrect = nextState.selected === nextState.answer;

  if (isCorrect) {
    nextState.result = 'Great job! Press OK for new puzzle.';
    addStars(2);
  } else {
    nextState.result = 'Nice try! Press OK to try a new puzzle.';
  }

  markAnswer(isCorrect);
}

function buildFindQuestion() {
  const target = letters[Math.floor(Math.random() * letters.length)];
  const options = [target];

  while (options.length < 3) {
    const pick = letters[Math.floor(Math.random() * letters.length)];
    if (!options.includes(pick)) options.push(pick);
  }

  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    target,
    options,
    selected: 0,
    result: '',
    answer: options.indexOf(target),
  };
}

function renderFindQuestion() {
  if (!findState) {
    findState = buildFindQuestion();
  }

  const optionText = findState.options
    .map((option, i) => `${i === findState.selected ? '[' : ''}${option}${i === findState.selected ? ']' : ''}`)
    .join('   ');

  titleEl.textContent = 'Find the Letter';
  promptEl.textContent = `Find letter: ${findState.target}`;
  displayEl.textContent = optionText;
  hintEl.textContent =
    findState.result || 'Left/Right: choose. OK: confirm. Backspace: menu.';

  if (findState.result) {
    speakText(findState.result);
  } else {
    speakText(`Find the letter ${findState.target}`);
  }
}

function applyFindAnswer() {
  if (!findState) return;
  const isCorrect = findState.selected === findState.answer;

  if (isCorrect) {
    findState.result = 'Correct! Press OK for next round.';
    addStars(2);
  } else {
    findState.result = 'Almost! Press OK for next round.';
  }

  markAnswer(isCorrect);
}

function openTile(tileKey) {
  mode = tileKey;
  focusFromModuleValue(tileKey);

  if (mode === 'alphabet') {
    renderAlphabet();
  } else if (mode === 'numbers') {
    renderNumbers();
  } else if (mode === 'next') {
    nextState = null;
    renderNextQuestion();
  } else if (mode === 'find') {
    findState = null;
    renderFindQuestion();
  }
}

function toMenu() {
  mode = 'menu';
  showMenuMessage();
}

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (key.toLowerCase() === 'm') {
    toggleNarration();
    return;
  }

  if (mode === 'menu') {
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      setFocus(focusedIndex + 1);
      return;
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      setFocus(focusedIndex - 1);
      return;
    }

    if (key === 'Enter' || key === ' ') {
      const tile = tiles[focusedIndex];
      if (tile) openTile(tile.dataset.tile);
    }

    return;
  }

  if (key === 'Backspace' || key === 'Escape') {
    toMenu();
    return;
  }

  if (mode === 'alphabet') {
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      alphabetIndex = (alphabetIndex + 1) % letters.length;
      renderAlphabet();
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      alphabetIndex = (alphabetIndex - 1 + letters.length) % letters.length;
      renderAlphabet();
    }
    return;
  }

  if (mode === 'numbers') {
    if (key === 'ArrowRight' || key === 'ArrowUp') {
      numberValue = numberValue >= 100 ? 1 : numberValue + 1;
      renderNumbers();
    } else if (key === 'ArrowLeft' || key === 'ArrowDown') {
      numberValue = numberValue <= 1 ? 100 : numberValue - 1;
      renderNumbers();
    }
    return;
  }

  if (mode === 'next') {
    if (key === 'Enter' || key === ' ') {
      if (nextState && nextState.result) {
        nextState = null;
        renderNextQuestion();
      } else {
        applyNextAnswer();
        renderNextQuestion();
      }
      return;
    }

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      nextState.selected = (nextState.selected + 1) % nextState.options.length;
      renderNextQuestion();
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      nextState.selected =
        (nextState.selected - 1 + nextState.options.length) % nextState.options.length;
      renderNextQuestion();
    }
    return;
  }

  if (mode === 'find') {
    if (key === 'Enter' || key === ' ') {
      if (findState && findState.result) {
        findState = null;
        renderFindQuestion();
      } else {
        applyFindAnswer();
        renderFindQuestion();
      }
      return;
    }

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      findState.selected = (findState.selected + 1) % findState.options.length;
      renderFindQuestion();
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      findState.selected =
        (findState.selected - 1 + findState.options.length) % findState.options.length;
      renderFindQuestion();
    }
  }
});

tiles.forEach((tile, index) => {
  tile.addEventListener('click', () => {
    setFocus(index);
    openTile(tile.dataset.tile);
  });
});

if (moduleSelectEl) {
  moduleSelectEl.addEventListener('change', (event) => {
    focusFromModuleValue(event.target.value);
  });
}

if (openFromDropdownEl) {
  openFromDropdownEl.addEventListener('click', () => {
    if (!moduleSelectEl) return;
    openTile(moduleSelectEl.value);
  });
}

loadProgress();
updateStatusPanel();
setFocus(0);
showMenuMessage();
