import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select,
  MenuItem, Box, FormHelperText
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

const EventForm = ({ open, onClose, onSave, event, schoolYear }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(new Date().getTime() + 60 * 60 * 1000), // +1 ora
    event_type: 'other',
    subject: '',
    school_year: schoolYear || ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Carica i dati dell'evento se in modalità modifica
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        start_date: event.start_date ? parseISO(event.start_date) : new Date(),
        end_date: event.end_date ? parseISO(event.end_date) : new Date(new Date().getTime() + 60 * 60 * 1000),
        event_type: event.event_type || 'other',
        subject: event.subject || '',
        school_year: event.school_year || schoolYear || ''
      });
    } else {
      // Reset del form in modalità creazione
      setFormData({
        title: '',
        description: '',
        start_date: new Date(),
        end_date: new Date(new Date().getTime() + 60 * 60 * 1000),
        event_type: 'other',
        subject: '',
        school_year: schoolYear || ''
      });
    }
    
    setErrors({});
  }, [event, schoolYear, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Rimuovi l'errore quando l'utente modifica il campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (field, date) => {
    setFormData(prev => ({ ...prev, [field]: date }));
    
    // Rimuovi l'errore quando l'utente modifica il campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Il titolo è obbligatorio';
    }
    
    if (!formData.start_date) {
      newErrors.start_date = 'La data di inizio è obbligatoria';
    }
    
    if (formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = 'La data di fine deve essere successiva alla data di inizio';
    }
    
    if (!formData.school_year) {
      newErrors.school_year = 'L\'anno scolastico è obbligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Converti le date in formato ISO
      const formattedData = {
        ...formData,
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date ? formData.end_date.toISOString() : null
      };
      
      onSave(formattedData);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {event ? 'Modifica Evento' : 'Crea Nuovo Evento'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Titolo"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              required
            />
            
            <FormControl fullWidth margin="dense">
              <InputLabel>Tipo di Evento</InputLabel>
              <Select
                name="event_type"
                value={formData.event_type}
                onChange={handleChange}
                label="Tipo di Evento"
              >
                <MenuItem value="exam">Verifica</MenuItem>
                <MenuItem value="homework">Compito</MenuItem>
                <MenuItem value="meeting">Riunione</MenuItem>
                <MenuItem value="other">Altro</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              margin="dense"
              label="Materia"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
            
            <Box sx={{ mt: 2, mb: 2 }}>
              <DateTimePicker
                label="Data e ora di inizio"
                value={formData.start_date}
                onChange={(newValue) => handleDateChange('start_date', newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'dense',
                    error: !!errors.start_date,
                    helperText: errors.start_date
                  }
                }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <DateTimePicker
                label="Data e ora di fine"
                value={formData.end_date}
                onChange={(newValue) => handleDateChange('end_date', newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'dense',
                    error: !!errors.end_date,
                    helperText: errors.end_date
                  }
                }}
              />
            </Box>
            
            <TextField
              fullWidth
              margin="dense"
              label="Anno Scolastico"
              name="school_year"
              value={formData.school_year}
              onChange={handleChange}
              error={!!errors.school_year}
              helperText={errors.school_year}
              required
            />
            
            <TextField
              fullWidth
              margin="dense"
              label="Descrizione"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annulla</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EventForm;