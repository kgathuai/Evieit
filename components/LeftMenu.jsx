'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { MODULE_ORDER } from '../hooks/useUniLearn';

const MODULE_LABELS = {
  alphabet: 'Alphabet A-Z',
  numbers: 'Learn Maths',
  words: 'A for Apple',
  fruits: 'Fruits',
  animals: 'Domestic Animals',
  'wild-animals': 'Wild Animals',
  vowels: 'Vowels',
  shapes: 'Shapes',
  colors: 'Colors',
  vehicles: 'Vehicles',
  foods: 'Foods',
  clothes: 'Clothes',
  'finger-count': 'Finger Count',
  next: "What's Next?",
  find: 'Find the Letter',
};

export default function LeftMenu({ focusedIndex, onOpen, onSelectChange }) {
  function handleChange(e) {
    const idx = MODULE_ORDER.indexOf(e.target.value);
    if (idx >= 0) onSelectChange(idx);
  }

  function handleOpen() {
    onOpen(MODULE_ORDER[focusedIndex]);
  }

  return (
    <Card
      component="aside"
      aria-label="Lesson menu"
      elevation={3}
      sx={{ minWidth: 220, maxWidth: 260, flexShrink: 0, borderRadius: 3 }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookIcon color="primary" sx={{ fontSize: '2.2rem' }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 900, color: 'primary.main' }}>
            📚 Menu
          </Typography>
        </Box>

        <FormControl fullWidth size="small">
          <InputLabel id="moduleSelect-label" sx={{ fontSize: '0.95rem', fontWeight: 700 }}>Choose activity</InputLabel>
          <Select
            labelId="moduleSelect-label"
            id="moduleSelect"
            value={MODULE_ORDER[focusedIndex]}
            label="Choose activity"
            onChange={handleChange}
            sx={{ fontSize: '1.05rem', fontWeight: 700 }}
          >
            {MODULE_ORDER.map((key) => (
              <MenuItem key={key} value={key} sx={{ fontSize: '1rem', fontWeight: 700 }}>
                {MODULE_LABELS[key]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          id="openFromDropdown"
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleOpen}
          sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 900 }}
        >
          🎮 Open Selected
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, textAlign: 'center' }}>
          💡 Use arrows, then Enter/OK.
        </Typography>
      </CardContent>
    </Card>
  );
}
