import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Chip,
  Tooltip,
  useTheme
} from '@mui/material';
import { 
  AccessTime as TimeIcon,
  Room as RoomIcon,
  Person as TeacherIcon
} from '@mui/icons-material';

const WeeklySchedule = ({ schedule, currentDay = new Date().getDay() }) => {
  const theme = useTheme();
  
  // Giorni della settimana
  const weekDays = [
    { id: 1, name: 'Lunedì', shortName: 'LUN' },
    { id: 2, name: 'Martedì', shortName: 'MAR' },
    { id: 3, name: 'Mercoledì', shortName: 'MER' },
    { id: 4, name: 'Giovedì', shortName: 'GIO' },
    { id: 5, name: 'Venerdì', shortName: 'VEN' },
    { id: 6, name: 'Sabato', shortName: 'SAB' },
    { id: 0, name: 'Domenica', shortName: 'DOM' }
  ];

  // Orari delle lezioni
  const timeSlots = [
    { id: 1, start: '08:00', end: '09:00' },
    { id: 2, start: '09:00', end: '10:00' },
    { id: 3, start: '10:00', end: '11:00' },
    { id: 4, start: '11:00', end: '12:00' },
    { id: 5, start: '12:00', end: '13:00' },
    { id: 6, start: '13:00', end: '14:00' }
  ];

  // Funzione per ottenere la lezione in un determinato giorno e orario
  const getLessonForTimeSlot = (dayId, timeSlotId) => {
    if (!schedule) return null;
    
    return schedule.find(lesson => 
      lesson.day === dayId && 
      lesson.timeSlot === timeSlotId
    );
  };

  // Funzione per ottenere il colore della materia
  const getSubjectColor = (subjectName) => {
    if (!subjectName) return theme.palette.grey[500];
    
    // Mappa delle materie con colori
    const subjectColors = {
      'Matematica': '#4caf50',
      'Italiano': '#f44336',
      'Storia': '#ff9800',
      'Geografia': '#2196f3',
      'Scienze': '#9c27b0',
      'Inglese': '#3f51b5',
      'Arte': '#e91e63',
      'Educazione Fisica': '#009688',
      'Tecnologia': '#607d8b',
      'Musica': '#795548',
      'Religione': '#ffeb3b',
      'Fisica': '#673ab7',
      'Chimica': '#8bc34a',
      'Informatica': '#00bcd4',
      'Diritto': '#ff5722',
      'Economia': '#9e9e9e'
    };
    
    // Restituisci il colore se esiste, altrimenti un colore casuale
    return subjectColors[subjectName] || theme.palette.primary.main;
  };

  return (
    <Paper elevation={3} sx={{ p: 2, overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Orario Settimanale
      </Typography>
      
      <Box sx={{ overflowX: 'auto' }}>
        <Grid container spacing={1}>
          {/* Intestazione con i giorni */}
          <Grid item xs={1}>
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TimeIcon color="action" />
            </Box>
          </Grid>
          
          {weekDays.filter(day => day.id !== 0).map(day => (
            <Grid item xs={1.8} key={day.id}>
              <Paper 
                elevation={day.id === currentDay ? 3 : 0}
                sx={{ 
                  p: 1, 
                  textAlign: 'center',
                  bgcolor: day.id === currentDay ? 'primary.light' : 'background.paper',
                  color: day.id === currentDay ? 'primary.contrastText' : 'text.primary',
                  fontWeight: day.id === currentDay ? 'bold' : 'normal'
                }}
              >
                <Typography variant="subtitle2">{day.shortName}</Typography>
              </Paper>
            </Grid>
          ))}
          
          {/* Righe con gli orari e le lezioni */}
          {timeSlots.map(timeSlot => (
            <React.Fragment key={timeSlot.id}>
              {/* Colonna dell'orario */}
              <Grid item xs={1}>
                <Box sx={{ 
                  p: 1, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRight: 1,
                  borderColor: 'divider'
                }}>
                  <Typography variant="caption" color="text.secondary">
                    {timeSlot.start}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {timeSlot.end}
                  </Typography>
                </Box>
              </Grid>
              
              {/* Colonne con le lezioni per ogni giorno */}
              {weekDays.filter(day => day.id !== 0).map(day => {
                const lesson = getLessonForTimeSlot(day.id, timeSlot.id);
                
                return (
                  <Grid item xs={1.8} key={`${day.id}-${timeSlot.id}`}>
                    {lesson ? (
                      <Tooltip 
                        title={
                          <>
                            <Typography variant="subtitle2">{lesson.subject}</Typography>
                            <Typography variant="body2">
                              <TeacherIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {lesson.teacher}
                            </Typography>
                            <Typography variant="body2">
                              <RoomIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {lesson.room}
                            </Typography>
                            <Typography variant="body2">
                              <TimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                              {timeSlot.start} - {timeSlot.end}
                            </Typography>
                          </>
                        }
                        arrow
                      >
                        <Paper 
                          sx={{ 
                            p: 1, 
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: getSubjectColor(lesson.subject) + '22',
                            borderLeft: 3,
                            borderColor: getSubjectColor(lesson.subject),
                            '&:hover': {
                              bgcolor: getSubjectColor(lesson.subject) + '33',
                            }
                          }}
                        >
                          <Typography variant="body2" noWrap sx={{ fontWeight: 'medium' }}>
                            {lesson.subject}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <RoomIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
                            <Typography variant="caption" color="text.secondary">
                              {lesson.room}
                            </Typography>
                          </Box>
                        </Paper>
                      </Tooltip>
                    ) : (
                      <Paper 
                        sx={{ 
                          p: 1, 
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          bgcolor: 'background.default',
                          border: '1px dashed',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="caption" color="text.disabled">
                          -
                        </Typography>
                      </Paper>
                    )}
                  </Grid>
                );
              })}
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default WeeklySchedule;
