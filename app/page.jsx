'use client';

import { useEffect, useState } from 'react';
import {
  Box, Typography, Chip, Stack, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

import { useUniLearn } from '../hooks/useUniLearn';
import LessonPanel from '../components/LessonPanel';
import TileGrid from '../components/TileGrid';

const CONTROL_HINTS = [
  { icon: <KeyboardArrowRightIcon fontSize="small" />, label: 'Arrows: Navigate' },
  { icon: <CheckCircleOutlineIcon fontSize="small" />, label: 'OK / Enter: Select' },
  { icon: <ArrowBackIcon fontSize="small" />, label: 'Backspace: Return' },
  { icon: <RecordVoiceOverIcon fontSize="small" />, label: 'M: Narration On/Off' },
];

export default function Home() {
  const {
    mode,
    focusedIndex,
    childName,
    childNameLoaded,
    setChildName,
    alphabetIndex,
    uppercase,
    setUppercase,
    numberValue,
    wordsIndex,
    fruitsIndex,
    animalsIndex,
    wildAnimalsIndex,
    animalSoundsIndex,
    vowelsIndex,
    shapesIndex,
    colorsIndex,
    vehiclesIndex,
    foodsIndex,
    clothesIndex,
    fingerCountIndex,
    nextState,
    findState,
    fractionState,
    displayData,
    progress,
    speechEnabled,
    accuracy,
    openTile,
    handleKey,
    updateFocusedIndex,
    toggleNarration,
    jumpToLetter,
    jumpToNumber,
    jumpToWord,
    jumpToFruit,
    jumpToAnimal,
    jumpToWildAnimal,
    jumpToAnimalSound,
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
    pickFractionPiece,
    placeFractionPiece,
    nextFractionRound,
  } = useUniLearn();

  const [nameInput, setNameInput] = useState('');
  const showNamePrompt = childNameLoaded && !childName;
  const headerName = childName ? `${childName}-nana` : '';

  useEffect(() => {
    if (childName) document.title = `${childName}-nana`;
  }, [childName]);

  useEffect(() => {
    // Samsung Tizen TV: the remote's dedicated Back button only fires a
    // keydown event (keyCode 10009) once registered via tvinputdevice —
    // it does not arrive as a normal "Backspace" key. No-op on every other
    // platform since the `tizen` global doesn't exist there.
    if (typeof tizen !== 'undefined' && tizen.tvinputdevice) {
      try { tizen.tvinputdevice.registerKey('Back'); } catch (e) { /* unsupported profile */ }
    }
    function onKeyDown(e) {
      if (showNamePrompt) return; // let the name dialog handle its own input
      if (e.keyCode === 10009) { handleKey('Backspace'); return; }
      handleKey(e.key);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey, showNamePrompt]);

  function submitName() {
    if (!nameInput.trim()) return;
    setChildName(nameInput);
  }

  return (
    <Box
      component="main"
      aria-live="polite"
      sx={{
        // `dvh` needs Chrome 108, which almost no TV engine has. Plain vh
        // fills the screen everywhere; dvh is applied only where supported.
        height: '100vh',
        '@supports (height: 100dvh)': { height: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #d0eaf8 0%, #fef9e7 100%)',
        overflow: 'hidden',
      }}
    >
      {/* ── Top header bar ── */}
      <Box
        component="header"
        sx={{
          px: 'max(1rem, var(--safe-x))',
          pt: 'max(0.5rem, var(--safe-y))',
          pb: 2,
          display: 'flex',
          alignItems: 'baseline',
          gap: 2,
          flexShrink: 0,
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%)',
        }}
      >
        <Typography variant="h1" fontWeight={900} color="#fff" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          {headerName ? `🚀 ${headerName}` : '🚀'}
        </Typography>
      </Box>

      <Divider />

      {/* ── Two-column body ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          gap: 0,
          // keeps both columns clear of a television's overscan crop
          px: 'var(--safe-x)',
        }}
      >
        {/* LEFT — lesson display, fills all available height */}
        <Box
          sx={{
            flex: '1 1 0',          // takes remaining width after right panel
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 3, sm: 4 },
            overflow: 'hidden',
          }}
        >
          <LessonPanel
            mode={mode}
            alphabetIndex={alphabetIndex}
            uppercase={uppercase}
            onUppercaseChange={setUppercase}
            numberValue={numberValue}
            wordsIndex={wordsIndex}
            fruitsIndex={fruitsIndex}
            animalsIndex={animalsIndex}
            wildAnimalsIndex={wildAnimalsIndex}
            animalSoundsIndex={animalSoundsIndex}
            vowelsIndex={vowelsIndex}
            shapesIndex={shapesIndex}
            colorsIndex={colorsIndex}
            vehiclesIndex={vehiclesIndex}
            foodsIndex={foodsIndex}
            clothesIndex={clothesIndex}
            fingerCountIndex={fingerCountIndex}
            nextState={nextState}
            findState={findState}
            fractionState={fractionState}
            displayData={displayData}
            progress={progress}
            speechEnabled={speechEnabled}
            accuracy={accuracy}
            onToggleNarration={toggleNarration}
            onLetterClick={jumpToLetter}
            onNumberClick={jumpToNumber}
            onWordClick={jumpToWord}
            onFruitClick={jumpToFruit}
            onAnimalClick={jumpToAnimal}
            onWildAnimalClick={jumpToWildAnimal}
            onAnimalSoundClick={jumpToAnimalSound}
            onVowelClick={jumpToVowel}
            onShapeClick={jumpToShape}
            onColorClick={jumpToColor}
            onVehicleClick={jumpToVehicle}
            onFoodClick={jumpToFood}
            onClothClick={jumpToCloth}
            onFingerCountClick={jumpToFingerCount}
            onFindOptionClick={clickFindOption}
            onNextOptionClick={clickNextOption}
            onNextFindRound={nextFindRound}
            onNextNextRound={nextNextRound}
            onPickFractionPiece={pickFractionPiece}
            onPlaceFractionPiece={placeFractionPiece}
            onNextFractionRound={nextFractionRound}
          />
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* RIGHT — tile picker, fixed width */}
        <Box
          sx={{
            width: { xs: '13.75rem', sm: '18.75rem', md: '21.25rem' },
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 2, sm: 2.5 },
            overflow: 'hidden',
            bgcolor: 'rgba(255,255,255,0.95)',
          }}
        >
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 900, letterSpacing: 1, mb: 2 }}>
            🚹 SELECT LESSON
          </Typography>
          <TileGrid
            focusedIndex={focusedIndex}
            onOpen={openTile}
            onHover={updateFocusedIndex}
          />
        </Box>
      </Box>

      {/* ── Bottom control hints ── */}
      <Divider />
      <Stack
        component="footer"
        direction="row"
        flexWrap="wrap"
        gap={1.5}
        justifyContent="center"
        aria-label="Remote controls"
        sx={{
          px: 'max(1rem, var(--safe-x))',
          pt: 1.5,
          pb: 'max(0.75rem, var(--safe-y))',
          flexShrink: 0,
          bgcolor: 'rgba(255,107,107,0.05)',
        }}
      >
        {CONTROL_HINTS.map(({ icon, label }) => (
          <Chip
            key={label}
            icon={icon}
            label={label}
            variant="filled"
            size="medium"
            color="primary"
            sx={{ bgcolor: '#fff5f5', fontWeight: 800, fontSize: '0.95rem', py: 1 }}
          />
        ))}
      </Stack>

      {/* ── First-run setup: ask for the child's name ── */}
      <Dialog open={showNamePrompt} disableEscapeKeyDown>
        <DialogTitle>Welcome! What's the child's name?</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Child's name"
            placeholder="e.g. Evie"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter') submitName();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={submitName} variant="contained" disabled={!nameInput.trim()}>
            Start
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
