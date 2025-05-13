import React from 'react';
import { Typography, Grid, Paper, Box } from '@mui/material';

const GradeStatsPage = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Statistiche Voti
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Media per Materia
            </Typography>
            <Typography variant="body1">
              Matematica: 8.5
            </Typography>
            <Typography variant="body1">
              Italiano: 7.0
            </Typography>
            <Typography variant="body1">
              Storia: 6.5
            </Typography>
            <Typography variant="body1">
              Inglese: 9.0
            </Typography>
            <Typography variant="body1">
              Fisica: 7.5
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Andamento Generale
            </Typography>
            <Typography variant="body1">
              Media generale: 7.7
            </Typography>
            <Typography variant="body1">
              Voto più alto: 9.0 (Inglese)
            </Typography>
            <Typography variant="body1">
              Voto più basso: 6.5 (Storia)
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GradeStatsPage;
