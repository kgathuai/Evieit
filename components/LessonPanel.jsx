'use client';

import { useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogContent,
  Button,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { LETTER_WORDS, FRUITS, DOMESTIC_ANIMALS, WILD_ANIMALS, VOWELS, SHAPES, COLORS, VEHICLES, FOODS, CLOTHES, FINGER_COUNTS } from '../hooks/useUniLearn';

const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const NUMBERS = Array.from({ length: 100 }, (_, i) => i + 1);

/**
 * A single item tile used in the alphabet / numbers grid.
 * Tiles use a fixed min-width so they're always large and readable.
 * `active` = currently selected, `seen` = already visited.
 */
function ItemTile({ label, active, seen, activeRef, onClick }) {
  return (
    <Box
      ref={active ? activeRef : null}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      aria-pressed={active}
      sx={{
        // Grid handles width — tile just fills its cell
        width: '100%',
        aspectRatio: '1 / 1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        cursor: 'pointer',
        userSelect: 'none',
        fontWeight: active ? 900 : seen ? 800 : 700,
        fontSize: 'clamp(3rem, 6vw, 7rem)',
        lineHeight: 1,
        transition: 'all 0.18s ease',
        bgcolor: active
          ? 'primary.main'
          : seen
          ? 'success.light'
          : 'rgba(255,255,255,0.95)',
        color: active ? '#fff' : seen ? 'success.dark' : 'primary.main',
        border: '3px solid',
        borderColor: active ? 'primary.dark' : seen ? 'success.main' : 'primary.light',
        boxShadow: active ? 8 : 2,
        transform: active ? 'scale(1.2)' : 'scale(1)',
        zIndex: active ? 1 : 0,
      }}
    >
      {label}
    </Box>
  );
}

/**
 * Wrapping flex grid of all letters or all numbers.
 * Tiles grow to fill each row; rows wrap when they run out of width.
 * The active tile scrolls into view automatically.
 */
function ItemGrid({ items, activeIndex, seen, onItemClick }) {
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <Box
      sx={{
        display: 'grid',
        // 4 columns for larger tiles (was 5) — better for baby hands
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 2.5,
        p: 2.5,
        overflowY: 'auto',
        height: '100%',
        alignContent: 'flex-start',
      }}
    >
      {items.map((item, i) => (
        <ItemTile
          key={item}
          label={item}
          active={i === activeIndex}
          seen={!!seen[item]}
          activeRef={activeRef}
          onClick={() => onItemClick(i)}
        />
      ))}
    </Box>
  );
}

/**
 * A single word tile for "A for Apple" mode.
 */
function WordTile({ letter, active, activeRef, onClick }) {
  const { word, emoji } = LETTER_WORDS[letter.toUpperCase()];
  return (
    <Box
      ref={active ? activeRef : null}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      aria-pressed={active}
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        borderRadius: 3,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.15s ease',
        bgcolor: active ? 'primary.main' : 'rgba(255,255,255,0.85)',
        color: active ? '#fff' : 'text.primary',
        border: '2px solid',
        borderColor: active ? 'primary.dark' : 'divider',
        boxShadow: active ? 6 : 1,
        transform: active ? 'scale(1.1)' : 'scale(1)',
        zIndex: active ? 1 : 0,
        p: 0.5,
      }}
    >
      {/* emoji */}
      <Typography sx={{ fontSize: 'clamp(1.2rem, 3vw, 3rem)', lineHeight: 1 }}>
        {emoji}
      </Typography>
      {/* big letter */}
      <Typography sx={{ fontSize: 'clamp(1rem, 2.5vw, 2.5rem)', fontWeight: 900, lineHeight: 1 }}>
        {letter}
      </Typography>
      {/* word */}
      <Typography sx={{ fontSize: 'clamp(0.5rem, 1vw, 0.9rem)', fontWeight: 600, lineHeight: 1, opacity: 0.85 }}>
        {word}
      </Typography>
    </Box>
  );
}

function WordsGrid({ activeIndex, onItemClick }) {
  const activeRef = useRef(null);
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 1.5,
        p: 2,
        overflowY: 'auto',
        height: '100%',
        alignContent: 'flex-start',
      }}
    >
      {UPPERCASE_LETTERS.map((letter, i) => (
        <WordTile
          key={letter}
          letter={letter}
          active={i === activeIndex}
          activeRef={activeRef}
          onClick={() => onItemClick(i)}
        />
      ))}
    </Box>
  );
}

/**
 * Generic tile for simple "glyph + name" modules (fruits, animals,
 * wild-animals, shapes, vehicles, foods, clothes). Colors reuses this too
 * via glyphField={null} (no emoji shown) plus a renderExtra swatch.
 */
function SimpleTile({ item, glyphField, labelField, active, activeRef, onClick, renderExtra, gap = 0.5, scaleActive = 1.1 }) {
  return (
    <Box
      ref={active ? activeRef : null}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      aria-pressed={active}
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap,
        borderRadius: 3,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.15s ease',
        bgcolor: active ? 'primary.main' : 'rgba(255,255,255,0.85)',
        color: active ? '#fff' : 'text.primary',
        border: '2px solid',
        borderColor: active ? 'primary.dark' : 'divider',
        boxShadow: active ? 6 : 1,
        transform: active ? `scale(${scaleActive})` : 'scale(1)',
        zIndex: active ? 1 : 0,
        p: 0.5,
      }}
    >
      {renderExtra ? renderExtra(item) : null}
      {glyphField && (
        item.imageSrc ? (
          <Box
            component="img"
            src={item.imageSrc}
            alt={item[labelField]}
            sx={{
              width: 'clamp(4.4rem, 9vw, 7rem)',
              height: 'clamp(4.4rem, 9vw, 7rem)',
              objectFit: 'contain',
              filter: active ? 'drop-shadow(0 8px 12px rgba(0,0,0,0.18))' : 'none',
            }}
          />
        ) : (
          <Typography sx={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', lineHeight: 1 }}>
            {item[glyphField]}
          </Typography>
        )
      )}
      <Typography sx={{ fontSize: 'clamp(0.5rem, 1vw, 0.85rem)', fontWeight: 700, lineHeight: 1.2, textAlign: 'center' }}>
        {item[labelField]}
      </Typography>
    </Box>
  );
}

function SimpleGrid({ data, glyphField, labelField = 'name', activeIndex, onItemClick, renderExtra, gap, scaleActive }) {
  const activeRef = useRef(null);
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 1.5,
        p: 2,
        overflowY: 'auto',
        height: '100%',
        alignContent: 'flex-start',
      }}
    >
      {data.map((item, i) => (
        <SimpleTile
          key={item[labelField]}
          item={item}
          glyphField={glyphField}
          labelField={labelField}
          active={i === activeIndex}
          activeRef={activeRef}
          onClick={() => onItemClick(i)}
          renderExtra={renderExtra}
          gap={gap}
          scaleActive={scaleActive}
        />
      ))}
    </Box>
  );
}

/**
 * Vowel syllable tile — displays the syllable text prominently.
 */
function VowelTile({ item, active, activeRef, onClick }) {
  return (
    <Box
      ref={active ? activeRef : null}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      aria-pressed={active}
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        borderRadius: 3,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.15s ease',
        bgcolor: active ? 'secondary.main' : 'rgba(255,255,255,0.85)',
        color: active ? '#fff' : 'text.primary',
        border: '2px solid',
        borderColor: active ? 'secondary.dark' : 'divider',
        boxShadow: active ? 6 : 1,
        transform: active ? 'scale(1.15)' : 'scale(1)',
        zIndex: active ? 1 : 0,
      }}
    >
      <Typography sx={{ fontSize: 'clamp(1.8rem, 5vw, 5rem)', fontWeight: 900, lineHeight: 1 }}>
        {item.syllable}
      </Typography>
      <Typography sx={{ fontSize: 'clamp(0.5rem, 1vw, 0.75rem)', fontWeight: 600, opacity: 0.65, lineHeight: 1 }}>
        {item.consonant} + {item.vowel}
      </Typography>
    </Box>
  );
}

function VowelsGrid({ activeIndex, onItemClick }) {
  const activeRef = useRef(null);
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 1.5,
        p: 2,
        overflowY: 'auto',
        height: '100%',
        alignContent: 'flex-start',
      }}
    >
      {VOWELS.map((item, i) => (
        <VowelTile
          key={item.syllable}
          item={item}
          active={i === activeIndex}
          activeRef={activeRef}
          onClick={() => onItemClick(i)}
        />
      ))}
    </Box>
  );
}

function FingerCountTile({ item, active, activeRef, onClick }) {
  return (
    <Box
      ref={active ? activeRef : null}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      aria-pressed={active}
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.25,
        borderRadius: 3,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.15s ease',
        bgcolor: active ? 'primary.main' : 'rgba(255,255,255,0.85)',
        color: active ? '#fff' : 'text.primary',
        border: '2px solid',
        borderColor: active ? 'primary.dark' : 'divider',
        boxShadow: active ? 6 : 1,
        transform: active ? 'scale(1.1)' : 'scale(1)',
        zIndex: active ? 1 : 0,
        p: 0.5,
      }}
    >
      <Typography sx={{ fontSize: 'clamp(1.65rem, 4vw, 3.4rem)', lineHeight: 1, textAlign: 'center' }}>
        {item.display}
      </Typography>
      <Typography sx={{ fontSize: 'clamp(1.8rem, 4.5vw, 4rem)', fontWeight: 900, lineHeight: 0.95 }}>
        {item.count}
      </Typography>
    </Box>
  );
}

function FingerCountGrid({ activeIndex, onItemClick }) {
  const activeRef = useRef(null);
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 1.5,
        p: 2,
        overflowY: 'auto',
        height: '100%',
        alignContent: 'flex-start',
      }}
    >
      {FINGER_COUNTS.map((item, i) => (
        <FingerCountTile
          key={item.count}
          item={item}
          active={i === activeIndex}
          activeRef={activeRef}
          onClick={() => onItemClick(i)}
        />
      ))}
    </Box>
  );
}

/**
 * Game display for "What's Next?" and "Find the Letter".
 */
function GameDisplay({ options, selectedIndex, result, prompt, onOptionClick, onNextRound }) {
  const isCorrect = result === 'Correct!' || result === 'Great job!';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, height: '100%' }}>
      <Typography variant="h4" fontWeight={800} color="primary.dark" textAlign="center">
        {prompt}
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center" useFlexGap>
        {options.map((opt, i) => {
          const isSelected = i === selectedIndex;
          return (
            <Box
              key={i}
              onClick={() => !result && onOptionClick?.(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (!result && (e.key === 'Enter' || e.key === ' ')) onOptionClick?.(i); }}
              sx={{
                width: 'clamp(5rem, 12vw, 9rem)',
                height: 'clamp(5rem, 12vw, 9rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                fontWeight: 900,
                border: '3px solid',
                borderColor: isSelected ? 'primary.main' : 'divider',
                bgcolor: isSelected ? 'primary.main' : 'rgba(255,255,255,0.8)',
                color: isSelected ? '#fff' : 'text.primary',
                boxShadow: isSelected ? 6 : 1,
                transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                transition: 'all 0.15s ease',
                userSelect: 'none',
                cursor: result ? 'default' : 'pointer',
              }}
            >
              {opt}
            </Box>
          );
        })}
      </Stack>

      {/* Result popup */}
      <Dialog
        open={!!result}
        onClose={onNextRound}
        PaperProps={{ sx: { borderRadius: 4, textAlign: 'center', px: 4, py: 3, minWidth: 260 } }}
      >
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 0 }}>
          <Typography sx={{ fontSize: '4rem', lineHeight: 1 }}>
            {isCorrect ? '🎉' : '💪'}
          </Typography>
          <Typography variant="h4" fontWeight={900} color={isCorrect ? 'success.main' : 'warning.main'}>
            {result}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onNextRound}
            sx={{ mt: 1, px: 4, borderRadius: 3, fontSize: '1.1rem', fontWeight: 700 }}
          >
            Next →
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

/**
 * LessonPanel — left column, full height.
 * Renders the right content based on `mode`.
 */
export default function LessonPanel({
  mode,
  alphabetIndex,
  uppercase,
  onUppercaseChange,
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
  onToggleNarration,
  onLetterClick,
  onNumberClick,
  onWordClick,
  onFruitClick,
  onAnimalClick,
  onWildAnimalClick,
  onVowelClick,
  onShapeClick,
  onColorClick,
  onVehicleClick,
  onFoodClick,
  onClothClick,
  onFingerCountClick,
  onFindOptionClick,
  onNextOptionClick,
  onNextFindRound,
  onNextNextRound,
}) {
  const { title, prompt, hint } = displayData;
  const LETTERS = uppercase ? UPPERCASE_LETTERS : LOWERCASE_LETTERS;

  // Modules that are all "glyph + name" tiles, differing only in data/glyph field.
  const simpleModules = [
    { key: 'fruits', data: FRUITS, glyphField: 'emoji', activeIndex: fruitsIndex, onItemClick: onFruitClick },
    { key: 'animals', data: DOMESTIC_ANIMALS, glyphField: 'emoji', activeIndex: animalsIndex, onItemClick: onAnimalClick },
    { key: 'wild-animals', data: WILD_ANIMALS, glyphField: 'emoji', activeIndex: wildAnimalsIndex, onItemClick: onWildAnimalClick },
    { key: 'shapes', data: SHAPES, glyphField: 'symbol', activeIndex: shapesIndex, onItemClick: onShapeClick },
    { key: 'vehicles', data: VEHICLES, glyphField: 'emoji', activeIndex: vehiclesIndex, onItemClick: onVehicleClick },
    { key: 'foods', data: FOODS, glyphField: 'emoji', activeIndex: foodsIndex, onItemClick: onFoodClick },
    { key: 'clothes', data: CLOTHES, glyphField: 'emoji', activeIndex: clothesIndex, onItemClick: onClothClick },
  ];
  const activeSimpleModule = simpleModules.find((m) => m.key === mode);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1 }}>

      {/* ── Header ── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Box>
          <Typography variant="h5" fontWeight={900} color="primary.main" lineHeight={1.1}>
            {title}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 700 }}>
            {prompt}
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          {mode === 'alphabet' && (
            <FormControlLabel
              control={
                <Switch
                  checked={uppercase}
                  onChange={(e) => onUppercaseChange(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <Typography variant="caption" fontWeight={700} color="text.secondary">
                  {uppercase ? 'ABC' : 'abc'}
                </Typography>
              }
              labelPlacement="start"
              sx={{ mr: 0, ml: 0 }}
            />
          )}
          <IconButton
            size="large"
            onClick={onToggleNarration}
            aria-label={speechEnabled ? 'Turn narration off' : 'Turn narration on'}
            sx={{ color: speechEnabled ? 'primary.main' : 'text.disabled', fontSize: '2rem' }}
          >
            {speechEnabled ? <RecordVoiceOverIcon fontSize="large" /> : <VolumeOffIcon fontSize="large" />}
          </IconButton>
        </Stack>
      </Box>

      {/* ── Main content area ── */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 100%)',
          border: '2px dashed',
          borderColor: 'primary.light',
          borderRadius: 4,
        }}
      >
        {/* ALPHABET — full A-Z grid */}
        {mode === 'alphabet' && (
          <ItemGrid
            items={LETTERS}
            activeIndex={alphabetIndex}
            seen={progress.alphabetSeen}
            onItemClick={onLetterClick}
          />
        )}

        {/* NUMBERS — full 1-100 grid */}
        {mode === 'numbers' && (
          <ItemGrid
            items={NUMBERS}
            activeIndex={numberValue - 1}
            seen={progress.numbersSeen}
            onItemClick={(i) => onNumberClick(i + 1)}
          />
        )}

        {/* WORDS — A for Apple grid */}
        {mode === 'words' && (
          <WordsGrid
            activeIndex={wordsIndex}
            onItemClick={onWordClick}
          />
        )}

        {/* FRUITS, ANIMALS, WILD ANIMALS, SHAPES, VEHICLES, FOODS, CLOTHES —
            all simple "glyph + name" grids, driven by simpleModules above */}
        {activeSimpleModule && (
          <SimpleGrid
            data={activeSimpleModule.data}
            glyphField={activeSimpleModule.glyphField}
            activeIndex={activeSimpleModule.activeIndex}
            onItemClick={activeSimpleModule.onItemClick}
          />
        )}

        {mode === 'vowels' && (
          <VowelsGrid
            activeIndex={vowelsIndex}
            onItemClick={onVowelClick}
          />
        )}

        {/* COLORS — swatch-only variant of the simple grid (no emoji glyph) */}
        {mode === 'colors' && (
          <SimpleGrid
            data={COLORS}
            glyphField={null}
            activeIndex={colorsIndex}
            onItemClick={onColorClick}
            gap={1}
            scaleActive={1.08}
            renderExtra={(item) => (
              <Box
                sx={{
                  width: 'clamp(2.6rem, 5vw, 4.5rem)',
                  height: 'clamp(2.6rem, 5vw, 4.5rem)',
                  borderRadius: '50%',
                  bgcolor: item.swatch,
                  border: '3px solid',
                  borderColor: item.name === 'White' ? 'grey.400' : 'rgba(0,0,0,0.12)',
                }}
              />
            )}
          />
        )}

        {mode === 'finger-count' && (
          <FingerCountGrid
            activeIndex={fingerCountIndex}
            onItemClick={onFingerCountClick}
          />
        )}

        {/* WHAT'S NEXT game */}
        {mode === 'next' && nextState && (
          <GameDisplay
            options={nextState.options}
            selectedIndex={nextState.selected}
            result={nextState.result}
            prompt={nextState.question}
            onOptionClick={onNextOptionClick}
            onNextRound={onNextNextRound}
          />
        )}

        {/* FIND THE LETTER game */}
        {mode === 'find' && findState && (
          <GameDisplay
            options={findState.options}
            selectedIndex={findState.selected}
            result={findState.result}
            prompt={`Find: ${findState.target}`}
            onOptionClick={onFindOptionClick}
            onNextRound={onNextFindRound}
          />
        )}

        {/* MENU / welcome */}
        {mode === 'menu' && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography
              sx={{
                fontSize: 'clamp(2rem, 10vw, 8rem)',
                fontWeight: 900,
                color: 'primary.dark',
                opacity: 0.25,
                userSelect: 'none',
              }}
            >
              READY
            </Typography>
          </Box>
        )}
      </Paper>

      {/* ── Hint ── */}
      <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ flexShrink: 0 }}>
        {hint}
      </Typography>
    </Box>
  );
}
