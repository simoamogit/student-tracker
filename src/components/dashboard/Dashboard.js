import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, Paper, 
  Button, CircularProgress, Alert 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GradeService from '../services/grade.service';
import EventService from '../services/event.service';
import ScheduleService from '../services/schedule.service';
import GradeStats from '../components/dashboard/GradeStats';
import RecentGrades from '../components/grades/RecentGrades';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import WeeklySchedule from '../components/dashboard/WeeklySchedule';
import GradeChart from '../components/grades/GradeChart';
import AuthService from '../services/auth.service';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gradeStats, setGradeStats] = useState(null);
  const [recentGrades, setRecentGrades] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState(null);
  const [allGrades, setAllGrades] = useState([]);
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Carica le statistiche dei voti
        const statsResponse = await GradeService.getStats();
        setGradeStats(statsResponse);
        
        // Carica i voti recenti
        const recentGradesResponse = await GradeService.getRecentGrades(5);
        setRecentGrades(recentGradesResponse);
        
        // Carica tutti i voti per il grafico
        const allGradesResponse = await GradeService.getGrades();
        setAllGrades(allGradesResponse);
        
        // Carica gli eventi imminenti
        const eventsResponse = await EventService.getUpcomingEvents(5);
        setUpcomingEvents(eventsResponse);
        
        // Carica l'orario settimanale
        const scheduleResponse = await ScheduleService.getWeeklySchedule();
        setWeeklySchedule(scheduleResponse);
        
        setError(null);
      } catch (err) {
        console.error('Errore nel caricamento dei dati della dashboard:', err);
        setError('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
        
        // Carica dati di esempio in caso di errore
        setGradeStats({
          overall: {
            count: 25,
            average: 7.2,
            highest: 9.5,
            lowest: 4.0,
            trend: 0.3
          },
          distribution: {
            insufficient: 4,
            sufficient: 8,
            good: 9,
            excellent: 4
          }
        });
        
        setRecentGrades([
          { id: 1, subject: 'Matematica', value: 7.5, date: '2023-05-10', description: 'Verifica sui limiti', teacher: 'Rossi' },
          { id: 2, subject: 'Italiano', value: 8.0, date: '2023-05-08', description: 'Tema argomentativo', teacher: 'Bianchi' },
          { id: 3, subject: 'Storia', value: 6.5, date: '2023-05-05', description: 'Interrogazione', teacher: 'Verdi' },
          { id: 4, subject: 'Inglese', value: 9.0, date: '2023-05-03', description: 'Reading comprehension', teacher: 'Smith' },
          { id: 5, subject: 'Scienze', value: 5.5, date: '2023-04-28', description: 'Verifica sul DNA', teacher: 'Neri' }
        ]);
        
        setAllGrades([
          { id: 1, subject: 'Matematica', value: 7.5, date: '2023-05-10' },
          { id: 2, subject: 'Italiano', value: 8.0, date: '2023-05-08' },
          { id: 3, subject: 'Storia', value: 6.5, date: '2023-05-05' },
          { id: 4, subject: 'Inglese', value: 9.0, date: '2023-05-03' },
          { id: 5, subject: 'Scienze', value: 5.5, date: '2023-04-28' },
          { id: 6, subject: 'Matematica', value: 6.0, date: '2023-04-20' },
          { id: 7, subject: 'Italiano', value: 7.5, date: '2023-04-15' },
          { id: 8, subject: 'Storia', value: 7.0, date: '2023-04-10' },
          { id: 9, subject: 'Inglese', value: 8.5, date: '2023-04-05' },
          { id: 10, subject: 'Scienze', value: 6.5, date: '2023-03-30' }
        ]);
        
        setUpcomingEvents([
          { id: 1, title: 'Verifica di Matematica', type: 'test', subject: 'Matematica', date: '2023-05-20', description: 'Derivate e integrali' },
          { id: 2, title: 'Consegna tema', type: 'deadline', subject: 'Italiano', date: '2023-05-18', description: 'Tema su Leopardi' },
          { id: 3, title: 'Interrogazione', type: 'exam', subject: 'Storia', date: '2023-05-25', description: 'La Seconda Guerra Mondiale' },
          { id: 4, title: 'Test di ascolto', type: 'test', subject: 'Inglese', date: '2023-05-22', description: 'Listening B2' },
          { id: 5, title: 'Laboratorio', type: 'event', subject: 'Scienze', date: '2023-05-19', description: 'Esperimento sulla fotosintesi' }
        ]);
        
        setWeeklySchedule({
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

    fetchDashboardData();
  }, []);

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
      
      {/* Intestazione con benvenuto */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" component="h1" gutterBottom>
              Benvenuto, {currentUser?.firstName || 'Studente'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ecco un riepilogo della tua situazione scolastica
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/grades')}
          >
            Visualizza tutti i voti
          </Button>
        </Box>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Statistiche dei voti */}
        <Grid item xs={12} md={6}>
          <GradeStats stats={gradeStats} />
        </Grid>
        
        {/* Voti recenti */}
        <Grid item xs={12} md={6}>
          <RecentGrades grades={recentGrades} />
        </Grid>
        
        {/* Grafico dei voti */}
        <Grid item xs={12}>
          <GradeChart grades={allGrades} />
        </Grid>
        
        {/* Eventi imminenti */}
        <Grid item xs={12} md={6}>
          <UpcomingEvents events={upcomingEvents} />
        </Grid>
        
        {/* Orario settimanale */}
        <Grid item xs={12} md={6}>
          <WeeklySchedule schedule={weeklySchedule} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
