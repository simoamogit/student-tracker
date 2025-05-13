import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, Paper, 
  Button, CircularProgress, Alert, 
  List, ListItem, ListItemText, ListItemIcon,
  Divider, Chip, IconButton, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, MenuItem,
  FormControl, InputLabel, Select, Tabs, Tab,
  Card, CardContent, CardActions, CardHeader,
  Avatar, Collapse
} from '@mui/material';
import {
  Announcement as AnnouncementIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AttachFile as AttachFileIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import CommunicationService from '../services/communication.service';
import { formatDate, formatDateTime } from '../utils/dateUtils';
import { stringAvatar } from '../utils/avatarUtils';
import AuthService from '../services/auth.service';

const CommunicationsPage = () => {
  const [communications, setCommunications] = useState([]);
  const [filteredCommunications, setFilteredCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [filterType, setFilterType] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCommunication, setCurrentCommunication] = useState({
    id: null,
    title: '',
    content: '',
    type: 'announcement',
    recipients: [],
    attachments: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = AuthService.getCurrentUser();
  const isTeacher = currentUser?.role === 'teacher';

  const communicationTypes = [
    { value: 'announcement', label: 'Avviso', icon: <AnnouncementIcon /> },
    { value: 'circular', label: 'Circolare', icon: <EmailIcon /> },
    { value: 'notification', label: 'Notifica', icon: <NotificationsIcon /> }
  ];

  useEffect(() => {
    fetchCommunications();
  }, []);

  useEffect(() => {
    // Applica filtri
    let result = [...communications];
    
    // Filtra per tipo
    if (filterType) {
      result = result.filter(comm => comm.type === filterType);
    }
    
    // Filtra per tab
    if (currentTab === 0) {
      // Tutte le comunicazioni
    } else if (currentTab === 1) {
      // Solo avvisi
      result = result.filter(comm => comm.type === 'announcement');
    } else if (currentTab === 2) {
      // Solo circolari
      result = result.filter(comm => comm.type === 'circular');
    } else if (currentTab === 3) {
      // Solo notifiche
      result = result.filter(comm => comm.type === 'notification');
    }
    
    // Ordina per data (più recenti prima)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredCommunications(result);
  }, [communications, filterType, currentTab]);

  const fetchCommunications = async () => {
    try {
      setLoading(true);
      const communicationsData = await CommunicationService.getCommunications();
      setCommunications(communicationsData);
      setFilteredCommunications(communicationsData);
      
      setError(null);
    } catch (err) {
            console.error('Errore nel caricamento delle comunicazioni:', err);
      setError('Si è verificato un errore nel caricamento delle comunicazioni. Riprova più tardi.');
      
      // Dati di esempio in caso di errore
      const exampleCommunications = [
        { 
          id: 1, 
          title: 'Chiusura scuola per festività', 
          content: 'Si comunica che la scuola rimarrà chiusa nei giorni 1 e 2 novembre per la festività di Ognissanti.',
          type: 'announcement',
          sender: 'Dirigente Scolastico',
          date: '2023-10-25T10:30:00',
          recipients: ['Tutti'],
          attachments: []
        },
        { 
          id: 2, 
          title: 'Circolare n.45 - Colloqui con i genitori', 
          content: 'Si comunica che i colloqui con i genitori si terranno dal 15 al 30 novembre secondo il calendario allegato.',
          type: 'circular',
          sender: 'Segreteria Didattica',
          date: '2023-10-20T09:15:00',
          recipients: ['Docenti', 'Genitori'],
          attachments: [
            { name: 'calendario_colloqui.pdf', url: '#' }
          ]
        },
        { 
          id: 3, 
          title: 'Consegna pagelle primo quadrimestre', 
          content: 'Si comunica che le pagelle del primo quadrimestre saranno disponibili online dal 10 febbraio.',
          type: 'notification',
          sender: 'Segreteria Didattica',
          date: '2023-10-18T14:45:00',
          recipients: ['Studenti', 'Genitori'],
          attachments: []
        },
        { 
          id: 4, 
          title: 'Assemblea d\'Istituto', 
          content: 'Si comunica che il giorno 5 novembre si terrà l\'assemblea d\'istituto dalle ore 9:00 alle ore 12:00.',
          type: 'announcement',
          sender: 'Rappresentanti degli Studenti',
          date: '2023-10-15T11:20:00',
          recipients: ['Studenti', 'Docenti'],
          attachments: [
            { name: 'ordine_del_giorno.pdf', url: '#' }
          ]
        },
        { 
          id: 5, 
          title: 'Circolare n.44 - Orario definitivo', 
          content: 'Si comunica che da lunedì 30 ottobre entrerà in vigore l\'orario definitivo delle lezioni.',
          type: 'circular',
          sender: 'Dirigente Scolastico',
          date: '2023-10-12T08:30:00',
          recipients: ['Tutti'],
          attachments: [
            { name: 'orario_definitivo.pdf', url: '#' }
          ]
        }
      ];
      
      setCommunications(exampleCommunications);
      setFilteredCommunications(exampleCommunications);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleOpenDialog = (communication = null) => {
    if (communication) {
      setCurrentCommunication({...communication});
      setIsEditing(true);
    } else {
      setCurrentCommunication({
        id: null,
        title: '',
        content: '',
        type: 'announcement',
        recipients: ['Tutti'],
        attachments: []
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCommunication({
      ...currentCommunication,
      [name]: value
    });
  };

  const handleRecipientsChange = (e) => {
    setCurrentCommunication({
      ...currentCommunication,
      recipients: e.target.value
    });
  };

  const handleSaveCommunication = async () => {
    try {
      if (isEditing) {
        await CommunicationService.updateCommunication(currentCommunication.id, currentCommunication);
      } else {
        await CommunicationService.addCommunication(currentCommunication);
      }
      
      fetchCommunications(); // Ricarica le comunicazioni
      handleCloseDialog();
    } catch (err) {
      console.error('Errore nel salvare la comunicazione:', err);
      setError('Si è verificato un errore nel salvare la comunicazione. Riprova più tardi.');
      
      // In caso di errore, simula l'aggiunta/modifica
      if (isEditing) {
        setCommunications(communications.map(c => c.id === currentCommunication.id ? currentCommunication : c));
      } else {
        const newCommunication = {
          ...currentCommunication,
          id: Math.max(...communications.map(c => c.id)) + 1,
          date: new Date().toISOString(),
          sender: `${currentUser.firstName} ${currentUser.lastName}`
        };
        setCommunications([...communications, newCommunication]);
      }
      handleCloseDialog();
    }
  };

  const handleDeleteCommunication = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa comunicazione?')) {
      try {
        await CommunicationService.deleteCommunication(id);
        fetchCommunications(); // Ricarica le comunicazioni
      } catch (err) {
        console.error('Errore nell\'eliminazione della comunicazione:', err);
        setError('Si è verificato un errore nell\'eliminazione della comunicazione. Riprova più tardi.');
        
        // In caso di errore, simula l'eliminazione
        setCommunications(communications.filter(c => c.id !== id));
      }
    }
  };

  // Funzione per ottenere l'icona in base al tipo di comunicazione
  const getCommunicationIcon = (type) => {
    const commType = communicationTypes.find(ct => ct.value === type);
    return commType ? commType.icon : <EmailIcon />;
  };

  // Funzione per ottenere l'etichetta del tipo di comunicazione
  const getCommunicationTypeLabel = (type) => {
    const commType = communicationTypes.find(ct => ct.value === type);
    return commType ? commType.label : 'Comunicazione';
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
                Comunicazioni
              </Typography>
              {isTeacher && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Nuova Comunicazione
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Tabs e filtri */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="comunicazioni tabs"
              >
                <Tab label="Tutte" id="tab-0" aria-controls="tabpanel-0" />
                <Tab label="Avvisi" id="tab-1" aria-controls="tabpanel-1" />
                <Tab label="Circolari" id="tab-2" aria-controls="tabpanel-2" />
                <Tab label="Notifiche" id="tab-3" aria-controls="tabpanel-3" />
              </Tabs>
            </Box>
            
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <FilterIcon color="action" />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="type-filter-label">Filtra per Tipo</InputLabel>
                <Select
                  labelId="type-filter-label"
                  value={filterType}
                  onChange={handleFilterTypeChange}
                  label="Filtra per Tipo"
                  size="small"
                >
                  <MenuItem value="">Tutti i tipi</MenuItem>
                  {communicationTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {React.cloneElement(type.icon, { fontSize: 'small' })}
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ ml: 'auto' }}>
                <Typography variant="body2" color="text.secondary">
                  {filteredCommunications.length} comunicazioni trovate
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Lista delle comunicazioni */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredCommunications.length > 0 ? (
              filteredCommunications.map(communication => (
                <Card key={communication.id} elevation={3}>
                  <CardHeader
                    avatar={
                      <Avatar {...stringAvatar(communication.sender || 'User')} />
                    }
                    action={
                      isTeacher && (
                        <Box>
                          <IconButton 
                            aria-label="edit"
                            onClick={() => handleOpenDialog(communication)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            aria-label="delete"
                            onClick={() => handleDeleteCommunication(communication.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )
                    }
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getCommunicationIcon(communication.type)}
                        <Typography variant="subtitle1">
                          {communication.title}
                        </Typography>
                      </Box>
                    }
                    subheader={
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {communication.sender} • {formatDateTime(communication.date)}
                        </Typography>
                        <Chip 
                          label={getCommunicationTypeLabel(communication.type)} 
                          size="small" 
                          color={
                            communication.type === 'announcement' ? 'primary' : 
                            communication.type === 'circular' ? 'secondary' : 
                            'default'
                          }
                          variant="outlined"
                        />
                      </Box>
                    }
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Destinatari: {communication.recipients.join(', ')}
                    </Typography>
                    
                    <Collapse in={expandedId === communication.id} collapsedSize="80px">
                      <Typography variant="body1" paragraph>
                        {communication.content}
                      </Typography>
                      
                      {communication.attachments && communication.attachments.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Allegati:
                          </Typography>
                          <List dense>
                            {communication.attachments.map((attachment, index) => (
                              <ListItem key={index} disablePadding>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <AttachFileIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={
                                    <Button 
                                      href={attachment.url} 
                                      color="primary"
                                      size="small"
                                      sx={{ textTransform: 'none' }}
                                    >
                                      {attachment.name}
                                    </Button>
                                  } 
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </Collapse>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button 
                      onClick={() => handleExpandClick(communication.id)}
                      endIcon={expandedId === communication.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      size="small"
                    >
                      {expandedId === communication.id ? 'Mostra meno' : 'Mostra tutto'}
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography align="center" color="text.secondary">
                  Nessuna comunicazione trovata
                </Typography>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>
      
      {/* Dialog per aggiungere/modificare comunicazione */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Modifica Comunicazione' : 'Nuova Comunicazione'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="title"
                          label="Titolo"
              value={currentCommunication.title}
              onChange={handleInputChange}
              fullWidth
              required
            />
            
            <FormControl fullWidth required>
              <InputLabel id="communication-type-label">Tipo di Comunicazione</InputLabel>
              <Select
                labelId="communication-type-label"
                name="type"
                value={currentCommunication.type}
                onChange={handleInputChange}
                label="Tipo di Comunicazione"
              >
                {communicationTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {React.cloneElement(type.icon, { fontSize: 'small' })}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth required>
              <InputLabel id="recipients-label">Destinatari</InputLabel>
              <Select
                labelId="recipients-label"
                multiple
                value={currentCommunication.recipients}
                onChange={handleRecipientsChange}
                label="Destinatari"
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="Tutti">Tutti</MenuItem>
                <MenuItem value="Docenti">Docenti</MenuItem>
                <MenuItem value="Studenti">Studenti</MenuItem>
                <MenuItem value="Genitori">Genitori</MenuItem>
                <MenuItem value="Personale ATA">Personale ATA</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              name="content"
              label="Contenuto"
              value={currentCommunication.content}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={6}
              required
            />
            
            {/* Gestione allegati - versione semplificata */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Allegati:
              </Typography>
              
              {currentCommunication.attachments && currentCommunication.attachments.length > 0 ? (
                <List dense>
                  {currentCommunication.attachments.map((attachment, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <AttachFileIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={attachment.name} />
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => {
                          const newAttachments = [...currentCommunication.attachments];
                          newAttachments.splice(index, 1);
                          setCurrentCommunication({
                            ...currentCommunication,
                            attachments: newAttachments
                          });
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nessun allegato
                </Typography>
              )}
              
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<AttachFileIcon />}
                sx={{ mt: 1 }}
                onClick={() => {
                  // In una versione reale, qui si aprirebbe un file picker
                  // Per ora aggiungiamo un allegato di esempio
                  const newAttachment = { 
                    name: `allegato_${Math.floor(Math.random() * 1000)}.pdf`, 
                    url: '#' 
                  };
                  setCurrentCommunication({
                    ...currentCommunication,
                    attachments: [...(currentCommunication.attachments || []), newAttachment]
                  });
                }}
              >
                Aggiungi Allegato
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button 
            onClick={handleSaveCommunication} 
            variant="contained" 
            color="primary"
            disabled={!currentCommunication.title || !currentCommunication.type || !currentCommunication.content}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CommunicationsPage;


