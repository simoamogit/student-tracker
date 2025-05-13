import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, Paper, 
  Button, CircularProgress, Alert, 
  List, ListItem, ListItemText, ListItemIcon,
  Divider, Switch, FormControlLabel, FormGroup,
  Snackbar, Card, CardContent, CardHeader,
  Accordion, AccordionSummary, AccordionDetails,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Visibility as VisibilityIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Translate as TranslateIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import SettingsService from '../services/settings.service';
import { useTheme } from '../contexts/ThemeContext';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const settingsData = await SettingsService.getSettings();
      setSettings(settingsData);
      
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento delle impostazioni:', err);
      setError('Si è verificato un errore nel caricamento delle impostazioni. Riprova più tardi.');
      
      // Dati di esempio in caso di errore
      setSettings({
        notifications: {
          email: true,
          push: true,
          events: true,
          communications: true,
          grades: true
        },
        appearance: {
          darkMode: darkMode,
          fontSize: 'medium',
          colorScheme: 'default'
        },
        privacy: {
          showGrades: true,
          showAttendance: true,
          showProfile: true
        },
        language: 'it',
        security: {
          twoFactorAuth: false,
          sessionTimeout: 30
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    });
  };

  const handleLanguageChange = (event) => {
    setSettings({
      ...settings,
      language: event.target.value
    });
  };

  const handleSaveSettings = async () => {
    try {
      await SettingsService.updateSettings(settings);
      
      // Aggiorna il tema se è stato modificato
      if (settings.appearance.darkMode !== darkMode) {
        toggleDarkMode();
      }
      
      setSnackbar({
        open: true,
        message: 'Impostazioni salvate con successo',
        severity: 'success'
      });
    } catch (err) {
      console.error('Errore nel salvare le impostazioni:', err);
      
      setSnackbar({
        open: true,
        message: 'Si è verificato un errore nel salvare le impostazioni',
        severity: 'error'
      });
      
      // In caso di errore, aggiorna comunque il tema se è stato modificato
      if (settings.appearance.darkMode !== darkMode) {
        toggleDarkMode();
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
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
                Impostazioni
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
              >
                Salva Impostazioni
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Impostazioni di notifica */}
        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="notifications-content"
              id="notifications-header"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon color="primary" />
                <Typography variant="h6">Notifiche</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.notifications.email} 
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    />
                  }
                  label="Ricevi notifiche via email"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.notifications.push} 
                      onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    />
                  }
                  label="Ricevi notifiche push"
                />
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Notifiche per:
                </Typography>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.notifications.events} 
                      onChange={(e) => handleSettingChange('notifications', 'events', e.target.checked)}
                    />
                  }
                  label="Eventi e scadenze"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.notifications.communications} 
                      onChange={(e) => handleSettingChange('notifications', 'communications', e.target.checked)}
                    />
                  }
                  label="Comunicazioni e circolari"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.notifications.grades} 
                      onChange={(e) => handleSettingChange('notifications', 'grades', e.target.checked)}
                    />
                  }
                  label="Nuovi voti"
                />
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Impostazioni di aspetto */}
        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="appearance-content"
              id="appearance-header"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaletteIcon color="primary" />
                <Typography variant="h6">Aspetto</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.appearance.darkMode} 
                      onChange={(e) => handleSettingChange('appearance', 'darkMode', e.target.checked)}
                      icon={<LightModeIcon />}
                      checkedIcon={<DarkModeIcon />}
                    />
                  }
                  label={settings.appearance.darkMode ? "Tema scuro" : "Tema chiaro"}
                />
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Dimensione testo:
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                    <Select
                      value={settings.appearance.fontSize}
                      onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                    >
                      <MenuItem value="small">Piccolo</MenuItem>
                      <MenuItem value="medium">Medio</MenuItem>
                      <MenuItem value="large">Grande</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Schema colori:
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                    <Select
                      value={settings.appearance.colorScheme}
                      onChange={(e) => handleSettingChange('appearance', 'colorScheme', e.target.value)}
                    >
                      <MenuItem value="default">Predefinito</MenuItem>
                      <MenuItem value="blue">Blu</MenuItem>
                      <MenuItem value="green">Verde</MenuItem>
                      <MenuItem value="purple">Viola</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Impostazioni di privacy */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="privacy-content"
              id="privacy-header"
            >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VisibilityIcon color="primary" />
                <Typography variant="h6">Privacy</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                <Typography variant="subtitle2" gutterBottom>
                  Visibilità delle informazioni:
                </Typography>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.privacy.showGrades} 
                      onChange={(e) => handleSettingChange('privacy', 'showGrades', e.target.checked)}
                    />
                  }
                  label="Mostra i miei voti nella dashboard"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.privacy.showAttendance} 
                      onChange={(e) => handleSettingChange('privacy', 'showAttendance', e.target.checked)}
                    />
                  }
                  label="Mostra le mie presenze/assenze nella dashboard"
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={settings.privacy.showProfile} 
                      onChange={(e) => handleSettingChange('privacy', 'showProfile', e.target.checked)}
                    />
                  }
                  label="Rendi visibile il mio profilo agli altri utenti"
                />
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Impostazioni di lingua */}
        <Grid item xs={12} md={6}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="language-content"
              id="language-header"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon color="primary" />
                <Typography variant="h6">Lingua</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TranslateIcon color="action" />
                <FormControl fullWidth>
                  <InputLabel id="language-select-label">Lingua</InputLabel>
                  <Select
                    labelId="language-select-label"
                    value={settings.language}
                    onChange={handleLanguageChange}
                    label="Lingua"
                  >
                    <MenuItem value="it">Italiano</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Impostazioni di sicurezza */}
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="security-content"
              id="security-header"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon color="primary" />
                <Typography variant="h6">Sicurezza</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={settings.security.twoFactorAuth} 
                          onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                        />
                      }
                      label="Autenticazione a due fattori"
                    />
                    {settings.security.twoFactorAuth && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 4 }}>
                        L'autenticazione a due fattori è attiva. Riceverai un codice via email ad ogni accesso.
                      </Typography>
                    )}
                  </FormGroup>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Timeout sessione (minuti):
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                    <Select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                    >
                      <MenuItem value={15}>15 minuti</MenuItem>
                      <MenuItem value={30}>30 minuti</MenuItem>
                      <MenuItem value={60}>1 ora</MenuItem>
                      <MenuItem value={120}>2 ore</MenuItem>
                      <MenuItem value={240}>4 ore</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Dopo questo periodo di inattività, dovrai effettuare nuovamente l'accesso.
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Riepilogo impostazioni */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Riepilogo Impostazioni
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardHeader
                    avatar={
                      settings.notifications.push || settings.notifications.email ? 
                        <NotificationsActiveIcon color="primary" /> : 
                        <NotificationsOffIcon color="disabled" />
                    }
                    title="Notifiche"
                    titleTypographyProps={{ variant: 'subtitle2' }}
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      {settings.notifications.push && settings.notifications.email ? 
                        'Email e push attive' : 
                        settings.notifications.push ? 
                          'Solo push attive' : 
                          settings.notifications.email ? 
                            'Solo email attive' : 
                            'Tutte disattivate'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardHeader
                    avatar={
                      settings.appearance.darkMode ? 
                        <DarkModeIcon color="primary" /> : 
                        <LightModeIcon color="primary" />
                    }
                    title="Aspetto"
                    titleTypographyProps={{ variant: 'subtitle2' }}
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tema {settings.appearance.darkMode ? 'scuro' : 'chiaro'}, 
                      testo {
                        settings.appearance.fontSize === 'small' ? 'piccolo' : 
                        settings.appearance.fontSize === 'medium' ? 'medio' : 'grande'
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardHeader
                    avatar={<VisibilityIcon color="primary" />}
                    title="Privacy"
                    titleTypographyProps={{ variant: 'subtitle2' }}
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      Profilo {settings.privacy.showProfile ? 'visibile' : 'privato'},
                      voti {settings.privacy.showGrades ? 'visibili' : 'nascosti'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardHeader
                    avatar={<SecurityIcon color="primary" />}
                    title="Sicurezza"
                    titleTypographyProps={{ variant: 'subtitle2' }}
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Typography variant="body2" color="text.secondary">
                      2FA {settings.security.twoFactorAuth ? 'attiva' : 'non attiva'},
                      timeout {settings.security.sessionTimeout} min
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Snackbar per i messaggi di feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;

