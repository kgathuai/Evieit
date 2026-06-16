'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

function StatPill({ icon, label, value }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 1,
        px: 0.5,
        borderRadius: 3,
        minWidth: 64,
      }}
    >
      <Box sx={{ color: 'primary.main', display: 'flex', mb: 0.25 }}>{icon}</Box>
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
        {label}
      </Typography>
      <Typography variant="subtitle2" fontWeight={700}>
        {value}
      </Typography>
    </Paper>
  );
}

export default function LessonCard({ displayData, progress, speechEnabled, accuracy }) {
  const { title, prompt, display, hint } = displayData;

  return (
    <Card id="focusPanel" elevation={2} sx={{ mb: 2 }}>
      <CardContent id="lessonCard">
        <Typography variant="h6" component="h2" id="lessonTitle" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" id="lessonPrompt" gutterBottom>
          {prompt}
        </Typography>

        <Box
          id="statusRow"
          aria-label="Learning progress"
          sx={{ display: 'flex', gap: 1, my: 1.5, flexWrap: 'wrap' }}
        >
          <StatPill icon={<StarIcon fontSize="small" />} label="Stars" value={progress.stars} />
          <StatPill icon={<TrendingUpIcon fontSize="small" />} label="Level" value={progress.level} />
          <StatPill icon={<TrackChangesIcon fontSize="small" />} label="Accuracy" value={`${accuracy}%`} />
          <StatPill
            icon={<RecordVoiceOverIcon fontSize="small" />}
            label="Narration"
            value={speechEnabled ? 'On' : 'Off'}
          />
        </Box>

        <Divider sx={{ my: 1 }} />

        <Paper
          id="lessonDisplay"
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 100%)',
            border: '2px dashed',
            borderColor: 'primary.light',
            borderRadius: 4,
            py: 4,
            px: 2,
            textAlign: 'center',
            my: 1.5,
          }}
        >
          <Typography variant="h2" component="div" color="primary.dark" fontWeight={800}>
            {display}
          </Typography>
        </Paper>

        <Typography variant="caption" color="text.secondary" id="lessonHint">
          {hint}
        </Typography>
      </CardContent>
    </Card>
  );
}
