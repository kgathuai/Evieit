'use client';

import { useEffect } from 'react';
import { Box, Typography, Chip, Stack, Divider } from '@mui/material';
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
  } = useUniLearn();

  useEffect(() => {
    function onKeyDown(e) { handleKey(e.key); }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  return (
    <Box
      component="main"
      aria-live="polite"
      sx={{
        height: '100dvh',          // fill the full device viewport height
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
          px: { xs: 2, sm: 4 },
          py: 2,
          display: 'flex',
          alignItems: 'baseline',
          gap: 2,
          flexShrink: 0,
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%)',
        }}
      >
        <Typography variant="h1" fontWeight={900} color="#fff" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          🚀 Evie-nana
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
            vowelsIndex={vowelsIndex}
            shapesIndex={shapesIndex}
            colorsIndex={colorsIndex}
            vehiclesIndex={vehiclesIndex}
            foodsIndex={foodsIndex}
            clothesIndex={clothesIndex}
            fingerCountIndex={fingerCountIndex}
            nextState={nextState}
            findState={findState}
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
          />
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* RIGHT — tile picker, fixed width */}
        <Box
          sx={{
            width: { xs: 220, sm: 300, md: 340 },
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
        sx={{ px: 2, py: 1.5, flexShrink: 0, bgcolor: 'rgba(255,107,107,0.05)' }}
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
    </Box>
  );
}
