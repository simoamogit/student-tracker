import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, Paper, 
  Button, CircularProgress, Alert, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, 
  TextField, MenuItem, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, InputLabel, Select
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import GradeService from '../services/grade.service';
import GradeChart from '../components/grades/GradeChart';
import GradeStats from '../components/dashboard/GradeStats';
import { formatDate } from '../utils/dateUtils';
import AuthService from '../services/auth.service';

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterSubject, setFilterSubject] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [subjects, setSubjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentGrade, setCurrentGrade] = useState({
    id: null,
    subject: '',
    value: '',
    date: '',
    description: '',
    teacher: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = AuthService.getCurrentUser();
  const isTeacher = currentUser?.role === 'teacher';

  useEffect(() => {
    fetchGrades();
  }, []);

  useEffect(() => {
    // Applica filtri e ordinamento
    let result = [...grades];
    
    // Filtra per materia
    if (filterSubject) {
      result = result.filter(grade => grade.subject === filterSubject);
    }
    
    // Ordina i risultati
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortField === 'value') {
        comparison = a.value - b.value;
      } else if (sortField === 'subject') {
        comparison = a.subject.localeCompare(b.subject);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredGrades(result);
  }, [grades, filterSubject, sortField, sortDirection]);

  useEffect(() => {
    // Estrai le materie uniche
    if (grades.length > 0) {
      const uniqueSubjects = [...new Set(grades.map(grade => grade.subject))];
      setSubjects(uniqueSubjects);
    }
  }, [grades]);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      const gradesData = await GradeService.getGrades();
      setGrades(gradesData);
      setFilteredGrades(gradesData);
      
      const statsData = await GradeService.getStats();
      setStats(statsData);
      
      setError(null);
    } catch (err) {
      console.error('Errore nel caricamento dei voti:', err);
      setError('Si è verificato un errore nel caricamento dei voti. Riprova più tardi.');
      
      // Dati di esempio in caso di errore
      const exampleGrades = [
        { id: 1, subject: 'Matematica', value: 7.5, date: '2023-05-10', description: 'Verifica sui limiti', teacher: 'Rossi' },
        { id: 2, subject: 'Italiano', value: 8.0, date: '2023-05-08', description: 'Tema argomentativo', teacher: 'Bianchi' },
        { id: 3, subject: 'Storia', value: 6.5, date: '2023-05-05', description: 'Interrogazione', teacher: 'Verdi' },
        { id: 4, subject: 'Inglese', value: 9.0, date: '2023-05-03', description: 'Reading comprehension', teacher: 'Smith' },
        { id: 5, subject: 'Scienze', value: 5.5, date: '2023-04-28', description: 'Verifica sul DNA', teacher: 'Neri' },
        { id: 6, subject: 'Matematica', value: 6.0, date: '2023-04-20', description: 'Verifica sulle equazioni', teacher: 'Rossi' },
        { id: 7, subject: 'Italiano', value: 7.5, date: '2023-04-15', description: 'Analisi del testo', teacher: 'Bianchi' },
        { id: 8, subject: 'Storia', value: 7.0, date: '2023-04-10', description: 'Verifica sul Risorgimento', teacher: 'Verdi' },
        { id: 9, subject: 'Inglese', value: 8.5, date: '2023-04-05', description: 'Grammar test', teacher: 'Smith' },
        { id: 10, subject: 'Scienze', value: 6.5, date: '2023-03-30', description: 'Verifica sulla cellula', teacher: 'Neri' }
      ];
      
      setGrades(exampleGrades);
      setFilteredGrades(exampleGrades);
      
      setStats({
        overall: {
          count: 10,
          average: 7.2,
          highest: 9.0,
          lowest: 5.5,
          trend: 0.3
        },
        distribution: {
          insufficient: 1,
          sufficient: 3,
          good: 4,
          excellent: 2
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterSubject(event.target.value);
    setPage(0);
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(0);
  };

  const handleOpenDialog = (grade = null) => {
    if (grade) {
      setCurrentGrade({...grade});
      setIsEditing(true);
    } else {
      setCurrentGrade({
        id: null,
        subject: '',
        value: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        teacher: currentUser?.lastName || ''
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
    setCurrentGrade({
      ...currentGrade,
      [name]: name === 'value' ? parseFloat(value) || '' : value
    });
  };

  const handleSaveGrade = async () => {
    try {
      if (isEditing) {
        await GradeService.updateGrade(currentGrade.id, currentGrade);
      } else {
        await GradeService.addGrade(currentGrade);
      }
      
      fetchGrades(); // Ricarica i voti
      handleCloseDialog();
    } catch (err) {
      console.error('Errore nel salvare il voto:', err);
      setError('Si è verificato un errore nel salvare il voto. Riprova più tardi.');
      
      // In caso di errore, simula l'aggiunta/modifica
      if (isEditing) {
        setGrades(grades.map(g => g.id === currentGrade.id ? currentGrade : g));
      } else {
        const newGrade = {
          ...currentGrade,
          id: Math.max(...grades.map(g => g.id)) + 1
        };
        setGrades([...grades, newGrade]);
      }
      handleCloseDialog();
    }
  };

  const handleDeleteGrade = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo voto?')) {
      try {
        await GradeService.deleteGrade(id);
        fetchGrades(); // Ricarica i voti
      } catch (err) {
        console.error('Errore nell\'eliminazione del voto:', err);
        setError('Si è verificato un errore nell\'eliminazione del voto. Riprova più tardi.');
        
        // In caso di errore, simula l'eliminazione
        setGrades(grades.filter(g => g.id !== id));
      }
    }
  };

  // Funzione per determinare il colore del voto
  const getGradeColor = (value) => {
    if (value >= 8) return 'success.main';
    if (value >= 6) return 'info.main';
    if (value >= 5) return 'warning.main';
    return 'error.main';
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
                I Miei Voti
              </Typography>
              {isTeacher && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Aggiungi Voto
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Statistiche */}
        <Grid item xs={12} md={6}>
          <GradeStats stats={stats} />
        </Grid>
        
        {/* Grafico */}
        <Grid item xs={12} md={6}>
          <GradeChart grades={grades} title="Andamento Voti" height={250} />
        </Grid>
        
        {/* Filtri */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="subject-filter-label">Filtra per Materia</InputLabel>
                <Select
                  labelId="subject-filter-label"
                  value={filterSubject}
                  onChange={handleFilterChange}
                  label="Filtra per Materia"
                >
                  <MenuItem value="">Tutte le materie</MenuItem>
                  {subjects.map(subject => (
                    <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Ordina per:
                </Typography>
                <Button 
                  startIcon={<SortIcon />} 
                  onClick={() => handleSortChange('date')}
                  color={sortField === 'date' ? 'primary' : 'inherit'}
                  size="small"
                >
                  Data {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </Button>
                <Button 
                  startIcon={<SortIcon />} 
                  onClick={() => handleSortChange('value')}
                  color={sortField === 'value' ? 'primary' : 'inherit'}
                  size="small"
                >
                  Voto {sortField === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                </Button>
                <Button 
                  startIcon={<SortIcon />} 
                  onClick={() => handleSortChange('subject')}
                  color={sortField === 'subject' ? 'primary' : 'inherit'}
                  size="small"
                >
                  Materia {sortField === 'subject' && (sortDirection === 'asc' ? '↑' : '↓')}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Tabella dei voti */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="tabella voti">
                <TableHead>
                  <TableRow>
                    <TableCell>Materia</TableCell>
                    <TableCell align="center">Voto</TableCell>
                    <TableCell>Descrizione</TableCell>
                    <TableCell>Docente</TableCell>
                    <TableCell>Data</TableCell>
                    {isTeacher && <TableCell align="center">Azioni</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredGrades
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((grade) => (
                      <TableRow hover key={grade.id}>
                        <TableCell component="th" scope="row">
                          {grade.subject}
                        </TableCell>
                        <TableCell align="center">
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 'bold',
                              color: getGradeColor(grade.value)
                            }}
                          >
                            {grade.value.toFixed(1)}
                          </Typography>
                        </TableCell>
                        <TableCell>{grade.description || '-'}</TableCell>
                        <TableCell>{grade.teacher || '-'}</TableCell>
                        <TableCell>{formatDate(grade.date)}</TableCell>
                        {isTeacher && (
                          <TableCell align="center">
                            <IconButton 
                              color="primary" 
                              size="small"
                              onClick={() => handleOpenDialog(grade)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              size="small"
                              onClick={() => handleDeleteGrade(grade.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  {filteredGrades.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={isTeacher ? 6 : 5} align="center">
                        Nessun voto trovato
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredGrades.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Righe per pagina:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} di ${count}`}
            />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialog per aggiungere/modificare voto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Modifica Voto' : 'Aggiungi Nuovo Voto'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="subject"
              label="Materia"
              value={currentGrade.subject}
              onChange={handleInputChange}
              fullWidth
              required
              select={subjects.length > 0}
            >
              {subjects.length > 0 ? (
                subjects.map(subject => (
                  <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                ))
              ) : null}
            </TextField>
            
            <TextField
              name="value"
              label="Voto"
              type="number"
              value={currentGrade.value}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1, max: 10, step: 0.5 }}
            />
            
            <TextField
              name="date"
              label="Data"
              type="date"
              value={currentGrade.date}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              name="description"
              label="Descrizione"
              value={currentGrade.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />
            
            <TextField
              name="teacher"
              label="Docente"
              value={currentGrade.teacher}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button 
            onClick={handleSaveGrade} 
            variant="contained" 
            color="primary"
            disabled={!currentGrade.subject || !currentGrade.value || !currentGrade.date}
          >
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GradesPage;
