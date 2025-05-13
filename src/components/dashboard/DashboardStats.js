import React from 'react';
import { Grid, Box, Typography, Paper, CircularProgress } from '@mui/material';

const DashboardStats = ({ stats }) => {
  if (!stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Funzione per determinare il colore in base alla media
  const getAverageColor = (average) => {
    if (average >= 8) return 'success.main';
    if (average >= 6) return 'primary.main';
    if (average >= 5) return 'warning.main';
    return 'error.main';
  };

  // Calcola la percentuale di completamento dell'anno scolastico
  const calculateSchoolYearProgress = () => {
    // Assumiamo che l'anno scolastico inizi a settembre e finisca a giugno
    const now = new Date();
    const startMonth = 8; // Settembre (0-based)
    const endMonth = 5; // Giugno (0-based)
    
    let currentMonth = now.getMonth();
    let totalMonths = endMonth - startMonth + 1;
    
    if (currentMonth < startMonth) {
      // Siamo prima dell'inizio dell'anno scolastico
      return 0;
    } else if (currentMonth > endMonth) {
      // Siamo dopo la fine dell'anno scolastico
      return 100;
    } else {
      // Siamo durante l'anno scolastico
      let monthsPassed = currentMonth - startMonth + 1;
      return Math.round((monthsPassed / totalMonths) * 100);
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Media generale */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderTop: 5,
            borderColor: getAverageColor(stats.overall.average)
          }}
        >
          <Typography variant="h6" gutterBottom>
            Media Generale
          </Typography>
          

          <Typography variant="h3" color={getAverageColor(stats.overall.average)}>
            {stats.overall.average.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            su {stats.overall.count} voti
          </Typography>
        </Paper>
      </Grid>
      
      {/* Voto più alto */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderTop: 5,
            borderColor: 'success.main'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Voto Più Alto
          </Typography>
          <Typography variant="h3" color="success.main">
            {stats.overall.highest.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            in {stats.overall.highestSubject}
          </Typography>
        </Paper>
      </Grid>
      
      {/* Voto più basso */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderTop: 5,
            borderColor: 'error.main'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Voto Più Basso
          </Typography>
          <Typography variant="h3" color="error.main">
            {stats.overall.lowest.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            in {stats.overall.lowestSubject}
          </Typography>
        </Paper>
      </Grid>
      
      {/* Progresso anno scolastico */}
      <Grid item xs={12} sm={6} md={3}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            borderTop: 5,
            borderColor: 'info.main'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Anno Scolastico
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress 
              variant="determinate" 
              value={calculateSchoolYearProgress()} 
              size={80}
              color="info"
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h5" component="div" color="info.main">
                {`${calculateSchoolYearProgress()}%`}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            completato
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardStats;