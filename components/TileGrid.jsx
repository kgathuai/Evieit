import { memo } from 'react';
import { Box, Card, CardActionArea, CardContent, Typography, Stack } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Filter1Icon from '@mui/icons-material/Filter1';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SearchIcon from '@mui/icons-material/Search';
import AbcIcon from '@mui/icons-material/Abc';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import PetsIcon from '@mui/icons-material/Pets';
import ParkIcon from '@mui/icons-material/Park';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import CategoryIcon from '@mui/icons-material/Category';
import PaletteIcon from '@mui/icons-material/Palette';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import PanToolIcon from '@mui/icons-material/PanTool';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';

const TILES = [
  { key: 'alphabet',  title: 'Alphabet A-Z',  desc: 'Letters, sounds, and recognition',  icon: <AutoStoriesIcon />, color: '#fff9c4' },
  { key: 'numbers',   title: 'Learn Maths',   desc: 'Numbers 1-100 and counting skills',   icon: <Filter1Icon />,     color: '#e8f5e9' },
  { key: 'words',     title: 'A for Apple',   desc: 'Letters and their words',            icon: <AbcIcon />,         color: '#ede7f6' },
  { key: 'fruits',    title: 'Fruits',         desc: 'Learn fruit names and shapes',       icon: <LocalFloristIcon />,color: '#fce4ec' },
  { key: 'animals',   title: 'Domestic Animals', desc: 'Learn common home and farm animals', icon: <PetsIcon />,     color: '#f3e5f5' },
  { key: 'wild-animals', title: 'Wild Animals', desc: 'Learn animals from the wild',       icon: <ParkIcon />,       color: '#e8f5e9' },
  { key: 'animal-sounds', title: 'Animal Sounds', desc: 'What sound does each animal make?', icon: <VolumeUpIcon />, color: '#fbe9e7' },
  { key: 'vowels',      title: 'Vowels',         desc: 'Syllables: ba, be, bi, bo, bu',     icon: <SpellcheckIcon />, color: '#fce4ec' },
  { key: 'shapes',      title: 'Shapes',         desc: 'Circle, square, triangle and more', icon: <CategoryIcon />,  color: '#e1f5fe' },
  { key: 'colors',      title: 'Colors',         desc: 'Learn common color names',          icon: <PaletteIcon />,   color: '#f3e5f5' },
  { key: 'vehicles',    title: 'Vehicles',       desc: 'Cars, buses, planes and more',      icon: <DirectionsCarIcon />, color: '#e8eaf6' },
  { key: 'foods',       title: 'Foods',          desc: 'Everyday foods and meals',          icon: <RestaurantIcon />, color: '#fff8e1' },
  { key: 'clothes',     title: 'Clothes',        desc: 'Shirts, pants, shoes and more',     icon: <CheckroomIcon />, color: '#f3e5f5' },
  { key: 'finger-count',title: 'Finger Count',   desc: 'Count 1 to 10 with fingers',        icon: <PanToolIcon />, color: '#f1f8e9' },
  { key: 'fractions',   title: 'Fraction Puzzle', desc: 'Break shapes into equal parts and rebuild them', icon: <PieChartOutlineIcon />, color: '#ffe8d6' },
  { key: 'next',        title: "What's Next?",  desc: 'Logic sequence challenge',           icon: <EmojiObjectsIcon />,color: '#e3f2fd' },
  { key: 'find',      title: 'Find the Letter',desc: 'Spot the correct letter fast',      icon: <SearchIcon />,      color: '#fff3e0' },
];

/**
 * A single lesson tile. Memoized so that moving focus across the menu only
 * re-renders the previously-focused and newly-focused cards, not all 17 —
 * `onOpen`/`onHover` are stabilized by the hook so this bail-out actually fires.
 */
const TileCard = memo(function TileCard({ tile, index, isFocused, onOpen, onHover }) {
  return (
    <Card
      elevation={isFocused ? 8 : 3}
      sx={{
        background: tile.color,
        border: '3px solid',
        borderColor: isFocused ? 'primary.main' : 'transparent',
        transition: 'all 0.2s ease',
        transform: isFocused ? 'translateX(6px) scale(1.02)' : 'translateX(0)',
        minHeight: '6rem',
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isFocused ? '0 12px 28px rgba(255, 107, 107, 0.3)' : '0 6px 16px rgba(0,0,0,0.1)',
      }}
    >
      <CardActionArea
        data-tile={tile.key}
        onClick={() => onOpen(tile.key)}
        onMouseEnter={() => onHover(index)}
        sx={{ flex: 1, display: 'flex', alignItems: 'stretch' }}
      >
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2, '@supports not (gap: 1px)': { '& > *:not(:last-child)': { marginRight: '1rem' } },
            width: '100%',
            py: 2,
            px: 2.5,
          }}
        >
          <Box
            sx={{
              color: isFocused ? 'primary.main' : 'text.secondary',
              transition: 'color 0.2s',
              flexShrink: 0,
              fontSize: '2.2rem',
            }}
          >
            {tile.icon}
          </Box>
          <Box>
            <Typography
              variant="h6"
              fontWeight={900}
              color={isFocused ? 'primary.dark' : 'primary.main'}
              sx={{ fontSize: '1.35rem' }}
            >
              {tile.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {tile.desc}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

function TileGrid({ focusedIndex, onOpen, onHover }) {
  return (
    <Box
      component="section"
      id="tileGrid"
      aria-label="Learning modules"
      sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, '@supports not (gap: 1px)': { '& > *:not(:last-child)': { marginBottom: '0.75rem' } }, height: '100%' }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
        Choose a lesson
      </Typography>

      <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto', pr: 0.5 }}>
        {TILES.map((tile, index) => (
          <TileCard
            key={tile.key}
            tile={tile}
            index={index}
            isFocused={index === focusedIndex}
            onOpen={onOpen}
            onHover={onHover}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default memo(TileGrid);
