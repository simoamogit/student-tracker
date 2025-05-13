import React, { useState } from 'react';
import {
  Paper, List, ListItem, ListItemText, ListItemIcon, 
  IconButton, Chip, Typography, Divider, Box,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment, Event, School, CalendarToday
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

const EventList = ({ events, onEdit, onDelete }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Funzione per ottenere l'icona in base al tipo di evento
  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'exam':
        return <Assignment color="error" />;
      case 'homework':
        return <School color="primary" />;
      case 'meeting':
        return <Event color="secondary" />;
      default:
        return <CalendarToday color="action" />;
    }
  };

  // Funzione per ottenere il colore del chip in base al tipo di evento
  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'exam':
        return 'error';
      case 'homework':
        return 'primary';
      case 'meeting':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Funzione per ottenere l'etichetta in base al tipo di evento
  const getEventTypeLabel = (eventType) => {
    switch (eventType) {
      case 'exam':
        return 'Verifica';
      case 'homework':
        return 'Compito';
      case 'meeting':
        return 'Riunione';
      default:
        return 'Evento';
    }
  };

  const handleOpenDeleteDialog = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const confirmDelete = () => {
    onDelete(eventToDelete._id);
    handleCloseDeleteDialog();
  };

  // Raggruppa gli eventi per data
  const groupedEvents = events.reduce((acc, event) => {
    const date = event.start_date.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});

  // Ordina le date
  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <>
      <Paper sx={{ p: 2 }}>
        {sortedDates.length > 0 ? (
          sortedDates.map((date, index) => (
            <Box key={date}>
              {index > 0 && <Divider sx={{ my: 2 }} />}
              
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: 'grey.100', 
                  p: 1, 
                  borderRadius: 1 
                }}
              >
                <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                {formatDate(date)}
              </Typography>
              
              <List>
                {groupedEvents[date].map((event) => (
                  <ListItem key={event._id} alignItems="flex-start">
                    <ListItemIcon>
                      {getEventIcon(event.event_type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Typography variant="body1" component="span">
                            {event.title}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={getEventTypeLabel(event.event_type)} 
                            color={getEventColor(event.event_type)} 
                            sx={{ ml: 1, mr: 1 }}
                          />
                          {event.subject && (
                            <Chip 
                              size="small" 
                              label={event.subject} 
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                          >
                            {event.start_date.split('T')[1].substring(0, 5)}
                            {event.end_date && ` - ${event.end_date.split('T')[1].substring(0, 5)}`}
                          </Typography>
                          {event.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {event.description}
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <Box>
                      <IconButton 
                        edge="end" 
                        aria-label="edit" 
                        onClick={() => onEdit(event)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={() => handleOpenDeleteDialog(event)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="textSecondary">
              Nessun evento programmato
            </Typography>
          </Box>
        )}
      </Paper>
      
      {/* Dialog di conferma eliminazione */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare questo evento? Questa azione non può essere annullata.
          </DialogContentText>
          {eventToDelete && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Titolo:</strong> {eventToDelete.title}
              </Typography>
              <Typography variant="body2">
                <strong>Data:</strong> {formatDate(eventToDelete.start_date.split('T')[0])}
              </Typography>
              <Typography variant="body2">
                <strong>Tipo:</strong> {getEventTypeLabel(eventToDelete.event_type)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annulla</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventList;