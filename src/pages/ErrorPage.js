import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Error as ErrorIcon } from '@mui/icons-material';

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const error = location.state?.error || {
    message: 'Si è verificato un errore imprevisto',
    details: 'Riprova più tardi o contatta l\'assistenza se il problema persiste.'
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ErrorIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Oops! Qualcosa è andato storto
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom>
            {error.message}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {error.details}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate(-1)}
          >
            Torna indietro
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/dashboard')}
          >
            Vai alla Dashboard
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ErrorPage;
