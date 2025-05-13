import React from 'react';
import { 
  Box, Paper, Typography, List, ListItem, ListItemText, 
  Divider, Chip, useTheme, Avatar 
} from '@mui/material';
import { formatDate, getRelativeDateDescription } from '../../utils/dateUtils';

const RecentGrades = ({ grades, title = 'Voti Recenti', maxItems = 5 }) => {
  const theme = useTheme();

  // Funzione per determinare il colore del voto
  const getGradeColor = (value) => {
    if (value >= 8) return theme.palette.success.main;
    if (value >= 6) return theme.palette.info.main;
    if (value >= 5) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Funzione per determinare il background del voto
  const getGradeBackground = (value) => {
    if (value >= 8) return theme.palette.success.light;
    if (value >= 6) return theme.palette.info.light;
    if (value >= 5) return theme.palette.warning.light;
    return theme.palette.error.light;
  };

  if (!grades || grades.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          Nessun voto recente disponibile.
        </Typography>
      </Paper>
    );
  }

  // Ordina i voti per data (più recenti prima)
  const sortedGrades = [...grades].sort((a, b) => new Date(b.date) - new Date(a.date));
  // Limita il numero di voti da visualizzare
  const displayGrades = sortedGrades.slice(0, maxItems);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <List sx={{ width: '100%' }}>
        {displayGrades.map((grade, index) => (
          <React.Fragment key={grade.id || index}>
            {index > 0 && <Divider component="li" />}
            <ListItem
              alignItems="flex-start"
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <Avatar 
                sx={{ 
                  mr: 2, 
                  bgcolor: getGradeBackground(grade.value),
                  color: getGradeColor(grade.value),
                  fontWeight: 'bold'
                }}
              >
                {grade.value.toFixed(1)}
              </Avatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" component="span">
                      {grade.subject}
                    </Typography>
                    <Chip 
                      label={getRelativeDateDescription(grade.date)} 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'block' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {grade.description || 'Verifica'}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {grade.teacher ? `Prof. ${grade.teacher}` : ''} • {formatDate(grade.date)}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default RecentGrades;
