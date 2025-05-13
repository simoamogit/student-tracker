import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, Paper, 
  Button, CircularProgress, Alert, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Tabs, Tab, Card, CardContent, Divider,
  List, ListItem, ListItemText, ListItemIcon,
  Tooltip, FormControlLabel, Switch
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parseISO, isToday, isThisWeek, isThisMonth, isBefore } from 'date-fns';
import { it } from 'date-fns/locale';
import AttendanceService from '../services/attendance.service';
import AuthService from '../services/auth.service';
import { PieChart } from '../components/charts/PieChart';

const AttendancePage = () => {
  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState({
    id: null,
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    justification: '',
    notes: '',
    student: '',
    entryTime: '',
    exitTime: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filterDate, setFilterDate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [showJustified, setShowJustified] = useState(true);
  
  const currentUser = AuthService.getCurrentUser();
  const isTeacher = currentUser?.role === 'teacher';
  const isStudent = currentUser?.role === 'student';

  useEffect(() => {
    fetchAttendances();
  }, []);

  useEffect(() => {
    // Applica filtri
    let result = [...attendances];
    
    // Filtra per data
    if (filterDate) {
      const dateStr = format(filterDate, 'yyyy-MM-dd');
      result = result.filter(att => att.date.startsWith(dateStr));
    }
    
    // Filtra per stato
    if (filterStatus) {
      result = result.filter(att => att.status === filterStatus);
    }
    
    // Filtra per tab
    if (currentTab === 0) {
      // Tutte le presenze
    } else if (currentTab === 1) {
      // Solo oggi
      result = result.filter(att => isToday(parseISO(att.date)));
    } else if (currentTab === 2) {
      // Solo questa settimana
      result = result.filter(att => isThisWeek(parseISO(att.date), { weekStartsOn: 1 }));
    } else if (currentTab === 3) {
      // Solo questo mese
      result = result.filter(att => isThisMonth(parseISO(att.date)));
    }
    
    // Nascondi giustificate se richiesto
    if (!showJustified) {
      result = result.filter(att => 
        att.status === 'absent' && !att.justification
      );
    }
    
    // Ordina per data (più recenti prima)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredAttendances(result);
  }, [attendances, filterDate, filterStatus, currentTab, showJustified]);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      let attendancesData;
      
      if (isTeacher) {
        // Se è un insegnante, carica le presenze della classe
        attendancesData = await AttendanceService.getClassAttendances();
      } else {
        // Se è uno studente, carica le proprie presenze
        attendancesData = await AttendanceService.getStudentAttendances();
      }
      
      setAttendances(attendancesData);
      setFilteredAttendances(attendancesData);
      
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento delle presenze:', err);
      setError('Si è verificato un errore nel caricamento delle presenze. Riprova più tardi.');
      
      // Dati di esempio in caso di errore
      const today = new Date();
      const exampleAttendances = [
        { 
          id: 1, 
          date: format(today, 'yyyy-MM-dd'),
          status: 'present',
          entryTime: '08:00',
          exitTime: '13:00',
          student: isStudent ? `${currentUser.firstName} ${currentUser.lastName}` : 'Mario Rossi',
          studentId: isStudent ? currentUser.id : 1,
          class: '3A',
          notes: ''
        },
        { 
          id: 2, 
          date: format(new Date(today.getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          status: 'absent',
          justification: 'Visita medica',
          student: isStudent ? `${currentUser.firstName} ${currentUser.lastName}` : 'Mario Rossi',
          studentId: isStudent ? currentUser.id : 1,
          class: '3A',
          notes: 'Assenza giustificata dai genitori'
        },
        { 
          id: 3, 
          date: format(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          status: 'late',
          entryTime: '08:45',
          exitTime: '13:00',
          justification: 'Ritardo mezzi pubblici',
          student: isStudent ? `${currentUser.firstName} ${currentUser.lastName}` : 'Mario Rossi',
          studentId: isStudent ? currentUser.id : 1,
          class: '3A',
          notes: 'Ritardo giustificato'
        },
        { 
          id: 4, 
          date: format(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          status: 'present',
          entryTime: '08:00',
          exitTime: '13:00',
          student: isStudent ? `${currentUser.firstName} ${currentUser.lastName}` : 'Mario Rossi',
          studentId: isStudent ? currentUser.id : 1,
          class: '3A',
          notes: ''
        },
        { 
          id: 5, 
          date: format(new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          status: 'early_exit',
          entryTime: '08:00',
          exitTime: '11:30',
          justification: 'Visita medica',
          student: isStudent ? `${currentUser.firstName} ${currentUser.lastName}` : 'Mario Rossi',
          studentId: isStudent ? currentUser.id : 1,
          class: '3A',
          notes: 'Uscita anticipata autorizzata'
        }
      ];
      
      if (!isStudent) {
        // Aggiungi altri studenti per gli insegnanti
        exampleAttendances.push(
          { 
            id: 6, 
            date: format(today, 'yyyy-MM-dd'),
            status: 'absent',
            justification: '',
            student: 'Luca Bianchi',
            studentId: 2,
            class: '3A',
            notes: 'Assenza da giustificare'
          },
          { 
            id: 7, 
            date: format(today, 'yyyy-MM-dd'),
            status: 'present',
            entryTime: '08:00',
            exitTime: '13:00',
            student: 'Giulia Verdi',
            studentId: 3,
            class: '3A',
            notes: ''
          }
        );
      }
      
      setAttendances(exampleAttendances);
      setFilteredAttendances(exampleAttendances);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleFilterDateChange = (date) => {
    setFilterDate(date);
  };

  const handleShowJustifiedChange = (event) => {
    setShowJustified(event.target.checked);
  };

  const handleOpenDialog = (attendance = null) => {
    if (attendance) {
      setCurrentAttendance({...attendance});
      setIsEditing(true);
    } else {
      setCurrentAttendance({
        id: null,
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        justification: '',
        notes: '',
        student: '',
        entryTime: '',
        exitTime: ''
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
    setCurrentAttendance({
      ...currentAttendance,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setCurrentAttendance({
      ...currentAttendance,
      date: format(date, 'yyyy-MM-dd')
    });
  };

  const handleSaveAttendance = async () => {
    try {
      if (isEditing) {
        await AttendanceService.updateAttendance(currentAttendance.id, currentAttendance);
      } else {
        await AttendanceService.addAttendance(currentAttendance);
      }
      
      fetchAttendances(); // Ricarica le presenze
      handleCloseDialog();
    } catch (err) {
      console.error('Errore nel salvare la presenza:', err);
      setError('Si è verificato un errore nel salvare la presenza. Riprova più tardi.');
      
      // In caso di errore, simula l'aggiunta/modifica
      if (isEditing) {
        setAttendances(attendances.map(a => a.id === currentAttendance.id ? currentAttendance : a));
      } else {
        const newAttendance = {
          ...currentAttendance,
          id: Math.max(...attendances.map(a => a.id)) + 1
        };
        setAttendances([...attendances, newAttendance]);
      }
      handleCloseDialog();
    }
  };

  const handleDeleteAttendance = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa registrazione di presenza?')) {
      try {
        await AttendanceService.deleteAttendance(id);
        fetchAttendances(); // Ricarica le presenze
      } catch (err) {
        console.error('Errore nell\'eliminazione della presenza:', err);
        setError('Si è verificato un errore nell\'eliminazione della presenza. Riprova più tardi.');
        
        // In caso di errore, simula l'eliminazione
        setAttendances(attendances.filter(a => a.id !== id));
      }
    }
  };

  // Funzione per ottenere il colore e l'icona in base allo stato di presenza
  const getStatusInfo = (status) => {
    switch (status) {
      case 'present':
        return { color: 'success', icon: <CheckCircleIcon />, label: 'Presente' };
      case 'absent':
        return { color: 'error', icon: <CancelIcon />, label: 'Assente' };
      case 'late':
        return { color: 'warning', icon: <WarningIcon />, label: 'Ritardo' };
      case 'early_exit':
        return { color: 'info', icon: <WarningIcon />, label: 'Uscita anticipata' };
      default:
        return { color: 'default', icon: <InfoIcon />, label: 'Sconosciuto' };
    }
  };

  // Calcola le statistiche di presenza
  const calculateStats = () => {
    const total = attendances.length;
    const present = attendances.filter(a => a.status === 'present').length;
    const absent = attendances.filter(a => a.status === 'absent').length;
    const late = attendances.filter(a => a.status === 'late').length;
    const earlyExit = attendances.filter(a => a.status === 'early_exit').length;
    const justified = attendances.filter(a => (a.status === 'absent' || a.status === 'late' || a.status === 'early_exit') && a.justification).length;
    const unjustified = attendances.filter(a => (a.status === 'absent' || a.status === 'late' || a.status === 'early_exit') && !a.justification).length;
    
    const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;
    const absentPercentage = total > 0 ? Math.round((absent / total) * 100) : 0;
    const latePercentage = total > 0 ? Math.round((late / total) * 100) : 0;
    const earlyExitPercentage = total > 0 ? Math.round((earlyExit / total) * 100) : 0;
    
    return {
      total,
      present,
      absent,
      late,
      earlyExit,
      justified,
      unjustified,
      presentPercentage,
      absentPercentage,
      latePercentage,
      earlyExitPercentage
    };
  };

  const stats = calculateStats();

  // Dati per il grafico a torta
  const chartData = {
    labels: ['Presenze', 'Assenze', 'Ritardi', 'Uscite anticipate'],
    datasets: [
      {
        data: [stats.present, stats.absent, stats.late, stats.earlyExit],
        backgroundColor: ['#4caf50', '#f44336', '#ff9800', '#2196f3'],
      },
    ],
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
                Registro Presenze
              </Typography>
              {isTeacher && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Registra Presenza
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Statistiche */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Riepilogo Presenze
            </Typography>
            
            <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', mb: 2 }}>
              <PieChart data={chartData} />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <List dense>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary={`Presenze: ${stats.present} (${stats.presentPercentage}%)`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CancelIcon color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary={`Assenze: ${stats.absent} (${stats.absentPercentage}%)`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <WarningIcon color="warning" />
                </ListItemIcon>
                <ListItemText 
                  primary={`Ritardi: ${stats.late} (${stats.latePercentage}%)`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <WarningIcon color="info" />
                </ListItemIcon>
                <ListItemText 
                  primary={`Uscite anticipate: ${stats.earlyExit} (${stats.earlyExitPercentage}%)`} 
                />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Giustificate:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {stats.justified}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Da giustificare:
              </Typography>
              <Typography variant="body2" fontWeight="medium" color="error">
                {stats.unjustified}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Tabs e filtri */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="presenze tabs"
              >
                <Tab label="Tutte" id="tab-0" aria-controls="tabpanel-0" />
                <Tab label="Oggi" id="tab-1" aria-controls="tabpanel-1" />
                <Tab label="Questa Settimana" id="tab-2" aria-controls="tabpanel-2" />
                <Tab label="Questo Mese" id="tab-3" aria-controls="tabpanel-3" />
              </Tabs>
            </Box>
            
                        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
              <FilterIcon color="action" />
              
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
                <DatePicker
                  label="Filtra per data"
                  value={filterDate}
                  onChange={handleFilterDateChange}
                  renderInput={(params) => <TextField {...params} size="small" sx={{ width: 200 }} />}
                  clearable
                />
              </LocalizationProvider>
              
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel id="status-filter-label">Stato</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={filterStatus}
                  onChange={handleFilterStatusChange}
                  label="Stato"
                >
                  <MenuItem value="">Tutti</MenuItem>
                  <MenuItem value="present">Presente</MenuItem>
                  <MenuItem value="absent">Assente</MenuItem>
                  <MenuItem value="late">Ritardo</MenuItem>
                  <MenuItem value="early_exit">Uscita anticipata</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={showJustified} 
                    onChange={handleShowJustifiedChange}
                    size="small"
                  />
                }
                label="Mostra giustificate"
              />
              
              <Box sx={{ ml: 'auto' }}>
                <Typography variant="body2" color="text.secondary">
                  {filteredAttendances.length} registrazioni trovate
                </Typography>
              </Box>
            </Box>
          </Paper>
          
          {/* Tabella delle presenze */}
          <TableContainer component={Paper} elevation={3}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Data</TableCell>
                  {isTeacher && <TableCell>Studente</TableCell>}
                  <TableCell>Stato</TableCell>
                  <TableCell>Orario</TableCell>
                  <TableCell>Giustificazione</TableCell>
                  {isTeacher && <TableCell align="right">Azioni</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAttendances.length > 0 ? (
                  filteredAttendances.map((attendance) => {
                    const statusInfo = getStatusInfo(attendance.status);
                    return (
                      <TableRow key={attendance.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon fontSize="small" color="action" />
                            {format(parseISO(attendance.date), 'dd/MM/yyyy')}
                          </Box>
                        </TableCell>
                        
                        {isTeacher && (
                          <TableCell>{attendance.student}</TableCell>
                        )}
                        
                        <TableCell>
                          <Chip 
                            icon={statusInfo.icon} 
                            label={statusInfo.label} 
                            color={statusInfo.color} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        
                        <TableCell>
                          {attendance.status !== 'absent' && (
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="body2">
                                Entrata: {attendance.entryTime || 'N/A'}
                              </Typography>
                              <Typography variant="body2">
                                Uscita: {attendance.exitTime || 'N/A'}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          {attendance.status !== 'present' ? (
                            attendance.justification ? (
                              <Tooltip title={attendance.justification}>
                                <Chip 
                                  label="Giustificata" 
                                  size="small" 
                                  color="success" 
                                  variant="outlined"
                                />
                              </Tooltip>
                            ) : (
                              <Chip 
                                label="Da giustificare" 
                                size="small" 
                                color="error" 
                                variant="outlined"
                              />
                            )
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        
                        {isTeacher && (
                          <TableCell align="right">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleOpenDialog(attendance)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteAttendance(attendance.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={isTeacher ? 6 : 5} align="center">
                      Nessuna registrazione trovata
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      
      {/* Dialog per aggiungere/modificare presenza */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Modifica Registrazione' : 'Nuova Registrazione'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
              <DatePicker
                label="Data"
                value={parseISO(currentAttendance.date)}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </LocalizationProvider>
            
            {!isStudent && (
              <TextField
                name="student"
                label="Studente"
                value={currentAttendance.student}
                onChange={handleInputChange}
                fullWidth
                required
              />
            )}
            
            <FormControl fullWidth required>
              <InputLabel id="status-label">Stato</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={currentAttendance.status}
                onChange={handleInputChange}
                label="Stato"
              >
                <MenuItem value="present">Presente</MenuItem>
                <MenuItem value="absent">Assente</MenuItem>
                <MenuItem value="late">Ritardo</MenuItem>
                <MenuItem value="early_exit">Uscita anticipata</MenuItem>
              </Select>
            </FormControl>
            
            {currentAttendance.status !== 'absent' && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="entryTime"
                  label="Orario di entrata"
                  type="time"
                  value={currentAttendance.entryTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  fullWidth
                />
                
                <TextField
                  name="exitTime"
                  label="Orario di uscita"
                  type="time"
                  value={currentAttendance.exitTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  fullWidth
                />
              </Box>
            )}
            
            {currentAttendance.status !== 'present' && (
              <TextField
                name="justification"
                label="Giustificazione"
                value={currentAttendance.justification}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
              />
            )}
            
            <TextField
              name="notes"
              label="Note"
              value={currentAttendance.notes}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button 
            onClick={handleSaveAttendance} 
            variant="contained" 
            color="primary"
            disabled={!currentAttendance.date || (!isStudent && !currentAttendance.student) || !currentAttendance.status}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AttendancePage;
