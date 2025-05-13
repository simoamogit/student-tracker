import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, Paper, 
  Button, CircularProgress, Alert, 
  TextField, Avatar, Divider, List, ListItem,
  ListItemText, ListItemAvatar, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle,
  Snackbar
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Cake as CakeIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import { stringAvatar } from '../utils/avatarUtils';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthDate: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await UserService.getUserProfile();
      setUser(userData);
      setEditedUser({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        birthDate: userData.birthDate ? userData.birthDate.split('T')[0] : ''
      });
      
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento del profilo:', err);
      setError('Si è verificato un errore nel caricamento del profilo. Riprova più tardi.');
      
      // Dati di esempio in caso di errore
      const currentUser = AuthService.getCurrentUser();
      const exampleUser = {
        id: currentUser?.id || 1,
        username: currentUser?.username || 'student1',
        firstName: currentUser?.firstName || 'Mario',
        lastName: currentUser?.lastName || 'Rossi',
        email: 'mario.rossi@example.com',
        role: currentUser?.role || 'student',
        phone: '3334445566',
        address: 'Via Roma 123, Milano',
        birthDate: '2005-05-15',
        class: '4A',
        school: 'Liceo Scientifico A. Einstein',
        createdAt: '2022-09-01T08:00:00.000Z'
      };
      
      setUser(exampleUser);
      setEditedUser({
        firstName: exampleUser.firstName || '',
        lastName: exampleUser.lastName || '',
        email: exampleUser.email || '',
        phone: exampleUser.phone || '',
        address: exampleUser.address || '',
        birthDate: exampleUser.birthDate ? exampleUser.birthDate.split('T')[0] : ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value
    });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    // Rimuovi l'errore quando l'utente inizia a digitare
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: null
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      await UserService.updateUserProfile(editedUser);
      
      // Aggiorna i dati dell'utente
      setUser({
        ...user,
        ...editedUser
      });
      
      handleCloseEditDialog();
      
      setSnackbar({
        open: true,
        message: 'Profilo aggiornato con successo',
        severity: 'success'
      });
    } catch (err) {
      console.error('Errore nell\'aggiornamento del profilo:', err);
      
      setSnackbar({
        open: true,
        message: 'Si è verificato un errore nell\'aggiornamento del profilo',
        severity: 'error'
      });
      
      // In caso di errore, simula l'aggiornamento
      setUser({
        ...user,
        ...editedUser
      });
      handleCloseEditDialog();
    }
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'La password attuale è obbligatoria';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'La nuova password è obbligatoria';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'La password deve essere di almeno 8 caratteri';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Le password non coincidono';
    }
    
    return errors;
  };

  const handleChangePassword = async () => {
    const errors = validatePassword();
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    try {
      await AuthService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      handleClosePasswordDialog();
      
      setSnackbar({
        open: true,
        message: 'Password modificata con successo',
        severity: 'success'
      });
    } catch (err) {
      console.error('Errore nella modifica della password:', err);
      
      if (err.response?.status === 401) {
        setPasswordErrors({
          currentPassword: 'Password attuale non corretta'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Si è verificato un errore nella modifica della password',
          severity: 'error'
        });
        handleClosePasswordDialog();
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
                Il Mio Profilo
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<EditIcon />}
                onClick={handleOpenEditDialog}
              >
                Modifica Profilo
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Informazioni principali */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              {user?.profileImage ? (
                <Avatar 
                  src={user.profileImage} 
                  alt={`${user.firstName} ${user.lastName}`}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
              ) : (
                <Avatar 
                  {...stringAvatar(`${user?.firstName || ''} ${user?.lastName || ''}`)}
                  sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem' }}
                />
              )}
              <Typography variant="h6" align="center">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {user?.role === 'student' ? 'Studente' : 'Docente'}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {user?.role === 'student' ? `Classe ${user?.class}` : ''}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <List sx={{ width: '100%' }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <SchoolIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Scuola" 
                  secondary={user?.school || 'Non specificata'} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Username" 
                  secondary={user?.username || 'Non specificato'} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <CakeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Data di nascita" 
                  secondary={user?.birthDate ? new Date(user.birthDate).toLocaleDateString('it-IT') : 'Non specificata'} 
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                color="primary" 
                startIcon={<LockIcon />}
                onClick={handleOpenPasswordDialog}
              >
                Cambia Password
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Informazioni di contatto */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Informazioni di Contatto
            </Typography>
            
            <List sx={{ width: '100%' }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Email" 
                  secondary={user?.email || 'Non specificata'} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PhoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Telefono" 
                  secondary={user?.phone || 'Non specificato'} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <HomeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Indirizzo" 
                  secondary={user?.address || 'Non specificato'} 
                />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Informazioni Account
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Membro dal:
                </Typography>
                <Typography variant="body2">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('it-IT') : 'Non disponibile'}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Ultimo accesso:
                </Typography>
                <Typography variant="body2">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('it-IT') : 'Non disponibile'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialog per modificare il profilo */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Modifica Profilo</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  label="Nome"
                  value={editedUser.firstName}
                  onChange={handleEditInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lastName"
                  label="Cognome"
                  value={editedUser.lastName}
                  onChange={handleEditInputChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            
            <TextField
              name="email"
              label="Email"
              type="email"
              value={editedUser.email}
              onChange={handleEditInputChange}
              fullWidth
            />
            
            <TextField
              name="phone"
              label="Telefono"
              value={editedUser.phone}
              onChange={handleEditInputChange}
              fullWidth
            />
            
            <TextField
              name="address"
              label="Indirizzo"
              value={editedUser.address}
              onChange={handleEditInputChange}
              fullWidth
            />
            
            <TextField
              name="birthDate"
              label="Data di nascita"
              type="date"
              value={editedUser.birthDate}
              onChange={handleEditInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Annulla</Button>
          <Button 
            onClick={handleSaveProfile} 
            variant="contained" 
            color="primary"
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialog per cambiare la password */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Cambia Password</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="currentPassword"
              label="Password attuale"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              required
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword}
            />
            
            <TextField
              name="newPassword"
              label="Nuova password"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              required
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword}
            />
            
            <TextField
              name="confirmPassword"
              label="Conferma nuova password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordInputChange}
              fullWidth
              required
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>Annulla</Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained" 
            color="primary"
          >
            Cambia Password
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default ProfilePage;
