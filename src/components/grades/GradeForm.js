import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select,
  MenuItem, Grid, Typography, InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import SubjectService from '../../services/subject.service';

const GradeForm = ({ open, onClose, onSave, grade, schoolYear }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    value: '',
    date: new Date(),
    description: '',
    semester: '1',
    school_year: schoolYear || ''
  });

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjectsData = await SubjectService.getSubjects();
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Errore nel caricamento delle materie:', err);
      }
    };

    loadSubjects();

    if (grade) {
      setFormData({
        subject: grade.subject || '',
        value: grade.value || '',
        date: grade.date ? new Date(grade.date) : new Date(),
        description: grade.description || '',
        semester: grade.semester || '1',
        school_year: grade.school_year || schoolYear || ''
      });
    } else {
      setFormData({
        subject: '',
        value: '',
        date: new Date(),
        description: '',
        semester: '1',
        school_year: schoolYear || ''
      });
    }
  }, [grade, schoolYear]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validazione del voto (tra 1 e 10)
    const numericValue = parseFloat(formData.value);
    if (isNaN(numericValue) || numericValue < 1 || numericValue > 10) {
      alert('Il voto deve essere un numero compreso tra 1 e 10');
      setLoading(false);
      return;
    }
    
    const data = {
      ...formData,
      value: numericValue,
      date: format(formData.date, 'yyyy-MM-dd')
    };
    
    onSave(data);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{grade ? 'Modifica Voto' : 'Nuovo Voto'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Materia</InputLabel>
                <Select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  label="Materia"
                >
                  {subjects.map(subject => (
                    <MenuItem key={subject._id || subject.id} value={subject.name}>
                      {subject.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Voto"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                inputProps={{ 
                  min: 1, 
                  max: 10, 
                  step: 0.25 
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">/10</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
                <DatePicker
                  label="Data"
                  value={formData.date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  format="dd/MM/yyyy"
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Semestre</InputLabel>
                <Select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  label="Semestre"
                >
                  <MenuItem value="1">Primo Semestre</MenuItem>
                  <MenuItem value="2">Secondo Semestre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrizione"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Annulla</Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Salvataggio...' : 'Salva'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GradeForm;
