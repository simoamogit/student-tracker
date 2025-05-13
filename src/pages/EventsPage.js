import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, Paper, 
  Button, CircularProgress, Alert, 
  List, ListItem, ListItemText, ListItemIcon,
  Divider, Chip, IconButton, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, MenuItem,
  FormControl, InputLabel, Select
} from '@mui/material';
import {
  Event as EventIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Alarm as AlarmIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import EventService from '../services/event.service';
import { formatDate, getRelativeDateDescription } from '../utils/dateUtils';
import AuthService from '../services/auth.service';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    id: null,
    title: '',
    type: '',
    subject: '',
    date: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = AuthService.getCurrentUser();
  const isTeacher = currentUser?.role === 'teacher';

  const eventTypes = [
    { value: 'test', label: 'Verifica' },
    { value: 'exam', label: 'Esame' },
    { value: 'deadline', label: 'Scadenza' },
    { value: 'event', label: 'Evento' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Applica filtri
    let result = [...events];
    
    // Filtra per tipo
    if (filterType) {
      result = result.filter(event => event.type === filterType);
    }
    
    // Filtra per materia
    if (filterSubject) {
      result = result.filter(event => event.subject === filterSubject);
    }
    
    // Ordina per data (più vicini prima)
    result.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setFilteredEvents(result);
  }, [events, filterType, filterSubject]);

  useEffect(() => {
    // Estrai le materie uniche
    if (events.length > 0) {
      const uniqueSubjects = [...new Set(events.map(event => event.subject).filter(Boolean))];
      setSubjects(uniqueSubjects);
    }
  }, [events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await EventService.getEvents();
      setEvents(eventsData);
      setFilteredEvents(eventsData);
      
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento degli eventi:', err);
      setError('Si è verificato un errore nel caricamento degli eventi. Riprova più tardi.');
      
      // Dati di esempio in caso di errore
      const exampleEvents = [
        { id: 1, title: 'Verifica di Matematica', type: 'test', subject: 'Matematica', date: '2023-05-20', description: 'Derivate e integrali' },
        { id: 2, title: 'Consegna tema', type: 'deadline', subject: 'Italiano', date: '2023-05-18', description: 'Tema su Leopardi' },
        { id: 3, title: 'Interrogazione', type: 'exam', subject: 'Storia', date: '2023-05-25', description: 'La Seconda Guerra Mondiale' },
        { id: 4, title: 'Test di ascolto', type: 'test', subject: 'Inglese', date: '2023-05-22', description: 'Listening B2' },
        { id: 5, title: 'Laboratorio', type: 'event', subject: 'Scienze', date: '2023-05-19', description: 'Esperimento sulla fotosintesi' },
        { id: 6, title: 'Esame finale', type: 'exam', subject: 'Matematica', date: '2023-06-10', description: 'Esame di fine anno' },
        { id: 7, title: 'Consegna progetto', type: 'deadline', subject: 'Informatica', date: '2023-05-30', description: 'Progetto di programmazione' },
        { id: 8, title: 'Gita scolastica', type: 'event', subject: '', date: '2023-06-05', description: 'Visita al museo' }
      ];
      
      setEvents(exampleEvents);
      setFilteredEvents(exampleEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleFilterSubjectChange = (event) => {
    setFilterSubject(event.target.value);
  };

  const handleOpenDialog = (event = null) => {
    if (event) {
      setCurrentEvent({...event});
      setIsEditing(true);
    } else {
      setCurrentEvent({
        id: null,
        title: '',
        type: 'test',
        subject: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent({
      ...currentEvent,
      [name]: value
    });
  };

  const handleSaveEvent = async () => {
    try {
      if (isEditing) {
        await EventService.updateEvent(currentEvent.id, currentEvent);
      } else {
        await EventService.addEvent(currentEvent);
      }
      
      fetchEvents(); // Ricarica gli eventi
      handleCloseDialog();
    } catch (err) {
      console.error('Errore nel salvare l\'evento:', err);
      setError('Si è verificato un errore nel salvare l\'evento. Riprova più tardi.');
      
      // In caso di errore, simula l'aggiunta/modifica
      if (isEditing) {
        setEvents(events.map(e => e.id === currentEvent.id ? currentEvent : e));
      } else {
        const newEvent = {
          ...currentEvent,
          id: Math.max(...events.map(e => e.id)) + 1
        };
        setEvents([...events, newEvent]);
      }
      handleCloseDialog();
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo evento?')) {
      try {
        await EventService.deleteEvent(id);
        fetchEvents(); // Ricarica gli eventi
      } catch (err) {
        console.error('Errore nell\'eliminazione dell\'evento:', err);
        setError('Si è verificato un errore nell\'eliminazione dell\'evento. Riprova più tardi.');
        
        // In caso di errore, simula l'eliminazione
        setEvents(events.filter(e => e.id !== id));
      }
    }
  };

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

  // Funzione per ottenere l'etichetta del tipo di evento
  const getEventTypeLabel = (type) => {
    const eventType = eventTypes.find(et => et.value === type);
    return eventType ? eventType.label : 'Evento';
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Intestazione */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" component="h1">
                Eventi e Scadenze
              </Typography>
              {isTeacher && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Aggiungi Evento
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Filtri */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="type-filter-label">Filtra per Tipo</InputLabel>
                <Select
                  labelId="type-filter-label"
                  value={filterType}
                  onChange={handleFilterTypeChange}
                  label="Filtra per Tipo"
                >
                  <MenuItem value="">Tutti i tipi</MenuItem>
                  {eventTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="subject-filter-label">Filtra per Materia</InputLabel>
                <Select
                  labelId="subject-filter-label"
                  value={filterSubject}
                  onChange={handleFilterSubjectChange}
                  label="Filtra per Materia"
                >
                  <MenuItem value="">Tutte le materie</MenuItem>
                  {subjects.map(subject => (
                    <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                <CalendarIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {filteredEvents.length} eventi trovati
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Lista degli eventi */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <List sx={{ width: '100%' }}>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <React.Fragment key={event.id}>
                    {index > 0 && <Divider component="li" />}
                    <ListItem
                      alignItems="flex-start"
                      secondaryAction={
                        isTeacher && (
                          <Box>
                            <IconButton 
                              edge="end" 
                              aria-label="edit"
                              onClick={() => handleOpenDialog(event)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              edge="end" 
                              aria-label="delete"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )
                      }
                    >
                      <ListItemIcon>
                        {getEventIcon(event.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="subtitle1" component="span">
                              {event.title}
                            </Typography>
                            <Chip 
                              label={getEventTypeLabel(event.type)} 
                              size="small" 
                              color={
                                event.type === 'test' ? 'error' : 
                                event.type === 'exam' ? 'warning' : 
                                event.type === 'deadline' ? 'info' : 
                                'default'
                              }
                              variant="outlined"
                            />
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
                            />
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'block', mt: 1 }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {event.subject || 'Evento generale'}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.secondary"
                            >
                              {event.description || 'Nessuna descrizione'} • {formatDate(event.date)}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary="Nessun evento trovato"
                    secondary="Non ci sono eventi che corrispondono ai filtri selezionati"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialog per aggiungere/modificare evento */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Modifica Evento' : 'Aggiungi Nuovo Evento'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="title"
              label="Titolo"
              value={currentEvent.title}
              onChange={handleInputChange}
              fullWidth
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel id="event-type-label">Tipo di Evento</InputLabel>
              <Select
                labelId="event-type-label"
                name="type"
                value={currentEvent.type}
                onChange={handleInputChange}
                label="Tipo di Evento"
              >
                {eventTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              name="subject"
              label="Materia"
              value={currentEvent.subject}
              onChange={handleInputChange}
              fullWidth
              select={subjects.length > 0}
            >
              {subjects.length > 0 ? (
                [
                  <MenuItem key="none" value="">Nessuna materia</MenuItem>,
                  ...subjects.map(subject => (
                    <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                  ))
                ]
              ) : null}
            </TextField>
            
            <TextField
              name="date"
              label="Data"
              type="date"
              value={currentEvent.date}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              name="description"
              label="Descrizione"
              value={currentEvent.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button 
            onClick={handleSaveEvent} 
            variant="contained" 
            color="primary"
            disabled={!currentEvent.title || !currentEvent.type || !currentEvent.date}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventsPage;
