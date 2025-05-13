import React from 'react';
import { 
  Box, Paper, Typography, List, ListItem, ListItemText, 
  ListItemIcon, Divider, Chip, useTheme 
} from '@mui/material';
import {
  Event as EventIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Alarm as AlarmIcon
} from '@mui/icons-material';
import { formatDate, getRelativeDateDescription } from '../../utils/dateUtils';

const UpcomingEvents = ({ events, title = 'Eventi Imminenti', maxItems = 5 }) => {
  const theme = useTheme();

  // Funzione per determinare l'icona in base al tipo di evento
  const getEventIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'test':
      case 'verifica':
        return <AssignmentIcon color="error" />;
      case 'exam':
      case 'esame':
        return <SchoolIcon color="warning" />;
      case 'deadline':
      case 'scadenza':
        return <AlarmIcon color="info" />;
      default:
        return <EventIcon color="primary" />;
    }
  };

  if (!events || events.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          Nessun evento imminente.
        </Typography>
      </Paper>
    );
  }

  // Ordina gli eventi per data (più vicini prima)
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  // Limita il numero di eventi da visualizzare
  const displayEvents = sortedEvents.slice(0, maxItems);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <List sx={{ width: '100%' }}>
        {displayEvents.map((event, index) => (
          <React.Fragment key={event.id || index}>
            {index > 0 && <Divider component="li" />}
            <ListItem
              alignItems="flex-start"
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>
                {getEventIcon(event.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" component="span">
                      {event.title}
                    </Typography>
                    <Chip 
                      label={getRelativeDateDescription(event.date)} 
                      size="small" 
                      color={
                        getRelativeDateDescription(event.date) === 'Oggi' ? 'error' : 
                        getRelativeDateDescription(event.date) === 'Domani' ? 'warning' : 
                        'default'
                      }
                      variant={
                        getRelativeDateDescription(event.date) === 'Oggi' || 
                        getRelativeDateDescription(event.date) === 'Domani' 
                          ? 'filled' 
                          : 'outlined'
                      }
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
                      {event.subject || event.category || 'Evento generale'}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {event.description || ''} • {formatDate(event.date)}
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

export default UpcomingEvents;
    