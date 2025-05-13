import React from 'react';
import { 
  Box, Paper, Typography, Grid, Divider, 
  CircularProgress, useTheme 
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon
} from '@mui/icons-material';

const GradeStats = ({ stats, loading = false, title = 'Statistiche Voti' }) => {
  const theme = useTheme();

  // Funzione per determinare il colore della media
  const getAverageColor = (value) => {
    if (value >= 8) return theme.palette.success.main;
    if (value >= 6) return theme.palette.info.main;
    if (value >= 5) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Funzione per determinare l'icona del trend
  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUpIcon color="success" />;
    if (trend < 0) return <TrendingDownIcon color="error" />;
    return <TrendingFlatIcon color="action" />;
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (!stats) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          Nessuna statistica disponibile.
        </Typography>
      </Paper>
    );
  }

  const { overall, distribution } = stats;

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      
      {/* Media generale */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${getAverageColor(overall.average)}20`,
            mr: 2,
          }}
        >
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontWeight: 'bold', 
              color: getAverageColor(overall.average) 
            }}
          >
            {overall.average.toFixed(1)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1">Media Generale</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getTrendIcon(overall.trend || 0)}
            <Typography 
              variant="body2" 
              color={
                overall.trend > 0 ? 'success.main' : 
                overall.trend < 0 ? 'error.main' : 'text.secondary'
              }
              sx={{ ml: 0.5 }}
            >
              {overall.trend > 0 ? `+${overall.trend.toFixed(1)}` : 
               overall.trend < 0 ? overall.trend.toFixed(1) : 'Stabile'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Statistiche generali */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" component="div" color="primary.main">
              {overall.count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Totale Voti
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              component="div" 
              color={getAverageColor(overall.highest)}
            >
              {overall.highest.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Voto Più Alto
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              component="div" 
              color={getAverageColor(overall.lowest)}
            >
              {overall.lowest.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Voto Più Basso
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              component="div" 
              color={
                distribution.insufficient > 0 ? 'error.main' : 'success.main'
              }
            >
              {distribution.insufficient}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Insufficienze
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      {/* Distribuzione dei voti */}
      <Typography variant="subtitle1" gutterBottom>
        Distribuzione dei Voti
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Box 
            sx={{ 
              p: 1.5, 
              bgcolor: theme.palette.error.light, 
              borderRadius: 1,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" component="div" color="error.dark">
              {distribution.insufficient}
            </Typography>
            <Typography variant="body2">
              Insufficienti
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box 
            sx={{ 
              p: 1.5, 
              bgcolor: theme.palette.warning.light, 
              borderRadius: 1,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" component="div" color="warning.dark">
              {distribution.sufficient}
            </Typography>
            <Typography variant="body2">
              Sufficienti
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box 
            sx={{ 
              p: 1.5, 
              bgcolor: theme.palette.info.light, 
              borderRadius: 1,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" component="div" color="info.dark">
              {distribution.good}
            </Typography>
            <Typography variant="body2">
              Buoni
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box 
            sx={{ 
              p: 1.5, 
              bgcolor: theme.palette.success.light, 
              borderRadius: 1,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" component="div" color="success.dark">
              {distribution.excellent}
            </Typography>
            <Typography variant="body2">
              Ottimi
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default GradeStats;
