import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box,
  CircularProgress, Divider, Chip, useTheme, useMediaQuery
} from '@mui/material';
import GradeService from '../services/grade.service';
import EventService from '../services/event.service';
import ScheduleService from '../services/schedule.service';
import AuthService from '../services/auth.service';
import GradeStats from '../components/dashboard/GradeStats';
import UpcomingEvents from '../components/dashboard/UpcomingEvents';
import DailySchedule from '../components/schedule/DailySchedule';
import { formatDate } from '../utils/dateUtils';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [error, setError] = useState('');
  const currentUser = AuthService.getCurrentUser();
  const currentSchoolYear = currentUser?.school_year?.current || '';
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Carica i dati in parallelo
        const [statsData, eventsData, scheduleData] = await Promise.all([
          GradeService.getStats({ school_year: currentSchoolYear }),
          EventService.getUpcomingEvents(7, currentSchoolYear),
          ScheduleService.getTodaySchedule(currentSchoolYear)
        ]);
        
        setStats(statsData);
        setEvents(eventsData);
        setTodaySchedule(scheduleData);
      } catch (err) {
        console.error('Errore nel caricamento dei dati della dashboard:', err);
        setError('Impossibile caricare i dati. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentSchoolYear]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>Benvenuto, {currentUser?.name || 'Studente'}</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Anno scolastico: {currentSchoolYear || 'Non impostato'}
        </Typography>
      </Box>
      
      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Statistiche dei voti */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              borderRadius: 2,
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            <Typography variant="h6" gutterBottom>Andamento Voti</Typography>
            <Divider sx={{ mb: 2 }} />
            {stats ? (
              <GradeStats stats={stats} />
            ) : (
              <Typography variant="body2" color="textSecondary">
                Nessun voto registrato per questo anno scolastico.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Orario di oggi */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              borderRadius: 2,
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            <Typography variant="h6" gutterBottom>Orario di Oggi</Typography>
            <Divider sx={{ mb: 2 }} />
            {todaySchedule.length > 0 ? (
              <DailySchedule scheduleItems={todaySchedule} />
            ) : (
              <Typography variant="body2" color="textSecondary">
                Nessuna lezione oggi o orario non configurato.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Prossimi eventi */}
        <Grid item xs={12}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 2,
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: 6
              }
            }}
          >
            <Typography variant="h6" gutterBottom>Prossimi Eventi</Typography>
            <Divider sx={{ mb: 2 }} />
            {events.length > 0 ? (
              <UpcomingEvents events={events} />
            ) : (
              <Typography variant="body2" color="textSecondary">
                Nessun evento imminente.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
