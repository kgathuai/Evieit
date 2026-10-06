import { useRef, useEffect, useCallback, memo } from 'react';
import {
  Box, Typography, Paper, Stack, IconButton, Switch,
  FormControlLabel, Dialog, DialogContent, Button,
} from '@mui/material';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { LETTER_WORDS, FRUITS, DOMESTIC_ANIMALS, WILD_ANIMALS, ANIMAL_SOUNDS, VOWELS, SHAPES, COLORS, VEHICLES, FOODS, CLOTHES, FINGER_COUNTS, FRACTION_WORDS } from '../hooks/useUniLearn';

const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const NUMBERS = Array.from({ length: 100 }, (_, i) => i + 1);

/**
 * Shared grid container for every lesson module: grid layout + auto-scroll
 * to the active tile. Tile rendering is left to the caller (render-prop)
 * since each module's tile markup differs; this only collapses the
 * boilerplate that used to be copy-pasted across six sibling components.
 */
function LessonGrid({ columns, gap, padding, activeIndex, children }) {
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
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        p: padding,
        overflowY: 'auto',
        height: '100%',
        alignContent: 'flex-start',
      }}
    >
      {children(activeRef)}
    </Box>
  );
}

/**
 * A single item tile used in the alphabet / numbers grid.
 * Tiles use a fixed min-width so they're always large and readable.
 * `active` = currently selected, `seen` = already visited.
 *
 * Memoized: the alphabet/numbers grids render up to 100 of these, and only
 * the previously-active and newly-active tile actually need to re-render
 * when the user navigates. `onItemClick` must stay referentially stable
 * (it does — it's a useCallback from the hook) for this bail-out to work.
 */
const ItemTile = memo(function ItemTile({ label, index, active, seen, activeRef, onItemClick }) {
  const handleClick = () => onItemClick(index);
  return (
    <Box
      ref={active ? activeRef : null}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      aria-pressed={active}
      sx={{
        // Grid handles width — tile just fills its cell
        width: '100%',
        aspectRatio: '1 / 1',
        // aspect-ratio needs Chromium 88. Without a fallback the tile
        // collapses to the height of its text on older engines.
        '@supports not (aspect-ratio: 1 / 1)': { height: '13vw', minHeight: '4rem' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        cursor: 'pointer',
        userSelect: 'none',
        fontWeight: active ? 900 : seen ? 800 : 700,
        fontSize: '3rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(3rem, 6vw, 7rem)' },
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
});

/**
 * Wrapping grid of all letters or all numbers. The active tile scrolls into
 * view automatically (handled by LessonGrid).
 */
function ItemGrid({ items, activeIndex, seen, onItemClick }) {
  return (
    <LessonGrid columns={4} gap={2.5} padding={2.5} activeIndex={activeIndex}>
      {(activeRef) => items.map((item, i) => (
        <ItemTile
          key={item}
          label={item}
          index={i}
          active={i === activeIndex}
          seen={!!seen[item]}
          activeRef={activeRef}
          onItemClick={onItemClick}
        />
      ))}
    </LessonGrid>
  );
}

/**
 * A single word tile for "A for Apple" mode.
 */
const WordTile = memo(function WordTile({ letter, index, active, activeRef, onItemClick }) {
  const { word, emoji } = LETTER_WORDS[letter.toUpperCase()];
  const handleClick = () => onItemClick(index);
  return (
    <Box
      ref={active ? activeRef : null}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      aria-pressed={active}
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        // aspect-ratio needs Chromium 88. Without a fallback the tile
        // collapses to the height of its text on older engines.
        '@supports not (aspect-ratio: 1 / 1)': { height: '13vw', minHeight: '4rem' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5, '@supports not (gap: 1px)': { '& > *:not(:last-child)': { marginBottom: '0.25rem' } },
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
      <Typography sx={{ fontSize: '1.2rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(1.2rem, 3vw, 3rem)' }, lineHeight: 1 }}>
        {emoji}
      </Typography>
      {/* big letter */}
      <Typography sx={{ fontSize: '1rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(1rem, 2.5vw, 2.5rem)' }, fontWeight: 900, lineHeight: 1 }}>
        {letter}
      </Typography>
      {/* word */}
      <Typography sx={{ fontSize: '0.5rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(0.5rem, 1vw, 0.9rem)' }, fontWeight: 600, lineHeight: 1, opacity: 0.85 }}>
        {word}
      </Typography>
    </Box>
  );
});

function WordsGrid({ activeIndex, onItemClick }) {
  return (
    <LessonGrid columns={5} gap={1.5} padding={2} activeIndex={activeIndex}>
      {(activeRef) => UPPERCASE_LETTERS.map((letter, i) => (
        <WordTile
          key={letter}
          letter={letter}
          index={i}
          active={i === activeIndex}
          activeRef={activeRef}
          onItemClick={onItemClick}
        />
      ))}
    </LessonGrid>
  );
}

/** Swatch shown above the label in the Colors grid (SimpleGrid's renderExtra).
 * Hoisted to module scope so it's referentially stable across renders —
 * otherwise every SimpleTile in the Colors grid would get a "new" prop
 * each render and never bail out of re-rendering. */
function renderColorSwatch(item) {
  return (
    <Box
      sx={{
        width: '2.6rem', '@supports (width: clamp(1px, 1vw, 2px))': { width: 'clamp(2.6rem, 5vw, 4.5rem)' },
        height: '2.6rem', '@supports (height: clamp(1px, 1vw, 2px))': { height: 'clamp(2.6rem, 5vw, 4.5rem)' },
        borderRadius: '50%',
        bgcolor: item.swatch,
        border: '3px solid',
        borderColor: item.name === 'White' ? 'grey.400' : 'rgba(0,0,0,0.12)',
      }}
    />
  );
}

/**
 * Generic tile for simple "glyph + name" modules (fruits, animals,
 * wild-animals, shapes, vehicles, foods, clothes). Colors reuses this too
 * via glyphField={null} (no emoji shown) plus a renderExtra swatch.
 */
const SimpleTile = memo(function SimpleTile({ item, index, glyphField, labelField, active, activeRef, onItemClick, renderExtra, gap = 0.5, scaleActive = 1.1 }) {
  const handleClick = () => onItemClick(index);
  return (
    <Box
      ref={active ? activeRef : null}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      aria-pressed={active}
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        // aspect-ratio needs Chromium 88. Without a fallback the tile
        // collapses to the height of its text on older engines.
        '@supports not (aspect-ratio: 1 / 1)': { height: '13vw', minHeight: '4rem' },
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
              width: '4.4rem', '@supports (width: clamp(1px, 1vw, 2px))': { width: 'clamp(4.4rem, 9vw, 7rem)' },
              height: '4.4rem', '@supports (height: clamp(1px, 1vw, 2px))': { height: 'clamp(4.4rem, 9vw, 7rem)' },
              objectFit: 'contain',
              filter: active ? 'drop-shadow(0 8px 12px rgba(0,0,0,0.18))' : 'none',
            }}
          />
        ) : (
          <Typography sx={{ fontSize: '2.8rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(2.8rem, 7vw, 6rem)' }, lineHeight: 1 }}>
            {item[glyphField]}
          </Typography>
        )
      )}
      <Typography sx={{ fontSize: '0.5rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(0.5rem, 1vw, 0.85rem)' }, fontWeight: 700, lineHeight: 1.2, textAlign: 'center' }}>
        {item[labelField]}
      </Typography>
    </Box>
  );
});

function SimpleGrid({ data, glyphField, labelField = 'name', activeIndex, onItemClick, renderExtra, gap, scaleActive }) {
  return (
    <LessonGrid columns={5} gap={1.5} padding={2} activeIndex={activeIndex}>
      {(activeRef) => data.map((item, i) => (
        <SimpleTile
          key={item[labelField]}
          item={item}
          index={i}
          glyphField={glyphField}
          labelField={labelField}
          active={i === activeIndex}
          activeRef={activeRef}
          onItemClick={onItemClick}
          renderExtra={renderExtra}
          gap={gap}
          scaleActive={scaleActive}
        />
      ))}
    </LessonGrid>
  );
}

/**
 * Vowel syllable tile — displays the syllable text prominently.
 */
const VowelTile = memo(function VowelTile({ item, index, active, activeRef, onItemClick }) {
  const handleClick = () => onItemClick(index);
  return (
    <Box
      ref={active ? activeRef : null}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      aria-pressed={active}
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        // aspect-ratio needs Chromium 88. Without a fallback the tile
        // collapses to the height of its text on older engines.
        '@supports not (aspect-ratio: 1 / 1)': { height: '13vw', minHeight: '4rem' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5, '@supports not (gap: 1px)': { '& > *:not(:last-child)': { marginBottom: '0.25rem' } },
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
      <Typography sx={{ fontSize: '1.8rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(1.8rem, 5vw, 5rem)' }, fontWeight: 900, lineHeight: 1 }}>
        {item.syllable}
      </Typography>
      <Typography sx={{ fontSize: '0.5rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(0.5rem, 1vw, 0.75rem)' }, fontWeight: 600, opacity: 0.65, lineHeight: 1 }}>
        {item.consonant} + {item.vowel}
      </Typography>
    </Box>
  );
});

function VowelsGrid({ activeIndex, onItemClick }) {
  return (
    <LessonGrid columns={5} gap={1.5} padding={2} activeIndex={activeIndex}>
      {(activeRef) => VOWELS.map((item, i) => (
        <VowelTile
          key={item.syllable}
          item={item}
          index={i}
          active={i === activeIndex}
          activeRef={activeRef}
          onItemClick={onItemClick}
        />
      ))}
    </LessonGrid>
  );
}

/**
 * Animal sound tile — glyph on top, name in the middle, the sound the
 * animal makes (e.g. "Moo") as a quoted caption underneath.
 */
const AnimalSoundTile = memo(function AnimalSoundTile({ item, index, active, activeRef, onItemClick }) {
  const handleClick = () => onItemClick(index);
  return (
    <Box
      ref={active ? activeRef : null}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      aria-pressed={active}
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        // aspect-ratio needs Chromium 88. Without a fallback the tile
        // collapses to the height of its text on older engines.
        '@supports not (aspect-ratio: 1 / 1)': { height: '13vw', minHeight: '4rem' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.25, '@supports not (gap: 1px)': { '& > *:not(:last-child)': { marginBottom: '0.125rem' } },
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
      <Typography sx={{ fontSize: '2rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(2rem, 5vw, 4rem)' }, lineHeight: 1 }}>
        {item.emoji}
      </Typography>
      <Typography sx={{ fontSize: '0.5rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(0.5rem, 1vw, 0.85rem)' }, fontWeight: 700, lineHeight: 1.2, textAlign: 'center' }}>
        {item.name}
      </Typography>
      <Typography sx={{ fontSize: '0.45rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(0.45rem, 0.9vw, 0.75rem)' }, fontWeight: 600, fontStyle: 'italic', opacity: 0.75, lineHeight: 1 }}>
        "{item.sound}"
      </Typography>
    </Box>
  );
});

function AnimalSoundsGrid({ activeIndex, onItemClick }) {
  return (
    <LessonGrid columns={5} gap={1.5} padding={2} activeIndex={activeIndex}>
      {(activeRef) => ANIMAL_SOUNDS.map((item, i) => (
        <AnimalSoundTile
          key={item.name}
          item={item}
          index={i}
          active={i === activeIndex}
          activeRef={activeRef}
          onItemClick={onItemClick}
        />
      ))}
    </LessonGrid>
  );
}

const FingerCountTile = memo(function FingerCountTile({ item, index, active, activeRef, onItemClick }) {
  const handleClick = () => onItemClick(index);
  return (
    <Box
      ref={active ? activeRef : null}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      aria-pressed={active}
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        // aspect-ratio needs Chromium 88. Without a fallback the tile
        // collapses to the height of its text on older engines.
        '@supports not (aspect-ratio: 1 / 1)': { height: '13vw', minHeight: '4rem' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.25, '@supports not (gap: 1px)': { '& > *:not(:last-child)': { marginBottom: '0.125rem' } },
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25 }}>
        {item.imageSrc && (
          <Box
            component="img"
            src={item.imageSrc}
            alt={`Count ${item.count}`}
            sx={{
              width: '1.5rem', '@supports (width: clamp(1px, 1vw, 2px))': { width: 'clamp(1.5rem, 3.6vw, 3rem)' },
              height: '1.5rem', '@supports (height: clamp(1px, 1vw, 2px))': { height: 'clamp(1.5rem, 3.6vw, 3rem)' },
              objectFit: 'contain',
            }}
          />
        )}
        <Typography sx={{ fontSize: '1.65rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(1.65rem, 4vw, 3.4rem)' }, lineHeight: 1, textAlign: 'center' }}>
          {item.display}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: '1.8rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(1.8rem, 4.5vw, 4rem)' }, fontWeight: 900, lineHeight: 0.95 }}>
        {item.count}
      </Typography>
    </Box>
  );
});

function FingerCountGrid({ activeIndex, onItemClick }) {
  return (
    <LessonGrid columns={5} gap={1.5} padding={2} activeIndex={activeIndex}>
      {(activeRef) => FINGER_COUNTS.map((item, i) => (
        <FingerCountTile
          key={item.count}
          item={item}
          index={i}
          active={i === activeIndex}
          activeRef={activeRef}
          onItemClick={onItemClick}
        />
      ))}
    </LessonGrid>
  );
}

/**
 * SVG path helpers for the Fraction Puzzle — slices a circle into equal pie
 * sectors, or a square/rectangle into equal vertical strips.
 */
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeSector(cx, cy, r, startDeg, endDeg) {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function describeStrip(index, count) {
  const stripWidth = 180 / count;
  const x = 10 + index * stripWidth;
  return `M ${x} 10 h ${stripWidth} v 180 h ${-stripWidth} Z`;
}

function slicePath(shape, index, count) {
  return shape === 'circle'
    ? describeSector(100, 100, 90, (index * 360) / count, ((index + 1) * 360) / count)
    : describeStrip(index, count);
}

/**
 * Fraction Puzzle — break a shape (bread, pizza, chocolate bar...) into N
 * equal pieces, then collect them from the tray and drop each one into its
 * empty slot in the outline until the whole shape is rebuilt.
 */
function FractionPuzzleDisplay({ state, onPickPiece, onPlacePiece, onNextRound }) {
  const { theme, denominator, filledSlots, remaining, heldPiece, focusZone, focusIndex, result } = state;
  const isComplete = result === 'complete';
  const words = FRACTION_WORDS[denominator];
  const trayPiecePath = slicePath(theme.shape, 0, denominator);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2.5, '@supports not (gap: 1px)': { '& > *:not(:last-child)': { marginBottom: '1.25rem' } }, height: '100%', p: 2 }}>
      <Typography variant="h5" fontWeight={800} color="primary.dark" textAlign="center">
        Build the whole {theme.name}!
      </Typography>

      {/* Shape outline — denominator equal slots, dashed until filled */}
      <Box sx={{ width: '10rem', '@supports (width: clamp(1px, 1vw, 2px))': { width: 'clamp(10rem, 24vw, 16rem)' }, height: '10rem', '@supports (height: clamp(1px, 1vw, 2px))': { height: 'clamp(10rem, 24vw, 16rem)' }, }}>
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          {Array.from({ length: denominator }, (_, i) => {
            const filled = filledSlots[i];
            const focused = heldPiece && focusZone === 'slot' && focusIndex === i && !filled;
            return (
              <path
                key={i}
                d={slicePath(theme.shape, i, denominator)}
                fill={filled ? theme.color : 'rgba(255,255,255,0.5)'}
                stroke={focused ? '#ff6b6b' : '#bbb'}
                strokeWidth={focused ? 4 : 2}
                strokeDasharray={filled ? '0' : '6 4'}
                onClick={() => heldPiece && !filled && onPlacePiece(i)}
                onDragOver={(e) => !filled && e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); if (!filled) onPlacePiece(i); }}
                style={{
                  cursor: heldPiece && !filled ? 'pointer' : 'default',
                  transition: 'fill 0.2s ease, stroke 0.15s ease',
                }}
              />
            );
          })}
        </svg>
      </Box>

      {/* Tray — pieces waiting to be collected and dropped into the shape */}
      {!isComplete && (
        <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center" useFlexGap>
          {Array.from({ length: remaining }, (_, i) => {
            const focused = !heldPiece && focusIndex === i;
            return (
              <Box
                key={i}
                draggable
                onDragStart={(e) => { e.dataTransfer.setData('text/plain', 'piece'); onPickPiece(); }}
                onClick={onPickPiece}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPickPiece(); }}
                sx={{
                  width: '3.2rem', '@supports (width: clamp(1px, 1vw, 2px))': { width: 'clamp(3.2rem, 7vw, 4.5rem)' },
                  height: '3.2rem', '@supports (height: clamp(1px, 1vw, 2px))': { height: 'clamp(3.2rem, 7vw, 4.5rem)' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'grab',
                  borderRadius: 2,
                  border: '3px solid',
                  borderColor: focused ? 'primary.main' : 'transparent',
                  boxShadow: focused ? 6 : 1,
                  transform: focused ? 'scale(1.12)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  bgcolor: 'rgba(255,255,255,0.6)',
                  opacity: heldPiece ? 0.45 : 1,
                }}
              >
                <svg viewBox="0 0 200 200" width="70%" height="70%">
                  <path d={trayPiecePath} fill={theme.color} stroke="#fff" strokeWidth={4} />
                </svg>
              </Box>
            );
          })}
        </Stack>
      )}

      <Typography variant="body1" fontWeight={700} color="text.secondary">
        {denominator - remaining}/{denominator} {words.plural} placed
      </Typography>

      {/* Result popup */}
      <Dialog
        open={isComplete}
        onClose={onNextRound}
        PaperProps={{ sx: { borderRadius: 4, textAlign: 'center', px: 4, py: 3, minWidth: '16.25rem' } }}
      >
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, '@supports not (gap: 1px)': { '& > *:not(:last-child)': { marginBottom: '1rem' } }, p: 0 }}>
          <Typography sx={{ fontSize: '4rem', lineHeight: 1 }}>🎉</Typography>
          <Typography variant="h5" fontWeight={900} color="success.main" textAlign="center">
            You built the whole {theme.name}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {denominator} equal {words.plural} make one whole.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={onNextRound}
            sx={{ mt: 1, px: 4, borderRadius: 3, fontSize: '1.1rem', fontWeight: 700 }}
          >
            Next shape →
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

/**
 * Game display for "What's Next?" and "Find the Letter".
 */
function GameDisplay({ options, selectedIndex, result, prompt, onOptionClick, onNextRound }) {
  const isCorrect = result === 'Correct!' || result === 'Great job!';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, '@supports not (gap: 1px)': { '& > *:not(:last-child)': { marginBottom: '1.5rem' } }, height: '100%' }}>
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
                width: '5rem', '@supports (width: clamp(1px, 1vw, 2px))': { width: 'clamp(5rem, 12vw, 9rem)' },
                height: '5rem', '@supports (height: clamp(1px, 1vw, 2px))': { height: 'clamp(5rem, 12vw, 9rem)' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 3,
                fontSize: '2rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(2rem, 5vw, 4rem)' },
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
        PaperProps={{ sx: { borderRadius: 4, textAlign: 'center', px: 4, py: 3, minWidth: '16.25rem' } }}
      >
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, '@supports not (gap: 1px)': { '& > *:not(:last-child)': { marginBottom: '1rem' } }, p: 0 }}>
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
function LessonPanel({
  mode,
  alphabetIndex,
  uppercase,
  onUppercaseChange,
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
  onToggleNarration,
  onLetterClick,
  onNumberClick,
  onWordClick,
  onFruitClick,
  onAnimalClick,
  onWildAnimalClick,
  onAnimalSoundClick,
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
  onPickFractionPiece,
  onPlaceFractionPiece,
  onNextFractionRound,
}) {
  const { title, prompt, hint } = displayData;
  const LETTERS = uppercase ? UPPERCASE_LETTERS : LOWERCASE_LETTERS;

  // The Numbers grid is 1-indexed (jumpToNumber expects a value, not a grid
  // index); wrap it once via useCallback so every ItemTile in that 100-item
  // grid keeps receiving the same onItemClick reference across renders.
  const handleNumberItemClick = useCallback((i) => onNumberClick(i + 1), [onNumberClick]);

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
            onItemClick={handleNumberItemClick}
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

        {/* ANIMAL SOUNDS — glyph + name + the sound it makes */}
        {mode === 'animal-sounds' && (
          <AnimalSoundsGrid
            activeIndex={animalSoundsIndex}
            onItemClick={onAnimalSoundClick}
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
            renderExtra={renderColorSwatch}
          />
        )}

        {mode === 'finger-count' && (
          <FingerCountGrid
            activeIndex={fingerCountIndex}
            onItemClick={onFingerCountClick}
          />
        )}

        {/* FRACTION PUZZLE — break a shape into equal pieces, then rebuild it */}
        {mode === 'fractions' && fractionState && (
          <FractionPuzzleDisplay
            state={fractionState}
            onPickPiece={onPickFractionPiece}
            onPlacePiece={onPlaceFractionPiece}
            onNextRound={onNextFractionRound}
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
                fontSize: '2rem', '@supports (font-size: clamp(1px, 1vw, 2px))': { fontSize: 'clamp(2rem, 10vw, 8rem)' },
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

export default memo(LessonPanel);
