'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'uniLearnProgressV1';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const MODULE_ORDER = ['alphabet', 'numbers', 'words', 'fruits', 'animals', 'wild-animals', 'vowels', 'shapes', 'colors', 'vehicles', 'foods', 'clothes', 'finger-count', 'next', 'find'];

// Phonetic sounds — how each letter actually sounds, not its name
export const LETTER_SOUNDS = {
  A: 'ah',   B: 'buh',  C: 'kuh',  D: 'duh',  E: 'eh',
  F: 'fuh',  G: 'guh',  H: 'huh',  I: 'ih',   J: 'juh',
  K: 'kuh',  L: 'luh',  M: 'muh',  N: 'nuh',  O: 'oh',
  P: 'puh',  Q: 'kwuh', R: 'ruh',  S: 'sss',  T: 'tuh',
  U: 'uh',   V: 'vuh',  W: 'wuh',  X: 'ks',   Y: 'yuh',
  Z: 'zzz',
};

// ── Fruits ────────────────────────────────────────────────
export const FRUITS = [
  { name: 'Apple',      emoji: '🍎' },
  { name: 'Banana',     emoji: '🍌' },
  { name: 'Blackberry', emoji: '🫐' },
  { name: 'Cherry',     emoji: '🍒' },
  { name: 'Dragonfruit',emoji: '🐉', imageSrc: '/images/dragonfruit.svg' },
  { name: 'Grapefruit', emoji: '🍊' },
  { name: 'Grape',      emoji: '🍇' },
  { name: 'Guava',      emoji: '🍐' },
  { name: 'Lemon',      emoji: '🍋' },
  { name: 'Lime',       emoji: '🍋' },
  { name: 'Mango',      emoji: '🥭' },
  { name: 'Orange',     emoji: '🍊' },
  { name: 'Papaya',     emoji: '🥭' },
  { name: 'Passionfruit', emoji: '🥭' },
  { name: 'Peach',      emoji: '🍑' },
  { name: 'Pear',       emoji: '🍐' },
  { name: 'Pineapple',  emoji: '🍍' },
  { name: 'Plum',       emoji: '🍑' },
  { name: 'Pomegranate',emoji: '🍎' },
  { name: 'Raspberry',  emoji: '🍓' },
  { name: 'Strawberry', emoji: '🍓' },
  { name: 'Tangerine',  emoji: '🍊' },
  { name: 'Watermelon', emoji: '🍉' },
  { name: 'Kiwi',       emoji: '🥝' },
  { name: 'Coconut',    emoji: '🥥' },
  { name: 'Blueberry',  emoji: '🫐' },
  { name: 'Melon',      emoji: '🍈' },
  { name: 'Avocado',    emoji: '🥑' },
  { name: 'Tomato',     emoji: '🍅' },
];

// ── Domestic animals ─────────────────────────────────────
export const DOMESTIC_ANIMALS = [
  { name: 'Cat',      emoji: '🐱' },
  { name: 'Dog',      emoji: '🐶' },
  { name: 'Cow',      emoji: '🐮' },
  { name: 'Ox',       emoji: '🐂' },
  { name: 'Goat',     emoji: '🐐' },
  { name: 'Sheep',    emoji: '🐑' },
  { name: 'Pig',      emoji: '🐷' },
  { name: 'Horse',    emoji: '🐴' },
  { name: 'Mule',     emoji: '🫏' },
  { name: 'Rabbit',   emoji: '🐰' },
  { name: 'Hamster',  emoji: '🐹' },
  { name: 'Guinea Pig', emoji: '🐹' },
  { name: 'Chicken',  emoji: '🐔' },
  { name: 'Duck',     emoji: '🦆' },
  { name: 'Goose',    emoji: '🪿' },
  { name: 'Donkey',   emoji: '🫏' },
  { name: 'Camel',    emoji: '🐪' },
  { name: 'Llama',    emoji: '🦙' },
  { name: 'Turkey',   emoji: '🦃' },
  { name: 'Rooster',  emoji: '🐓' },
  { name: 'Parrot',   emoji: '🦜' },
  { name: 'Pigeon',   emoji: '🕊️' },
  { name: 'Canary',   emoji: '🐤' },
];

// ── Wild animals ─────────────────────────────────────────
export const WILD_ANIMALS = [
  { name: 'Lion',      emoji: '🦁' },
  { name: 'Tiger',     emoji: '🐯' },
  { name: 'Elephant',  emoji: '🐘' },
  { name: 'Giraffe',   emoji: '🦒' },
  { name: 'Zebra',     emoji: '🦓' },
  { name: 'Monkey',    emoji: '🐒' },
  { name: 'Bear',      emoji: '🐻' },
  { name: 'Wolf',      emoji: '🐺' },
  { name: 'Fox',       emoji: '🦊' },
  { name: 'Deer',      emoji: '🦌' },
  { name: 'Crocodile', emoji: '🐊' },
  { name: 'Alligator', emoji: '🐊' },
  { name: 'Hippo',     emoji: '🦛' },
  { name: 'Rhino',     emoji: '🦏' },
  { name: 'Kangaroo',  emoji: '🦘' },
  { name: 'Panda',     emoji: '🐼' },
  { name: 'Koala',     emoji: '🐨' },
  { name: 'Leopard',   emoji: '🐆' },
  { name: 'Cheetah',   emoji: '🐆' },
  { name: 'Gorilla',   emoji: '🦍' },
  { name: 'Orangutan', emoji: '🦧' },
  { name: 'Snake',     emoji: '🐍' },
  { name: 'Turtle',    emoji: '🐢' },
  { name: 'Scorpion',  emoji: '🦂' },
  { name: 'Owl',       emoji: '🦉' },
  { name: 'Eagle',     emoji: '🦅' },
  { name: 'Peacock',   emoji: '🦚' },
  { name: 'Flamingo',  emoji: '🦩' },
  { name: 'Parrotfish', emoji: '🐠' },
  { name: 'Shark',     emoji: '🦈' },
  { name: 'Whale',     emoji: '🐋' },
  { name: 'Dolphin',   emoji: '🐬' },
];

// ── Vowels / syllables ───────────────────────────────────
export const VOWELS = [
  // B family
  { syllable: 'ba', consonant: 'B', vowel: 'A' },
  { syllable: 'be', consonant: 'B', vowel: 'E' },
  { syllable: 'bi', consonant: 'B', vowel: 'I' },
  { syllable: 'bo', consonant: 'B', vowel: 'O' },
  { syllable: 'bu', consonant: 'B', vowel: 'U' },
  // C family
  { syllable: 'ca', consonant: 'C', vowel: 'A' },
  { syllable: 'ce', consonant: 'C', vowel: 'E' },
  { syllable: 'ci', consonant: 'C', vowel: 'I' },
  { syllable: 'co', consonant: 'C', vowel: 'O' },
  { syllable: 'cu', consonant: 'C', vowel: 'U' },
  // D family
  { syllable: 'da', consonant: 'D', vowel: 'A' },
  { syllable: 'de', consonant: 'D', vowel: 'E' },
  { syllable: 'di', consonant: 'D', vowel: 'I' },
  { syllable: 'do', consonant: 'D', vowel: 'O' },
  { syllable: 'du', consonant: 'D', vowel: 'U' },
  // F family
  { syllable: 'fa', consonant: 'F', vowel: 'A' },
  { syllable: 'fe', consonant: 'F', vowel: 'E' },
  { syllable: 'fi', consonant: 'F', vowel: 'I' },
  { syllable: 'fo', consonant: 'F', vowel: 'O' },
  { syllable: 'fu', consonant: 'F', vowel: 'U' },
  // G family
  { syllable: 'ga', consonant: 'G', vowel: 'A' },
  { syllable: 'ge', consonant: 'G', vowel: 'E' },
  { syllable: 'gi', consonant: 'G', vowel: 'I' },
  { syllable: 'go', consonant: 'G', vowel: 'O' },
  { syllable: 'gu', consonant: 'G', vowel: 'U' },
  // H family
  { syllable: 'ha', consonant: 'H', vowel: 'A' },
  { syllable: 'he', consonant: 'H', vowel: 'E' },
  { syllable: 'hi', consonant: 'H', vowel: 'I' },
  { syllable: 'ho', consonant: 'H', vowel: 'O' },
  { syllable: 'hu', consonant: 'H', vowel: 'U' },
  // J family
  { syllable: 'ja', consonant: 'J', vowel: 'A' },
  { syllable: 'je', consonant: 'J', vowel: 'E' },
  { syllable: 'ji', consonant: 'J', vowel: 'I' },
  { syllable: 'jo', consonant: 'J', vowel: 'O' },
  { syllable: 'ju', consonant: 'J', vowel: 'U' },
  // K family
  { syllable: 'ka', consonant: 'K', vowel: 'A' },
  { syllable: 'ke', consonant: 'K', vowel: 'E' },
  { syllable: 'ki', consonant: 'K', vowel: 'I' },
  { syllable: 'ko', consonant: 'K', vowel: 'O' },
  { syllable: 'ku', consonant: 'K', vowel: 'U' },
  // L family
  { syllable: 'la', consonant: 'L', vowel: 'A' },
  { syllable: 'le', consonant: 'L', vowel: 'E' },
  { syllable: 'li', consonant: 'L', vowel: 'I' },
  { syllable: 'lo', consonant: 'L', vowel: 'O' },
  { syllable: 'lu', consonant: 'L', vowel: 'U' },
  // M family
  { syllable: 'ma', consonant: 'M', vowel: 'A' },
  { syllable: 'me', consonant: 'M', vowel: 'E' },
  { syllable: 'mi', consonant: 'M', vowel: 'I' },
  { syllable: 'mo', consonant: 'M', vowel: 'O' },
  { syllable: 'mu', consonant: 'M', vowel: 'U' },
  // N family
  { syllable: 'na', consonant: 'N', vowel: 'A' },
  { syllable: 'ne', consonant: 'N', vowel: 'E' },
  { syllable: 'ni', consonant: 'N', vowel: 'I' },
  { syllable: 'no', consonant: 'N', vowel: 'O' },
  { syllable: 'nu', consonant: 'N', vowel: 'U' },
  // P family
  { syllable: 'pa', consonant: 'P', vowel: 'A' },
  { syllable: 'pe', consonant: 'P', vowel: 'E' },
  { syllable: 'pi', consonant: 'P', vowel: 'I' },
  { syllable: 'po', consonant: 'P', vowel: 'O' },
  { syllable: 'pu', consonant: 'P', vowel: 'U' },
  // R family
  { syllable: 'ra', consonant: 'R', vowel: 'A' },
  { syllable: 're', consonant: 'R', vowel: 'E' },
  { syllable: 'ri', consonant: 'R', vowel: 'I' },
  { syllable: 'ro', consonant: 'R', vowel: 'O' },
  { syllable: 'ru', consonant: 'R', vowel: 'U' },
  // S family
  { syllable: 'sa', consonant: 'S', vowel: 'A' },
  { syllable: 'se', consonant: 'S', vowel: 'E' },
  { syllable: 'si', consonant: 'S', vowel: 'I' },
  { syllable: 'so', consonant: 'S', vowel: 'O' },
  { syllable: 'su', consonant: 'S', vowel: 'U' },
  // T family
  { syllable: 'ta', consonant: 'T', vowel: 'A' },
  { syllable: 'te', consonant: 'T', vowel: 'E' },
  { syllable: 'ti', consonant: 'T', vowel: 'I' },
  { syllable: 'to', consonant: 'T', vowel: 'O' },
  { syllable: 'tu', consonant: 'T', vowel: 'U' },
  // V family
  { syllable: 'va', consonant: 'V', vowel: 'A' },
  { syllable: 've', consonant: 'V', vowel: 'E' },
  { syllable: 'vi', consonant: 'V', vowel: 'I' },
  { syllable: 'vo', consonant: 'V', vowel: 'O' },
  { syllable: 'vu', consonant: 'V', vowel: 'U' },
  // W family
  { syllable: 'wa', consonant: 'W', vowel: 'A' },
  { syllable: 'we', consonant: 'W', vowel: 'E' },
  { syllable: 'wi', consonant: 'W', vowel: 'I' },
  { syllable: 'wo', consonant: 'W', vowel: 'O' },
  { syllable: 'wu', consonant: 'W', vowel: 'U' },
  // Y family
  { syllable: 'ya', consonant: 'Y', vowel: 'A' },
  { syllable: 'ye', consonant: 'Y', vowel: 'E' },
  { syllable: 'yi', consonant: 'Y', vowel: 'I' },
  { syllable: 'yo', consonant: 'Y', vowel: 'O' },
  { syllable: 'yu', consonant: 'Y', vowel: 'U' },
  // Z family
  { syllable: 'za', consonant: 'Z', vowel: 'A' },
  { syllable: 'ze', consonant: 'Z', vowel: 'E' },
  { syllable: 'zi', consonant: 'Z', vowel: 'I' },
  { syllable: 'zo', consonant: 'Z', vowel: 'O' },
  { syllable: 'zu', consonant: 'Z', vowel: 'U' },
];

// ── Shapes ───────────────────────────────────────────────
export const SHAPES = [
  { name: 'Circle', symbol: '⚪' },
  { name: 'Square', symbol: '🟦' },
  { name: 'Triangle', symbol: '🔺' },
  { name: 'Rectangle', symbol: '▭' },
  { name: 'Diamond', symbol: '🔶' },
  { name: 'Star', symbol: '⭐' },
  { name: 'Heart', symbol: '❤️' },
  { name: 'Pentagon', symbol: '⬟' },
  { name: 'Hexagon', symbol: '⬢' },
  { name: 'Oval', symbol: '⬭' },
];

// ── Colors ───────────────────────────────────────────────
export const COLORS = [
  { name: 'Red', swatch: '#ef5350', emoji: '🔴' },
  { name: 'Blue', swatch: '#42a5f5', emoji: '🔵' },
  { name: 'Yellow', swatch: '#fdd835', emoji: '🟡' },
  { name: 'Green', swatch: '#66bb6a', emoji: '🟢' },
  { name: 'Orange', swatch: '#fb8c00', emoji: '🟠' },
  { name: 'Purple', swatch: '#ab47bc', emoji: '🟣' },
  { name: 'Pink', swatch: '#ec407a', emoji: '🩷' },
  { name: 'Brown', swatch: '#8d6e63', emoji: '🟤' },
  { name: 'Black', swatch: '#424242', emoji: '⚫' },
  { name: 'White', swatch: '#f5f5f5', emoji: '⚪' },
];

// ── Vehicles ─────────────────────────────────────────────
export const VEHICLES = [
  { name: 'Car', emoji: '🚗' },
  { name: 'Bus', emoji: '🚌' },
  { name: 'Truck', emoji: '🚚' },
  { name: 'Motorcycle', emoji: '🏍️' },
  { name: 'Bicycle', emoji: '🚲' },
  { name: 'Train', emoji: '🚆' },
  { name: 'Airplane', emoji: '✈️' },
  { name: 'Helicopter', emoji: '🚁' },
  { name: 'Boat', emoji: '⛵' },
  { name: 'Ship', emoji: '🚢' },
];

// ── Foods ───────────────────────────────────────────────
export const FOODS = [
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Burger', emoji: '🍔' },
  { name: 'Fries', emoji: '🍟' },
  { name: 'Rice', emoji: '🍚' },
  { name: 'Bread', emoji: '🍞' },
  { name: 'Egg', emoji: '🥚' },
  { name: 'Noodles', emoji: '🍜' },
  { name: 'Fish', emoji: '🐟' },
  { name: 'Chicken', emoji: '🍗' },
  { name: 'Cake', emoji: '🍰' },
];

// ── Clothes ─────────────────────────────────────────────
export const CLOTHES = [
  { name: 'Shirt', emoji: '👕' },
  { name: 'Dress', emoji: '👗' },
  { name: 'Pants', emoji: '👖' },
  { name: 'Shorts', emoji: '🩳' },
  { name: 'Skirt', emoji: '🩱' },
  { name: 'Jacket', emoji: '🧥' },
  { name: 'Socks', emoji: '🧦' },
  { name: 'Shoes', emoji: '👟' },
  { name: 'Hat', emoji: '🧢' },
  { name: 'Scarf', emoji: '🧣' },
];

// ── Finger count ────────────────────────────────────────
export const FINGER_COUNTS = [
  { count: 0, display: '✊' },
  { count: 1, display: '☝️' },
  { count: 2, display: '✌️' },
  { count: 3, display: '', imageSrc: '/images/3imoji.png' },
  { count: 4, display: '🖖' },
  { count: 5, display: '🖐️' },
  { count: 6, display: '☝️ + 🖐️' },
  { count: 7, display: '✌️ + 🖐️' },
  { count: 8, display: ' + 🖐️', imageSrc: '/images/3imoji.png' },
  { count: 9, display: '🖖 + 🖐️' },
  { count: 10, display: '🖐️ + 🖐️' },
];

// ── A for Apple word map ──────────────────────────────────
export const LETTER_WORDS = {
  A: { word: 'Apple',    emoji: '🍎' },
  B: { word: 'Boy',      emoji: '👦' },
  C: { word: 'Cat',      emoji: '🐱' },
  D: { word: 'Dog',      emoji: '🐶' },
  E: { word: 'Egg',      emoji: '🥚' },
  F: { word: 'Fish',     emoji: '🐟' },
  G: { word: 'Goat',     emoji: '🐐' },
  H: { word: 'Hat',      emoji: '🎩' },
  I: { word: 'Ice',      emoji: '🧊' },
  J: { word: 'Jar',      emoji: '🫙' },
  K: { word: 'Kite',     emoji: '🪁' },
  L: { word: 'Lion',     emoji: '🦁' },
  M: { word: 'Moon',     emoji: '🌙' },
  N: { word: 'Nest',     emoji: '🪺' },
  O: { word: 'Orange',   emoji: '🍊' },
  P: { word: 'Pig',      emoji: '🐷' },
  Q: { word: 'Queen',    emoji: '👑' },
  R: { word: 'Rain',     emoji: '🌧️' },
  S: { word: 'Sun',      emoji: '☀️' },
  T: { word: 'Tree',     emoji: '🌳' },
  U: { word: 'Umbrella', emoji: '☂️' },
  V: { word: 'Van',      emoji: '🚐' },
  W: { word: 'Water',    emoji: '💧' },
  X: { word: 'X-ray',    emoji: '🩻' },
  Y: { word: 'Yak',      emoji: '🐃' },
  Z: { word: 'Zebra',    emoji: '🦓' },
};

const SEQUENCE_PATTERNS = [
  { question: '2, 4, 6, ?', options: ['7', '8', '10'], answer: 1 },
  { question: 'A, C, E, ?', options: ['F', 'G', 'H'], answer: 1 },
  { question: '1, 3, 5, ?', options: ['6', '7', '9'], answer: 1 },
  { question: '10, 9, 8, ?', options: ['7', '6', '5'], answer: 0 },
];

function buildSequence() {
  const p = SEQUENCE_PATTERNS[Math.floor(Math.random() * SEQUENCE_PATTERNS.length)];
  return { ...p, selected: 0, result: '' };
}

function buildFind() {
  const target = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const opts = [target];
  while (opts.length < 3) {
    const pick = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    if (!opts.includes(pick)) opts.push(pick);
  }
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return { target, options: opts, selected: 0, result: '', answer: opts.indexOf(target) };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function useUniLearn() {
  const [mode, setMode] = useState('menu');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [alphabetIndex, setAlphabetIndex] = useState(0);
  const [uppercase, setUppercase] = useState(true);
  const [numberValue, setNumberValue] = useState(1);
  const [wordsIndex, setWordsIndex] = useState(0);
  const [fruitsIndex, setFruitsIndex] = useState(0);
  const [animalsIndex, setAnimalsIndex] = useState(0);
  const [wildAnimalsIndex, setWildAnimalsIndex] = useState(0);
  const [vowelsIndex, setVowelsIndex] = useState(0);
  const [shapesIndex, setShapesIndex] = useState(0);
  const [colorsIndex, setColorsIndex] = useState(0);
  const [vehiclesIndex, setVehiclesIndex] = useState(0);
  const [foodsIndex, setFoodsIndex] = useState(0);
  const [clothesIndex, setClothesIndex] = useState(0);
  const [fingerCountIndex, setFingerCountIndex] = useState(0);
  const [nextState, setNextState] = useState(null);
  const [findState, setFindState] = useState(null);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [progress, setProgress] = useState({
    stars: 0,
    level: 1,
    correctAnswers: 0,
    totalAnswers: 0,
    alphabetSeen: {},
    numbersSeen: {},
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const stars = Number(parsed.stars) || 0;
      setProgress({
        stars,
        level: 1 + Math.floor(stars / 10),
        correctAnswers: Number(parsed.correctAnswers) || 0,
        totalAnswers: Number(parsed.totalAnswers) || 0,
        alphabetSeen: parsed.alphabetSeen || {},
        numbersSeen: parsed.numbersSeen || {},
      });
      setSpeechEnabled(parsed.narrationEnabled !== false);
    } catch (e) {
      console.warn('Could not load progress', e);
    }
  }, []);

  const saveProgress = useCallback((prog, narration) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prog, narrationEnabled: narration }));
    } catch (e) {
      console.warn('Could not save progress', e);
    }
  }, []);

  const speak = useCallback(
    (text) => {
      if (!speechEnabled) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.85;
      u.pitch = 1.03;
      window.speechSynthesis.speak(u);
    },
    [speechEnabled]
  );

  const toggleNarration = useCallback(() => {
    setSpeechEnabled((prev) => {
      const next = !prev;
      if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setProgress((p) => { saveProgress(p, next); return p; });
      return next;
    });
  }, [saveProgress]);

  const updateFocusedIndex = useCallback((index) => {
    setFocusedIndex(clamp(index, 0, MODULE_ORDER.length - 1));
  }, []);

  // ── ALPHABET ─────────────────────────────────────────────
  const jumpToLetter = useCallback(
    (index) => {
      const letter = LETTERS[index];
      setAlphabetIndex(index);
      setProgress((p) => {
        if (!p.alphabetSeen[letter]) {
          const newStars = p.stars + 1;
          const updated = {
            ...p, stars: newStars, level: 1 + Math.floor(newStars / 10),
            alphabetSeen: { ...p.alphabetSeen, [letter]: true },
          };
          saveProgress(updated, speechEnabled);
          return updated;
        }
        return p;
      });
      speak(LETTER_SOUNDS[letter]);   // speak phonetic sound
    },
    [speak, saveProgress, speechEnabled, uppercase]
  );

  const moveAlphabet = useCallback(
    (dir) => {
      setAlphabetIndex((prev) => {
        const next = (prev + dir + LETTERS.length) % LETTERS.length;
        const letter = LETTERS[next];
        setProgress((p) => {
          if (!p.alphabetSeen[letter]) {
            const newStars = p.stars + 1;
            const updated = {
              ...p, stars: newStars, level: 1 + Math.floor(newStars / 10),
              alphabetSeen: { ...p.alphabetSeen, [letter]: true },
            };
            saveProgress(updated, speechEnabled);
            return updated;
          }
          return p;
        });
        speak(LETTER_SOUNDS[letter]);   // speak phonetic sound
        return next;
      });
    },
    [speak, saveProgress, speechEnabled, uppercase]
  );

  // ── WORDS (A for Apple) ───────────────────────────────────
  const jumpToWord = useCallback(
    (index) => {
      setWordsIndex(index);
      const letter = LETTERS[index];
      speak(`${letter} for ${LETTER_WORDS[letter].word}`);
    },
    [speak]
  );

  const moveWords = useCallback(
    (dir) => {
      setWordsIndex((prev) => {
        const next = (prev + dir + LETTERS.length) % LETTERS.length;
        const letter = LETTERS[next];
        speak(`${letter} for ${LETTER_WORDS[letter].word}`);
        return next;
      });
    },
    [speak]
  );

  // ── FRUITS ───────────────────────────────────────────────
  const jumpToFruit = useCallback(
    (index) => {
      setFruitsIndex(index);
      speak(FRUITS[index].name);
    },
    [speak]
  );

  const moveFruits = useCallback(
    (dir) => {
      setFruitsIndex((prev) => {
        const next = (prev + dir + FRUITS.length) % FRUITS.length;
        speak(FRUITS[next].name);
        return next;
      });
    },
    [speak]
  );

  // ── DOMESTIC ANIMALS ───────────────────────────────────
  const jumpToAnimal = useCallback(
    (index) => {
      setAnimalsIndex(index);
      speak(DOMESTIC_ANIMALS[index].name);
    },
    [speak]
  );

  const moveAnimals = useCallback(
    (dir) => {
      setAnimalsIndex((prev) => {
        const next = (prev + dir + DOMESTIC_ANIMALS.length) % DOMESTIC_ANIMALS.length;
        speak(DOMESTIC_ANIMALS[next].name);
        return next;
      });
    },
    [speak]
  );

  // ── WILD ANIMALS ───────────────────────────────────────
  const jumpToWildAnimal = useCallback(
    (index) => {
      setWildAnimalsIndex(index);
      speak(WILD_ANIMALS[index].name);
    },
    [speak]
  );

  const moveWildAnimals = useCallback(
    (dir) => {
      setWildAnimalsIndex((prev) => {
        const next = (prev + dir + WILD_ANIMALS.length) % WILD_ANIMALS.length;
        speak(WILD_ANIMALS[next].name);
        return next;
      });
    },
    [speak]
  );

  // ── VOWELS / SYLLABLES ──────────────────────────────────
  const jumpToVowel = useCallback(
    (index) => {
      setVowelsIndex(index);
      speak(VOWELS[index].syllable);
    },
    [speak]
  );

  const moveVowels = useCallback(
    (dir) => {
      setVowelsIndex((prev) => {
        const next = (prev + dir + VOWELS.length) % VOWELS.length;
        speak(VOWELS[next].syllable);
        return next;
      });
    },
    [speak]
  );

  // ── SHAPES ─────────────────────────────────────────────
  const jumpToShape = useCallback(
    (index) => {
      setShapesIndex(index);
      speak(SHAPES[index].name);
    },
    [speak]
  );

  const moveShapes = useCallback(
    (dir) => {
      setShapesIndex((prev) => {
        const next = (prev + dir + SHAPES.length) % SHAPES.length;
        speak(SHAPES[next].name);
        return next;
      });
    },
    [speak]
  );

  // ── COLORS ─────────────────────────────────────────────
  const jumpToColor = useCallback(
    (index) => {
      setColorsIndex(index);
      speak(COLORS[index].name);
    },
    [speak]
  );

  const moveColors = useCallback(
    (dir) => {
      setColorsIndex((prev) => {
        const next = (prev + dir + COLORS.length) % COLORS.length;
        speak(COLORS[next].name);
        return next;
      });
    },
    [speak]
  );

  // ── VEHICLES ───────────────────────────────────────────
  const jumpToVehicle = useCallback(
    (index) => {
      setVehiclesIndex(index);
      speak(VEHICLES[index].name);
    },
    [speak]
  );

  const moveVehicles = useCallback(
    (dir) => {
      setVehiclesIndex((prev) => {
        const next = (prev + dir + VEHICLES.length) % VEHICLES.length;
        speak(VEHICLES[next].name);
        return next;
      });
    },
    [speak]
  );

  // ── FOODS ──────────────────────────────────────────────
  const jumpToFood = useCallback(
    (index) => {
      setFoodsIndex(index);
      speak(FOODS[index].name);
    },
    [speak]
  );

  const moveFoods = useCallback(
    (dir) => {
      setFoodsIndex((prev) => {
        const next = (prev + dir + FOODS.length) % FOODS.length;
        speak(FOODS[next].name);
        return next;
      });
    },
    [speak]
  );

  // ── CLOTHES ────────────────────────────────────────────
  const jumpToCloth = useCallback(
    (index) => {
      setClothesIndex(index);
      speak(CLOTHES[index].name);
    },
    [speak]
  );

  const moveClothes = useCallback(
    (dir) => {
      setClothesIndex((prev) => {
        const next = (prev + dir + CLOTHES.length) % CLOTHES.length;
        speak(CLOTHES[next].name);
        return next;
      });
    },
    [speak]
  );

  // ── FINGER COUNT ─────────────────────────────────────
  const jumpToFingerCount = useCallback(
    (index) => {
      setFingerCountIndex(index);
      speak(String(FINGER_COUNTS[index].count));
    },
    [speak]
  );

  const moveFingerCount = useCallback(
    (dir) => {
      setFingerCountIndex((prev) => {
        const next = (prev + dir + FINGER_COUNTS.length) % FINGER_COUNTS.length;
        speak(String(FINGER_COUNTS[next].count));
        return next;
      });
    },
    [speak]
  );

  // ── NUMBERS ──────────────────────────────────────────────
  const jumpToNumber = useCallback(
    (value) => {
      setNumberValue(value);
      setProgress((p) => {
        if (!p.numbersSeen[value]) {
          const newStars = p.stars + 1;
          const updated = {
            ...p, stars: newStars, level: 1 + Math.floor(newStars / 10),
            numbersSeen: { ...p.numbersSeen, [value]: true },
          };
          saveProgress(updated, speechEnabled);
          return updated;
        }
        return p;
      });
      speak(String(value));
    },
    [speak, saveProgress, speechEnabled]
  );

  const moveNumber = useCallback(
    (dir) => {
      setNumberValue((prev) => {
        let next = prev + dir;
        if (next > 100) next = 1;
        if (next < 1) next = 100;
        setProgress((p) => {
          if (!p.numbersSeen[next]) {
            const newStars = p.stars + 1;
            const updated = {
              ...p, stars: newStars, level: 1 + Math.floor(newStars / 10),
              numbersSeen: { ...p.numbersSeen, [next]: true },
            };
            saveProgress(updated, speechEnabled);
            return updated;
          }
          return p;
        });
        speak(String(next));
        return next;
      });
    },
    [speak, saveProgress, speechEnabled]
  );

  // ── WHAT'S NEXT ──────────────────────────────────────────
  const moveNextSelected = useCallback((dir) => {
    setNextState((prev) => {
      if (!prev) return prev;
      const len = prev.options.length;
      return { ...prev, selected: (prev.selected + dir + len) % len };
    });
  }, []);

  const submitNext = useCallback(() => {
    setNextState((prev) => {
      if (!prev) return prev;
      if (prev.result) {
        const fresh = buildSequence();
        speak(`What's next? ${fresh.question}`);
        return fresh;
      }
      const isCorrect = prev.selected === prev.answer;
      const msg = isCorrect ? 'Great job!' : 'Nice try!';
      speak(msg);
      setProgress((p) => {
        const newStars = isCorrect ? p.stars + 2 : p.stars;
        const updated = {
          ...p, stars: newStars, level: 1 + Math.floor(newStars / 10),
          totalAnswers: p.totalAnswers + 1,
          correctAnswers: p.correctAnswers + (isCorrect ? 1 : 0),
        };
        saveProgress(updated, speechEnabled);
        return updated;
      });
      return { ...prev, result: msg };
    });
  }, [speak, saveProgress, speechEnabled]);

  const clickNextOption = useCallback((index) => {
    setTimeout(() => {
      setNextState((prev) => {
        if (!prev) return prev;
        if (prev.result) {
          const fresh = buildSequence();
          speak(`What's next? ${fresh.question}`);
          return fresh;
        }
        const isCorrect = index === prev.answer;
        const msg = isCorrect ? 'Great job!' : 'Nice try!';
        speak(msg);
        setProgress((p) => {
          const newStars = isCorrect ? p.stars + 2 : p.stars;
          const updated = {
            ...p, stars: newStars, level: 1 + Math.floor(newStars / 10),
            totalAnswers: p.totalAnswers + 1,
            correctAnswers: p.correctAnswers + (isCorrect ? 1 : 0),
          };
          saveProgress(updated, speechEnabled);
          return updated;
        });
        return { ...prev, selected: index, result: msg };
      });
    }, 0);
  }, [speak, saveProgress, speechEnabled]);

  // ── FIND THE LETTER ───────────────────────────────────────
  const moveFindSelected = useCallback((dir) => {
    setFindState((prev) => {
      if (!prev) return prev;
      const len = prev.options.length;
      return { ...prev, selected: (prev.selected + dir + len) % len };
    });
  }, []);

  const submitFind = useCallback(() => {
    setFindState((prev) => {
      if (!prev) return prev;
      if (prev.result) {
        const fresh = buildFind();
        speak(`Find the letter ${fresh.target}`);
        return fresh;
      }
      const isCorrect = prev.selected === prev.answer;
      const msg = isCorrect ? 'Correct!' : 'Almost!';
      speak(isCorrect ? 'Correct' : 'Almost');
      setProgress((p) => {
        const newStars = isCorrect ? p.stars + 2 : p.stars;
        const updated = {
          ...p, stars: newStars, level: 1 + Math.floor(newStars / 10),
          totalAnswers: p.totalAnswers + 1,
          correctAnswers: p.correctAnswers + (isCorrect ? 1 : 0),
        };
        saveProgress(updated, speechEnabled);
        return updated;
      });
      return { ...prev, result: msg };
    });
  }, [speak, saveProgress, speechEnabled]);

  // Click an option tile — select it then immediately submit
  const clickFindOption = useCallback((index) => {
    setFindState((prev) => {
      if (!prev || prev.result) return prev;
      return { ...prev, selected: index };
    });
    // Use setTimeout so state update flushes before submit reads it
    setTimeout(() => {
      setFindState((prev) => {
        if (!prev) return prev;
        if (prev.result) {
          const fresh = buildFind();
          speak(`Find the letter ${fresh.target}`);
          return fresh;
        }
        const isCorrect = index === prev.answer;
        const msg = isCorrect ? 'Correct!' : 'Almost!';
        speak(isCorrect ? 'Correct' : 'Almost');
        setProgress((p) => {
          const newStars = isCorrect ? p.stars + 2 : p.stars;
          const updated = {
            ...p, stars: newStars, level: 1 + Math.floor(newStars / 10),
            totalAnswers: p.totalAnswers + 1,
            correctAnswers: p.correctAnswers + (isCorrect ? 1 : 0),
          };
          saveProgress(updated, speechEnabled);
          return updated;
        });
        return { ...prev, selected: index, result: msg };
      });
    }, 0);
  }, [speak, saveProgress, speechEnabled]);

  // ── NEXT ROUND helpers (called from popup Next button) ───
  const nextFindRound = useCallback(() => {
    const fresh = buildFind();
    setFindState(fresh);
    speak(`Find the letter ${fresh.target}`);
  }, [speak]);

  const nextNextRound = useCallback(() => {
    const fresh = buildSequence();
    setNextState(fresh);
    speak(`What's next? ${fresh.question}`);
  }, [speak]);

  // ── NAVIGATION ───────────────────────────────────────────
  const openTile = useCallback(
    (tileKey) => {
      const idx = MODULE_ORDER.indexOf(tileKey);
      if (idx >= 0) setFocusedIndex(idx);
      setMode(tileKey);
      if (tileKey === 'next') {
        const s = buildSequence();
        setNextState(s);
        speak(`What's next? ${s.question}`);
      } else if (tileKey === 'find') {
        const f = buildFind();
        setFindState(f);
        speak(`Find the letter ${f.target}`);
      } else if (tileKey === 'alphabet') {
        speak(LETTER_SOUNDS[alphabetIndex]);
      } else if (tileKey === 'numbers') {
        speak(String(numberValue));
      } else if (tileKey === 'words') {
        const letter = LETTERS[wordsIndex];
        speak(`${letter} for ${LETTER_WORDS[letter].word}`);
      } else if (tileKey === 'fruits') {
        speak(FRUITS[fruitsIndex].name);
      } else if (tileKey === 'animals') {
        speak(DOMESTIC_ANIMALS[animalsIndex].name);
      } else if (tileKey === 'wild-animals') {
        speak(WILD_ANIMALS[wildAnimalsIndex].name);
      } else if (tileKey === 'vowels') {
        speak(VOWELS[vowelsIndex].syllable);
      } else if (tileKey === 'shapes') {
        speak(SHAPES[shapesIndex].name);
      } else if (tileKey === 'colors') {
        speak(COLORS[colorsIndex].name);
      } else if (tileKey === 'vehicles') {
        speak(VEHICLES[vehiclesIndex].name);
      } else if (tileKey === 'foods') {
        speak(FOODS[foodsIndex].name);
      } else if (tileKey === 'clothes') {
        speak(CLOTHES[clothesIndex].name);
      } else if (tileKey === 'finger-count') {
        speak(String(FINGER_COUNTS[fingerCountIndex].count));
      }
    },
    [
      speak,
      alphabetIndex,
      numberValue,
      wordsIndex,
      fruitsIndex,
      animalsIndex,
      wildAnimalsIndex,
      vowelsIndex,
      shapesIndex,
      colorsIndex,
      vehiclesIndex,
      foodsIndex,
      clothesIndex,
      fingerCountIndex,
    ]
  );

  const toMenu = useCallback(() => {
    setMode('menu');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // ── KEYBOARD HANDLER ─────────────────────────────────────
  const handleKey = useCallback(
    (key) => {
      if (key.toLowerCase() === 'm') { toggleNarration(); return; }

      if (mode === 'menu') {
        if (key === 'ArrowRight' || key === 'ArrowDown')
          setFocusedIndex((prev) => clamp(prev + 1, 0, MODULE_ORDER.length - 1));
        else if (key === 'ArrowLeft' || key === 'ArrowUp')
          setFocusedIndex((prev) => clamp(prev - 1, 0, MODULE_ORDER.length - 1));
        else if (key === 'Enter' || key === ' ')
          setFocusedIndex((prev) => { openTile(MODULE_ORDER[prev]); return prev; });
        return;
      }

      if (key === 'Backspace' || key === 'Escape') { toMenu(); return; }

      if (mode === 'alphabet') {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveAlphabet(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveAlphabet(-1);
        return;
      }
      if (mode === 'words') {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveWords(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveWords(-1);
        return;
      }
      if (mode === 'fruits') {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveFruits(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveFruits(-1);
        return;
      }
      if (mode === 'animals') {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveAnimals(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveAnimals(-1);
        return;
      }
      if (mode === 'wild-animals') {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveWildAnimals(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveWildAnimals(-1);
        return;
      }
      if (mode === 'vowels') {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveVowels(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveVowels(-1);
        return;
      }
      if (mode === 'shapes') {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveShapes(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveShapes(-1);
        return;
      }
      if (mode === 'colors') {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveColors(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveColors(-1);
        return;
      }
      if (mode === 'vehicles') {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveVehicles(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveVehicles(-1);
        return;
      }
      if (mode === 'foods') {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveFoods(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveFoods(-1);
        return;
      }
      if (mode === 'clothes') {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveClothes(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveClothes(-1);
        return;
      }
      if (mode === 'finger-count') {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveFingerCount(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveFingerCount(-1);
        return;
      }
      if (mode === 'numbers') {
        if (key === 'ArrowRight' || key === 'ArrowUp') moveNumber(1);
        else if (key === 'ArrowLeft' || key === 'ArrowDown') moveNumber(-1);
        return;
      }
      if (mode === 'next') {
        if (key === 'Enter' || key === ' ') submitNext();
        else if (key === 'ArrowRight' || key === 'ArrowDown') moveNextSelected(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveNextSelected(-1);
        return;
      }
      if (mode === 'find') {
        if (key === 'Enter' || key === ' ') submitFind();
        else if (key === 'ArrowRight' || key === 'ArrowDown') moveFindSelected(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveFindSelected(-1);
      }
    },
    [mode, toggleNarration, openTile, toMenu,
      moveAlphabet, moveWords, moveFruits, moveAnimals, moveWildAnimals, moveVowels, moveShapes, moveColors, moveVehicles, moveFoods, moveClothes, moveFingerCount, moveNumber,
     submitNext, moveNextSelected, submitFind, moveFindSelected]
  );

  // ── DERIVED DISPLAY DATA ──────────────────────────────────
  const accuracy = progress.totalAnswers > 0
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
    : 0;

  let displayData = {
    title: 'Welcome',
    prompt: 'Use your remote arrows and OK to begin.',
    display: 'READY',
    hint: 'Tip: Left/Right to switch tiles, OK to open. Press M for narration.',
  };

  if (mode === 'alphabet') {
    displayData = {
      title: 'Alphabet A-Z',
      prompt: `Letter ${alphabetIndex + 1} of 26`,
      display: uppercase ? LETTERS[alphabetIndex] : LETTERS[alphabetIndex].toLowerCase(),
      hint: 'Left/Right: previous/next letter. Backspace: menu.',
    };
  } else if (mode === 'words') {
    const letter = LETTERS[wordsIndex];
    const { word, emoji } = LETTER_WORDS[letter];
    displayData = {
      title: 'A for Apple',
      prompt: `${letter} for ${word}`,
      display: emoji,
      hint: 'Left/Right: next letter. Click a tile. Backspace: menu.',
    };
  } else if (mode === 'fruits') {
    const fruit = FRUITS[fruitsIndex];
    displayData = {
      title: 'Fruits',
      prompt: fruit.name,
      display: fruit.emoji,
      imageSrc: fruit.imageSrc,
      hint: 'Left/Right: next fruit. Click a tile. Backspace: menu.',
    };
  } else if (mode === 'animals') {
    const animal = DOMESTIC_ANIMALS[animalsIndex];
    displayData = {
      title: 'Domestic Animals',
      prompt: animal.name,
      display: animal.emoji,
      hint: 'Left/Right: next animal. Click a tile. Backspace: menu.',
    };
  } else if (mode === 'wild-animals') {
    const animal = WILD_ANIMALS[wildAnimalsIndex];
    displayData = {
      title: 'Wild Animals',
      prompt: animal.name,
      display: animal.emoji,
      hint: 'Left/Right: next wild animal. Click a tile. Backspace: menu.',
    };
  } else if (mode === 'vowels') {
    const v = VOWELS[vowelsIndex];
    displayData = {
      title: 'Vowels & Syllables',
      prompt: `Syllable: ${v.syllable.toUpperCase()}`,
      display: v.syllable,
      hint: 'Left/Right: next syllable. Click a tile. Backspace: menu.',
    };
  } else if (mode === 'shapes') {
    const shape = SHAPES[shapesIndex];
    displayData = {
      title: 'Shapes',
      prompt: shape.name,
      display: shape.symbol,
      hint: 'Left/Right: next shape. Click a tile. Backspace: menu.',
    };
  } else if (mode === 'colors') {
    const color = COLORS[colorsIndex];
    displayData = {
      title: 'Colors',
      prompt: color.name,
      display: color.emoji,
      hint: 'Left/Right: next color. Click a tile. Backspace: menu.',
    };
  } else if (mode === 'vehicles') {
    const vehicle = VEHICLES[vehiclesIndex];
    displayData = {
      title: 'Vehicles',
      prompt: vehicle.name,
      display: vehicle.emoji,
      hint: 'Left/Right: next vehicle. Click a tile. Backspace: menu.',
    };
  } else if (mode === 'foods') {
    const food = FOODS[foodsIndex];
    displayData = {
      title: 'Foods',
      prompt: food.name,
      display: food.emoji,
      hint: 'Left/Right: next food. Click a tile. Backspace: menu.',
    };
  } else if (mode === 'clothes') {
    const cloth = CLOTHES[clothesIndex];
    displayData = {
      title: 'Clothes',
      prompt: cloth.name,
      display: cloth.emoji,
      hint: 'Left/Right: next clothing item. Click a tile. Backspace: menu.',
    };
  } else if (mode === 'finger-count') {
    const item = FINGER_COUNTS[fingerCountIndex];
    displayData = {
      title: 'Finger Count',
      prompt: `Count: ${item.count}`,
      display: item.display,
      imageSrc: item.imageSrc,
      hint: 'Left/Right: next count. Click a tile. Backspace: menu.',
    };
  } else if (mode === 'numbers') {
    displayData = {
      title: 'Learn Maths',
      prompt: `Number ${numberValue} of 100`,
      display: String(numberValue),
      hint: 'Left/Right: minus/plus one. Backspace: menu.',
    };
  } else if (mode === 'next' && nextState) {
    const marker = nextState.options
      .map((o, i) => (i === nextState.selected ? `[${o}]` : o)).join('   ');
    displayData = {
      title: "What's Next?",
      prompt: nextState.question,
      display: marker,
      hint: nextState.result || 'Left/Right: move choice. OK: submit. Backspace: menu.',
    };
  } else if (mode === 'find' && findState) {
    const optionText = findState.options
      .map((o, i) => (i === findState.selected ? `[${o}]` : o)).join('   ');
    displayData = {
      title: 'Find the Letter',
      prompt: `Find letter: ${findState.target}`,
      display: optionText,
      hint: findState.result || 'Left/Right: choose. OK: confirm. Backspace: menu.',
    };
  }

  return {
    mode,
    focusedIndex,
    alphabetIndex,
    uppercase,
    setUppercase,
    numberValue,
    wordsIndex,
    fruitsIndex,
    animalsIndex,
    wildAnimalsIndex,
    vowelsIndex,
    shapesIndex,
    colorsIndex,
    vehiclesIndex,
    foodsIndex,
    clothesIndex,
    fingerCountIndex,
    nextState,
    findState,
    displayData,
    progress,
    speechEnabled,
    accuracy,
    speak,
    openTile,
    toMenu,
    handleKey,
    toggleNarration,
    updateFocusedIndex,
    jumpToLetter,
    jumpToNumber,
    jumpToWord,
    jumpToFruit,
    jumpToAnimal,
    jumpToWildAnimal,
    jumpToVowel,
    jumpToShape,
    jumpToColor,
    jumpToVehicle,
    jumpToFood,
    jumpToCloth,
    jumpToFingerCount,
    clickFindOption,
    clickNextOption,
    nextFindRound,
    nextNextRound,
  };
}
