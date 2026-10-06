import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const STORAGE_KEY = 'uniLearnProgressV1';
const CHILD_NAME_KEY = 'uniLearnChildName';
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const MODULE_ORDER = ['alphabet', 'numbers', 'words', 'fruits', 'animals', 'wild-animals', 'animal-sounds', 'vowels', 'shapes', 'colors', 'vehicles', 'foods', 'clothes', 'finger-count', 'fractions', 'next', 'find'];

// Phonetic sounds — how each letter actually sounds, not its name
export const LETTER_SOUNDS = {
  A: 'ah',   B: 'buh',  C: 'kuh',  D: 'duh',  E: 'eh',
  F: 'fuh',  G: 'guh',  H: 'huh',  I: 'ih',   J: 'juh',
  K: 'kuh',  L: 'luh',  M: 'muh',  N: 'nuh',  O: 'oh',
  P: 'puh',  Q: 'kwuh', R: 'ruh',  S: 's',  T: 'tuh',
  U: 'uh',   V: 'vuh',  W: 'wuh',  X: 'x',   Y: 'yuh',
  Z: 'z',
};

// ── Fruits ────────────────────────────────────────────────
export const FRUITS = [
  { name: 'Apple',      emoji: '🍎', imageSrc: 'images/fruits/apple.jpg' },
  { name: 'Banana',     emoji: '🍌', imageSrc: 'images/fruits/banana.jpg' },
  { name: 'Blackberry', emoji: '🫐', imageSrc: 'images/fruits/blackberry.jpg' },
  { name: 'Cherry',     emoji: '🍒', imageSrc: 'images/fruits/cherry.jpg' },
  { name: 'Dragonfruit',emoji: '🐉', imageSrc: 'images/dragonfruit.svg' },
  { name: 'Grapefruit', emoji: '🍊', imageSrc: 'images/fruits/grapefruit.jpg' },
  { name: 'Grape',      emoji: '🍇', imageSrc: 'images/fruits/grape.jpg' },
  { name: 'Guava',      emoji: '🍐', imageSrc: 'images/fruits/guava.jpg' },
  { name: 'Lemon',      emoji: '🍋', imageSrc: 'images/fruits/lemon.jpg' },
  { name: 'Lime',       emoji: '🍋', imageSrc: 'images/fruits/lime.jpg' },
  { name: 'Mango',      emoji: '🥭', imageSrc: 'images/fruits/mango.jpg' },
  { name: 'Orange',     emoji: '🍊', imageSrc: 'images/fruits/orange.jpg' },
  { name: 'Papaya',     emoji: '🥭', imageSrc: 'images/fruits/papaya.jpg' },
  { name: 'Passionfruit', emoji: '🥭', imageSrc: 'images/fruits/passionfruit.jpg' },
  { name: 'Peach',      emoji: '🍑', imageSrc: 'images/fruits/peach.jpg' },
  { name: 'Pear',       emoji: '🍐', imageSrc: 'images/fruits/pear.jpg' },
  { name: 'Pineapple',  emoji: '🍍', imageSrc: 'images/fruits/pineapple.jpg' },
  { name: 'Plum',       emoji: '🍑', imageSrc: 'images/fruits/plum.jpg' },
  { name: 'Pomegranate',emoji: '🍎', imageSrc: 'images/fruits/pomegranate.jpg' },
  { name: 'Raspberry',  emoji: '🍓', imageSrc: 'images/fruits/raspberry.jpg' },
  { name: 'Strawberry', emoji: '🍓', imageSrc: 'images/fruits/strawberry.jpg' },
  { name: 'Tangerine',  emoji: '🍊', imageSrc: 'images/fruits/tangerine.jpg' },
  { name: 'Watermelon', emoji: '🍉', imageSrc: 'images/fruits/watermelon.jpg' },
  { name: 'Kiwi',       emoji: '🥝', imageSrc: 'images/fruits/kiwi.jpg' },
  { name: 'Coconut',    emoji: '🥥', imageSrc: 'images/fruits/coconut.jpg' },
  { name: 'Blueberry',  emoji: '🫐', imageSrc: 'images/fruits/blueberry.jpg' },
  { name: 'Melon',      emoji: '🍈', imageSrc: 'images/fruits/melon.jpg' },
  { name: 'Avocado',    emoji: '🥑', imageSrc: 'images/fruits/avocado.jpg' },
  { name: 'Tomato',     emoji: '🍅', imageSrc: 'images/fruits/tomato.jpg' },
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
  { name: 'Mule',     emoji: '🐎' },
  { name: 'Rabbit',   emoji: '🐰' },
  { name: 'Hamster',  emoji: '🐹' },
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

// ── Animal sounds (domestic + wild) ───────────────────────
export const ANIMAL_SOUNDS = [
  // Domestic
  { name: 'Cat',      emoji: '🐱', sound: 'Meow' },
  { name: 'Dog',      emoji: '🐶', sound: 'Woof' },
  { name: 'Cow',      emoji: '🐮', sound: 'Moo' },
  { name: 'Goat',     emoji: '🐐', sound: 'Baa' },
  { name: 'Sheep',    emoji: '🐑', sound: 'Baa' },
  { name: 'Pig',      emoji: '🐷', sound: 'Oink' },
  { name: 'Horse',    emoji: '🐴', sound: 'Neigh' },
  { name: 'Donkey',   emoji: '🫏', sound: 'Hee-haw' },
  { name: 'Rabbit',   emoji: '🐰', sound: 'Squeak' },
  { name: 'Chicken',  emoji: '🐔', sound: 'Cluck' },
  { name: 'Duck',     emoji: '🦆', sound: 'Quack' },
  { name: 'Goose',    emoji: '🪿', sound: 'Honk' },
  { name: 'Camel',    emoji: '🐪', sound: 'Grunt' },
  { name: 'Turkey',   emoji: '🦃', sound: 'Gobble' },
  { name: 'Rooster',  emoji: '🐓', sound: 'Cock-a-doodle-doo' },
  { name: 'Pigeon',   emoji: '🕊️', sound: 'Coo' },
  // Wild
  { name: 'Lion',      emoji: '🦁', sound: 'Roar' },
  { name: 'Tiger',     emoji: '🐯', sound: 'Growl' },
  { name: 'Elephant',  emoji: '🐘', sound: 'Trumpet' },
  { name: 'Zebra',     emoji: '🦓', sound: 'Bray' },
  { name: 'Monkey',    emoji: '🐒', sound: 'Ooh-ooh-aah-aah' },
  { name: 'Bear',      emoji: '🐻', sound: 'Growl' },
  { name: 'Wolf',      emoji: '🐺', sound: 'Howl' },
  { name: 'Fox',       emoji: '🦊', sound: 'Yip' },
  { name: 'Crocodile', emoji: '🐊', sound: 'Hiss' },
  { name: 'Gorilla',   emoji: '🦍', sound: 'Grunt' },
  { name: 'Snake',     emoji: '🐍', sound: 'Hiss' },
  { name: 'Owl',       emoji: '🦉', sound: 'Hoot' },
  { name: 'Eagle',     emoji: '🦅', sound: 'Screech' },
  { name: 'Whale',     emoji: '🐋', sound: 'Song' },
  { name: 'Dolphin',   emoji: '🐬', sound: 'Click' },
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
  { name: 'Pizza', emoji: '🍕', imageSrc: 'images/foods/pizza.jpg' },
  { name: 'Burger', emoji: '🍔', imageSrc: 'images/foods/burger.jpg' },
  { name: 'Fries', emoji: '🍟', imageSrc: 'images/foods/fries.jpg' },
  { name: 'Rice', emoji: '🍚', imageSrc: 'images/foods/rice.jpg' },
  { name: 'Bread', emoji: '🍞', imageSrc: 'images/foods/bread.jpg' },
  { name: 'Egg', emoji: '🥚', imageSrc: 'images/foods/egg.jpg' },
  { name: 'Noodles', emoji: '🍜', imageSrc: 'images/foods/noodles.jpg' },
  { name: 'Fish', emoji: '🐟', imageSrc: 'images/foods/fish.jpg' },
  { name: 'Chicken', emoji: '🍗', imageSrc: 'images/foods/chicken.jpg' },
  { name: 'Cake', emoji: '🍰', imageSrc: 'images/foods/cake.jpg' },
  { name: 'Pancake', emoji: '🥞', imageSrc: 'images/foods/pancake.jpg' },
  { name: 'Sandwich', emoji: '🥪', imageSrc: 'images/foods/sandwich.jpg' },
  { name: 'Hot Dog', emoji: '🌭', imageSrc: 'images/foods/hotdog.png' },
  { name: 'Pasta', emoji: '🍝', imageSrc: 'images/foods/pasta.jpg' },
  { name: 'Soup', emoji: '🍲', imageSrc: 'images/foods/soup.jpg' },
  { name: 'Ice Cream', emoji: '🍨', imageSrc: 'images/foods/icecream.jpg' },
  { name: 'Donut', emoji: '🍩', imageSrc: 'images/foods/donut.jpg' },
  { name: 'Cookie', emoji: '🍪', imageSrc: 'images/foods/cookie.png' },
  { name: 'Popcorn', emoji: '🍿', imageSrc: 'images/foods/popcorn.jpg' },
  { name: 'Cheese', emoji: '🧀', imageSrc: 'images/foods/cheese.jpg' },
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
  { count: 3, display: '', imageSrc: 'images/three.png' },
  { count: 4, display: '🖖' },
  { count: 5, display: '🖐️' },
  { count: 6, display: '☝️ + 🖐️' },
  { count: 7, display: '✌️ + 🖐️' },
  { count: 8, display: ' + 🖐️', imageSrc: 'images/three.png' },
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

// ── Generic module configuration ──────────────────────────
// Every module below follows the exact same interaction: pick an item from
// `data` (by index), speak `getLabel(item)`, and render `getDisplay(item)`
// in the lesson panel. `alphabet` and `numbers` are NOT here — they track
// extra progress/star state and stay bespoke in the hook below.
const GENERIC_MODULES = {
  words: {
    data: LETTERS,
    getLabel: (letter) => `${letter} for ${LETTER_WORDS[letter].word}`,
    title: 'A for Apple',
    hint: 'Left/Right: next letter. Click a tile. Backspace: menu.',
    getDisplay: (letter) => {
      const { word, emoji } = LETTER_WORDS[letter];
      return { prompt: `${letter} for ${word}`, display: emoji };
    },
  },
  fruits: {
    data: FRUITS,
    getLabel: (item) => item.name,
    title: 'Fruits',
    hint: 'Left/Right: next fruit. Click a tile. Backspace: menu.',
    getDisplay: (item) => ({ prompt: item.name, display: item.emoji, imageSrc: item.imageSrc }),
  },
  animals: {
    data: DOMESTIC_ANIMALS,
    getLabel: (item) => item.name,
    title: 'Domestic Animals',
    hint: 'Left/Right: next animal. Click a tile. Backspace: menu.',
    getDisplay: (item) => ({ prompt: item.name, display: item.emoji }),
  },
  'wild-animals': {
    data: WILD_ANIMALS,
    getLabel: (item) => item.name,
    title: 'Wild Animals',
    hint: 'Left/Right: next wild animal. Click a tile. Backspace: menu.',
    getDisplay: (item) => ({ prompt: item.name, display: item.emoji }),
  },
  'animal-sounds': {
    data: ANIMAL_SOUNDS,
    getLabel: (item) => `${item.name} ${item.sound}`,
    title: 'Animal Sounds',
    hint: 'Left/Right: next animal. Click a tile. Backspace: menu.',
    getDisplay: (item) => ({ prompt: item.name, display: item.emoji, sound: item.sound }),
  },
  vowels: {
    data: VOWELS,
    getLabel: (item) => item.syllable,
    title: 'Vowels & Syllables',
    hint: 'Left/Right: next syllable. Click a tile. Backspace: menu.',
    getDisplay: (item) => ({ prompt: `Syllable: ${item.syllable.toUpperCase()}`, display: item.syllable }),
  },
  shapes: {
    data: SHAPES,
    getLabel: (item) => item.name,
    title: 'Shapes',
    hint: 'Left/Right: next shape. Click a tile. Backspace: menu.',
    getDisplay: (item) => ({ prompt: item.name, display: item.symbol }),
  },
  colors: {
    data: COLORS,
    getLabel: (item) => item.name,
    title: 'Colors',
    hint: 'Left/Right: next color. Click a tile. Backspace: menu.',
    getDisplay: (item) => ({ prompt: item.name, display: item.emoji }),
  },
  vehicles: {
    data: VEHICLES,
    getLabel: (item) => item.name,
    title: 'Vehicles',
    hint: 'Left/Right: next vehicle. Click a tile. Backspace: menu.',
    getDisplay: (item) => ({ prompt: item.name, display: item.emoji }),
  },
  foods: {
    data: FOODS,
    getLabel: (item) => item.name,
    title: 'Foods',
    hint: 'Left/Right: next food. Click a tile. Backspace: menu.',
    getDisplay: (item) => ({ prompt: item.name, display: item.emoji }),
  },
  clothes: {
    data: CLOTHES,
    getLabel: (item) => item.name,
    title: 'Clothes',
    hint: 'Left/Right: next clothing item. Click a tile. Backspace: menu.',
    getDisplay: (item) => ({ prompt: item.name, display: item.emoji }),
  },
  'finger-count': {
    data: FINGER_COUNTS,
    getLabel: (item) => String(item.count),
    title: 'Finger Count',
    hint: 'Left/Right: next count. Click a tile. Backspace: menu.',
    getDisplay: (item) => ({ prompt: `Count: ${item.count}`, display: item.display, imageSrc: item.imageSrc }),
  },
};
const GENERIC_MODULE_KEYS = Object.keys(GENERIC_MODULES);

// Maps each generic module to the flat property/function names the rest of
// the app already expects (e.g. `fruitsIndex` / `jumpToFruit`), so call
// sites in app/page.jsx and components/LessonPanel.jsx need no changes.
const FLAT_NAME_MAP = {
  words:          { indexProp: 'wordsIndex',        jumpFn: 'jumpToWord' },
  fruits:         { indexProp: 'fruitsIndex',        jumpFn: 'jumpToFruit' },
  animals:        { indexProp: 'animalsIndex',       jumpFn: 'jumpToAnimal' },
  'wild-animals': { indexProp: 'wildAnimalsIndex',   jumpFn: 'jumpToWildAnimal' },
  'animal-sounds': { indexProp: 'animalSoundsIndex', jumpFn: 'jumpToAnimalSound' },
  vowels:         { indexProp: 'vowelsIndex',        jumpFn: 'jumpToVowel' },
  shapes:         { indexProp: 'shapesIndex',        jumpFn: 'jumpToShape' },
  colors:         { indexProp: 'colorsIndex',        jumpFn: 'jumpToColor' },
  vehicles:       { indexProp: 'vehiclesIndex',      jumpFn: 'jumpToVehicle' },
  foods:          { indexProp: 'foodsIndex',         jumpFn: 'jumpToFood' },
  clothes:        { indexProp: 'clothesIndex',       jumpFn: 'jumpToCloth' },
  'finger-count': { indexProp: 'fingerCountIndex',   jumpFn: 'jumpToFingerCount' },
};

const INITIAL_MODULE_INDICES = Object.fromEntries(GENERIC_MODULE_KEYS.map((k) => [k, 0]));

// ── Fraction Puzzle ───────────────────────────────────────
// Real-world shapes a child breaks into N equal pieces, then rebuilds by
// collecting pieces from the tray and dropping them into the outline.
export const FRACTION_SHAPES = [
  { name: 'Bread',     shape: 'circle',    color: '#d8a35a' },
  { name: 'Pizza',     shape: 'circle',    color: '#f2a93c' },
  { name: 'Cookie',    shape: 'circle',    color: '#8d5a3b' },
  { name: 'Cracker',   shape: 'rectangle', color: '#e8c373' },
  { name: 'Chocolate', shape: 'rectangle', color: '#5a3825' },
  { name: 'Cake',      shape: 'rectangle', color: '#f6c8d8' },
];

const FRACTION_DENOMINATORS = [2, 3, 4, 5, 6];

export const FRACTION_WORDS = {
  2: { singular: 'half',    plural: 'halves' },
  3: { singular: 'third',   plural: 'thirds' },
  4: { singular: 'quarter', plural: 'quarters' },
  5: { singular: 'fifth',   plural: 'fifths' },
  6: { singular: 'sixth',   plural: 'sixths' },
};

function buildFractionPuzzle() {
  const theme = FRACTION_SHAPES[Math.floor(Math.random() * FRACTION_SHAPES.length)];
  const denominator = FRACTION_DENOMINATORS[Math.floor(Math.random() * FRACTION_DENOMINATORS.length)];
  return {
    theme,
    denominator,
    filledSlots: Array(denominator).fill(false),
    remaining: denominator,
    heldPiece: false,
    focusZone: 'tray',   // 'tray' while picking a piece, 'slot' while placing it
    focusIndex: 0,
    result: '',          // '' | 'complete'
  };
}

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
  const [childName, setChildNameState] = useState('');
  const [childNameLoaded, setChildNameLoaded] = useState(false);
  const [alphabetIndex, setAlphabetIndex] = useState(0);
  const [uppercase, setUppercase] = useState(true);
  const [numberValue, setNumberValue] = useState(1);
  const [moduleIndices, setModuleIndices] = useState(INITIAL_MODULE_INDICES);

  // Mirrors of the latest index state, read (not subscribed to) by callbacks
  // like `openTile` below. This keeps those callbacks referentially stable
  // across renders — required for React.memo on TileGrid/tile components to
  // actually skip re-renders instead of always seeing a "new" handler prop.
  const alphabetIndexRef = useRef(alphabetIndex);
  useEffect(() => { alphabetIndexRef.current = alphabetIndex; }, [alphabetIndex]);
  const numberValueRef = useRef(numberValue);
  useEffect(() => { numberValueRef.current = numberValue; }, [numberValue]);
  const moduleIndicesRef = useRef(moduleIndices);
  useEffect(() => { moduleIndicesRef.current = moduleIndices; }, [moduleIndices]);
  const [nextState, setNextState] = useState(null);
  const [findState, setFindState] = useState(null);
  const [fractionState, setFractionState] = useState(null);
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHILD_NAME_KEY);
      if (stored) setChildNameState(stored);
    } catch (e) {
      console.warn('Could not load child name', e);
    } finally {
      setChildNameLoaded(true);
    }
  }, []);

  const setChildName = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem(CHILD_NAME_KEY, trimmed);
    } catch (e) {
      console.warn('Could not save child name', e);
    }
    setChildNameState(trimmed);
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
    [speak, saveProgress, speechEnabled]
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
    [speak, saveProgress, speechEnabled]
  );

  // ── GENERIC MODULES (words, fruits, animals, wild-animals, vowels,
  //    shapes, colors, vehicles, foods, clothes, finger-count) ─────────
  const jumpToGeneric = useCallback(
    (moduleKey, index) => {
      const { data, getLabel } = GENERIC_MODULES[moduleKey];
      setModuleIndices((prev) => ({ ...prev, [moduleKey]: index }));
      speak(getLabel(data[index]));
    },
    [speak]
  );

  const moveGeneric = useCallback(
    (moduleKey, dir) => {
      setModuleIndices((prev) => {
        const { data, getLabel } = GENERIC_MODULES[moduleKey];
        const len = data.length;
        const next = (prev[moduleKey] + dir + len) % len;
        speak(getLabel(data[next]));
        return { ...prev, [moduleKey]: next };
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

  // ── FRACTION PUZZLE ───────────────────────────────────────
  // Pieces of a given puzzle are all equal (congruent) fractions of the
  // whole, so "picking" just needs a held/not-held flag — any tray piece
  // can fill any empty slot.
  const pickFractionPiece = useCallback(() => {
    setFractionState((prev) => {
      if (!prev || prev.result || prev.heldPiece || prev.remaining === 0) return prev;
      const firstEmpty = prev.filledSlots.findIndex((f) => !f);
      return { ...prev, heldPiece: true, focusZone: 'slot', focusIndex: firstEmpty };
    });
  }, []);

  const placeFractionPiece = useCallback(
    (slotIndex) => {
      setFractionState((prev) => {
        if (!prev || prev.result || !prev.heldPiece || prev.filledSlots[slotIndex]) return prev;
        const filledSlots = [...prev.filledSlots];
        filledSlots[slotIndex] = true;
        const remaining = prev.remaining - 1;
        if (remaining === 0) {
          const words = FRACTION_WORDS[prev.denominator];
          speak(`You made a whole ${prev.theme.name}! ${prev.denominator} equal ${words.plural} make one whole.`);
          setProgress((p) => {
            const newStars = p.stars + prev.denominator;
            const updated = { ...p, stars: newStars, level: 1 + Math.floor(newStars / 10) };
            saveProgress(updated, speechEnabled);
            return updated;
          });
          return { ...prev, filledSlots, remaining, heldPiece: false, result: 'complete' };
        }
        return { ...prev, filledSlots, remaining, heldPiece: false, focusZone: 'tray', focusIndex: 0 };
      });
    },
    [speak, saveProgress, speechEnabled]
  );

  const moveFractionFocus = useCallback((dir) => {
    setFractionState((prev) => {
      if (!prev || prev.result) return prev;
      if (prev.heldPiece) {
        const emptySlots = prev.filledSlots.reduce((acc, f, i) => (f ? acc : [...acc, i]), []);
        const pos = emptySlots.indexOf(prev.focusIndex);
        const nextPos = (pos + dir + emptySlots.length) % emptySlots.length;
        return { ...prev, focusIndex: emptySlots[nextPos] };
      }
      if (prev.remaining <= 1) return prev;
      const nextIndex = (prev.focusIndex + dir + prev.remaining) % prev.remaining;
      return { ...prev, focusIndex: nextIndex };
    });
  }, []);

  const nextFractionRound = useCallback(() => {
    setFractionState(buildFractionPuzzle());
  }, []);

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
      } else if (tileKey === 'fractions') {
        setFractionState(buildFractionPuzzle());
      } else if (tileKey === 'alphabet') {
        speak(LETTER_SOUNDS[LETTERS[alphabetIndexRef.current]]);
      } else if (tileKey === 'numbers') {
        speak(String(numberValueRef.current));
      } else if (GENERIC_MODULES[tileKey]) {
        const { data, getLabel } = GENERIC_MODULES[tileKey];
        speak(getLabel(data[moduleIndicesRef.current[tileKey]]));
      }
    },
    [speak]
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
      if (GENERIC_MODULES[mode]) {
        if (key === 'ArrowRight' || key === 'ArrowDown') moveGeneric(mode, 1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveGeneric(mode, -1);
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
        return;
      }
      if (mode === 'fractions') {
        if (key === 'Enter' || key === ' ') {
          if (fractionState?.result === 'complete') nextFractionRound();
          else if (fractionState?.heldPiece) placeFractionPiece(fractionState.focusIndex);
          else pickFractionPiece();
        } else if (key === 'ArrowRight' || key === 'ArrowDown') moveFractionFocus(1);
        else if (key === 'ArrowLeft' || key === 'ArrowUp') moveFractionFocus(-1);
      }
    },
    [mode, toggleNarration, openTile, toMenu, moveAlphabet, moveGeneric, moveNumber,
     submitNext, moveNextSelected, submitFind, moveFindSelected,
     fractionState, nextFractionRound, placeFractionPiece, pickFractionPiece, moveFractionFocus]
  );

  // ── DERIVED DISPLAY DATA ──────────────────────────────────
  const accuracy = progress.totalAnswers > 0
    ? Math.round((progress.correctAnswers / progress.totalAnswers) * 100)
    : 0;

  const displayData = useMemo(() => {
    if (mode === 'alphabet') {
      return {
        title: 'Alphabet A-Z',
        prompt: `Letter ${alphabetIndex + 1} of 26`,
        display: uppercase ? LETTERS[alphabetIndex] : LETTERS[alphabetIndex].toLowerCase(),
        hint: 'Left/Right: previous/next letter. Backspace: menu.',
      };
    }
    if (GENERIC_MODULES[mode]) {
      const cfg = GENERIC_MODULES[mode];
      const item = cfg.data[moduleIndices[mode]];
      return { title: cfg.title, hint: cfg.hint, ...cfg.getDisplay(item) };
    }
    if (mode === 'numbers') {
      return {
        title: 'Learn Maths',
        prompt: `Number ${numberValue} of 100`,
        display: String(numberValue),
        hint: 'Left/Right: minus/plus one. Backspace: menu.',
      };
    }
    if (mode === 'next' && nextState) {
      const marker = nextState.options
        .map((o, i) => (i === nextState.selected ? `[${o}]` : o)).join('   ');
      return {
        title: "What's Next?",
        prompt: nextState.question,
        display: marker,
        hint: nextState.result || 'Left/Right: move choice. OK: submit. Backspace: menu.',
      };
    }
    if (mode === 'find' && findState) {
      const optionText = findState.options
        .map((o, i) => (i === findState.selected ? `[${o}]` : o)).join('   ');
      return {
        title: 'Find the Letter',
        prompt: `Find letter: ${findState.target}`,
        display: optionText,
        hint: findState.result || 'Left/Right: choose. OK: confirm. Backspace: menu.',
      };
    }
    if (mode === 'fractions' && fractionState) {
      const words = FRACTION_WORDS[fractionState.denominator];
      return {
        title: 'Fraction Puzzle',
        prompt: `Build the whole ${fractionState.theme.name} from ${fractionState.denominator} equal ${words.plural}`,
        display: `${fractionState.denominator - fractionState.remaining}/${fractionState.denominator}`,
        hint: fractionState.heldPiece
          ? 'Arrows: choose an empty piece of the shape. OK: drop it there.'
          : 'Click or arrow + OK to pick up a piece, then drop it into the shape.',
      };
    }
    return {
      title: 'Welcome',
      prompt: 'Use your remote arrows and OK to begin.',
      display: 'READY',
      hint: 'Tip: Left/Right to switch tiles, OK to open. Press M for narration.',
    };
  }, [mode, alphabetIndex, uppercase, numberValue, moduleIndices, nextState, findState, fractionState]);

  // Back-compat flat accessors: { fruitsIndex, jumpToFruit, ... } for every
  // generic module, so existing call sites need no changes.
  const genericIndexProps = {};
  for (const key of GENERIC_MODULE_KEYS) {
    genericIndexProps[FLAT_NAME_MAP[key].indexProp] = moduleIndices[key];
  }
  const genericJumpFns = useMemo(() => {
    const fns = {};
    for (const key of GENERIC_MODULE_KEYS) {
      fns[FLAT_NAME_MAP[key].jumpFn] = (index) => jumpToGeneric(key, index);
    }
    return fns;
  }, [jumpToGeneric]);

  return {
    mode,
    focusedIndex,
    childName,
    childNameLoaded,
    setChildName,
    alphabetIndex,
    uppercase,
    setUppercase,
    numberValue,
    ...genericIndexProps,
    nextState,
    findState,
    fractionState,
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
    ...genericJumpFns,
    clickFindOption,
    clickNextOption,
    nextFindRound,
    nextNextRound,
    pickFractionPiece,
    placeFractionPiece,
    nextFractionRound,
  };
}
