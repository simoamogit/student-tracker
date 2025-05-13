import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, Paper, 
  Button, CircularProgress, Alert, 
  Tabs, Tab, IconButton, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, MenuItem,
  FormControl, InputLabel, Select
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';
import ScheduleService from '../services/schedule.service';
import WeeklySchedule from '../components/dashboard/WeeklySchedule';
import AuthService from '../services/auth.service';

const SchedulePage = () => {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentLesson, setCurrentLesson] = useState({
    day: '',
    hour: '',
    subject: '',
    teacher: '',
    room: ''
  });
  const currentUser = AuthService.getCurrentUser();
  const isTeacher = currentUser?.role === 'teacher';

  const weekDays = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00'];
  const subjects = [
    'Matematica', 'Italiano', 'Storia', 'Geografia', 'Scienze', 
    'Inglese', 'Arte', 'Musica', 'Educazione Fisica', 'Religione',
    'Informatica', 'Fisica', 'Chimica', 'Filosofia', 'Latino'
  ];

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const scheduleData = await ScheduleService.getWeeklySchedule();
      setSchedule(scheduleData);
      
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento dell\'orario:', err);
      setError('Si è verificato un errore nel caricamento dell\'orario. Riprova più tardi.');
      
      // Dati di esempio in caso di errore
      setSchedule({
        'Lunedì': {
          '8:00': { subject: 'Matematica', teacher: 'Rossi', room: '101' },
          '9:00': { subject: 'Matematica', teacher: 'Rossi', room: '101' },
          '10:00': { subject: 'Italiano', teacher: 'Bianchi', room: '102' },
          '11:00': { subject: 'Storia', teacher: 'Verdi', room: '103' },
          '12:00': { subject: 'Inglese', teacher: 'Smith', room: '104' },
          '13:00': null
        },
        'Martedì': {
          '8:00': { subject: 'Scienze', teacher: 'Neri', room: '105' },
          '9:00': { subject: 'Scienze', teacher: 'Neri', room: '105' },
          '10:00': { subject: 'Matematica', teacher: 'Rossi', room: '101' },
          '11:00': { subject: 'Italiano', teacher: 'Bianchi', room: '102' },
          '12:00': { subject: 'Italiano', teacher: 'Bianchi', room: '102' },
          '13:00': null
        },
        'Mercoledì': {
          '8:00': { subject: 'Storia', teacher: 'Verdi', room: '103' },
          '9:00': { subject: 'Inglese', teacher: 'Smith', room: '104' },
          '10:00': { subject: 'Inglese', teacher: 'Smith', room: '104' },
          '11:00': { subject: 'Matematica', teacher: 'Rossi', room: '101' },
          '12:00': { subject: 'Educazione Fisica', teacher: 'Blu', room: 'Palestra' },
          '13:00': null
        },
        'Giovedì': {
          '8:00': { subject: 'Italiano', teacher: 'Bianchi', room: '102' },
          '9:00': { subject: 'Storia', teacher: 'Verdi', room: '103' },
          '10:00': { subject: 'Scienze', teacher: 'Neri', room: '105' },
          '11:00': { subject: 'Arte', teacher: 'Gialli', room: '106' },
          '12:00': { subject: 'Arte', teacher: 'Gialli', room: '106' },
          '13:00': null
        },
        'Venerdì': {
          '8:00': { subject: 'Matematica', teacher: 'Rossi', room: '101' },
          '9:00': { subject: 'Italiano', teacher: 'Bianchi', room: '102' },
          '10:00': { subject: 'Inglese', teacher: 'Smith', room: '104' },
          '11:00': { subject: 'Scienze', teacher: 'Neri', room: '105' },
          '12:00': { subject: 'Educazione Fisica', teacher: 'Blu', room: 'Palestra' },
          '13:00': null
        },
        'Sabato': {
          '8:00': { subject: 'Storia', teacher: 'Verdi', room: '103' },
          '9:00': { subject: 'Matematica', teacher: 'Rossi', room: '101' },
          '10:00': { subject: 'Italiano', teacher: 'Bianchi', room: '102' },
          '11:00': { subject: 'Religione', teacher: 'Viola', room: '107' },
          '12:00': null,
          '13:00': null
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleOpenDialog = (day, hour) => {
    const lesson = schedule[day]?.[hour] || { subject: '', teacher: '', room: '' };
    setCurrentLesson({
      day,
      hour,
      subject: lesson.subject || '',
      teacher: lesson.teacher || '',
      room: lesson.room || ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLesson({
      ...currentLesson,
      [name]: value
    });
  };

  const handleSaveLesson = async () => {
    try {
      const { day, hour, ...lessonData } = currentLesson;
      
      // Se tutti i campi sono vuoti, imposta la lezione a null
      const updatedLesson = 
        lessonData.subject === '' && 
        lessonData.teacher === '' && 
        lessonData.room === '' 
          ? null 
          : lessonData;
      
      await ScheduleService.updateLesson(day, hour, updatedLesson);
      
      // Aggiorna lo stato locale
      setSchedule(prevSchedule => ({
        ...prevSchedule,
        [day]: {
                      ...prevSchedule[day],
          [hour]: updatedLesson
        }
      }));
      
      handleCloseDialog();
    } catch (err) {
      console.error('Errore nel salvare la lezione:', err);
      setError('Si è verificato un errore nel salvare la lezione. Riprova più tardi.');
      
      // In caso di errore, aggiorna comunque lo stato locale
      const { day, hour, ...lessonData } = currentLesson;
      const updatedLesson = 
        lessonData.subject === '' && 
        lessonData.teacher === '' && 
        lessonData.room === '' 
          ? null 
          : lessonData;
      
      setSchedule(prevSchedule => ({
        ...prevSchedule,
        [day]: {
          ...prevSchedule[day],
          [hour]: updatedLesson
        }
      }));
      
      handleCloseDialog();
    }
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
                Orario Settimanale
              </Typography>
              {isTeacher && (
                <Typography variant="body2" color="text.secondary">
                  Clicca su una cella per modificare una lezione
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Tabs per i giorni della settimana */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="giorni della settimana"
            >
              {weekDays.map((day, index) => (
                <Tab key={day} label={day} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />
              ))}
            </Tabs>
          </Paper>
        </Grid>
        
        {/* Contenuto del giorno selezionato */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            {weekDays.map((day, index) => (
              <Box
                key={day}
                role="tabpanel"
                hidden={currentTab !== index}
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
              >
                {currentTab === index && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Orario di {day}
                    </Typography>
                    
                    <Box sx={{ mt: 3 }}>
                      <Grid container spacing={2}>
                        {hours.map(hour => (
                          <Grid item xs={12} key={hour}>
                            <Paper 
                              elevation={1} 
                              sx={{ 
                                p: 2, 
                                display: 'flex', 
                                alignItems: 'center',
                                backgroundColor: schedule[day][hour] ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                                cursor: isTeacher ? 'pointer' : 'default',
                                '&:hover': {
                                  backgroundColor: isTeacher ? 'rgba(0, 0, 0, 0.05)' : undefined
                                }
                              }}
                              onClick={isTeacher ? () => handleOpenDialog(day, hour) : undefined}
                            >
                              <Box sx={{ width: '80px', fontWeight: 'bold' }}>
                                {hour}
                              </Box>
                              
                              {schedule[day][hour] ? (
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="subtitle1">
                                    {schedule[day][hour].subject}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Prof. {schedule[day][hour].teacher} • Aula {schedule[day][hour].room}
                                  </Typography>
                                </Box>
                              ) : (
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body1" color="text.secondary">
                                    Nessuna lezione
                                  </Typography>
                                </Box>
                              )}
                              
                              {isTeacher && (
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDialog(day, hour);
                                  }}
                                >
                                  {schedule[day][hour] ? <EditIcon /> : <AddIcon />}
                                </IconButton>
                              )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
        </Grid>
        
        {/* Visualizzazione settimanale */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Panoramica Settimanale
            </Typography>
            <WeeklySchedule schedule={schedule} />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialog per modificare una lezione */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentLesson.subject 
            ? `Modifica Lezione - ${currentLesson.day} ${currentLesson.hour}` 
            : `Aggiungi Lezione - ${currentLesson.day} ${currentLesson.hour}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="subject-label">Materia</InputLabel>
              <Select
                labelId="subject-label"
                name="subject"
                value={currentLesson.subject}
                onChange={handleInputChange}
                label="Materia"
              >
                <MenuItem value="">Nessuna materia</MenuItem>
                {subjects.map(subject => (
                  <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              name="teacher"
              label="Docente"
              value={currentLesson.teacher}
              onChange={handleInputChange}
              fullWidth
            />
            
            <TextField
              name="room"
              label="Aula"
              value={currentLesson.room}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button 
            onClick={handleSaveLesson} 
            variant="contained" 
            color="primary"
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SchedulePage;
        