import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select,
  MenuItem, Grid
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';
import { it } from 'date-fns/locale';
import SubjectService from '../../services/subject.service';
import TeacherService from '../../services/teacher.service';

const ScheduleForm = ({ open, onClose, onSave, scheduleItem, initialDay, schoolYear }) => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    day: initialDay || '1',
    subject: '',
    teacher: '',
    start_time: new Date(new Date().setHours(8, 0, 0, 0)),
    end_time: new Date(new Date().setHours(9, 0, 0, 0)),
    school_year: schoolYear || ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [subjectsData, teachersData] = await Promise.all([
          SubjectService.getSubjects(),
          TeacherService.getTeachers()
        ]);
        setSubjects(subjectsData);
        setTeachers(teachersData);
      } catch (err) {
        console.error('Errore nel caricamento dei dati:', err);
      }
    };

    loadData();

    if (scheduleItem) {
      const startTime = scheduleItem.start_time 
        ? parse(scheduleItem.start_time, 'HH:mm', new Date()) 
        : new Date(new Date().setHours(8, 0, 0, 0));
      
      const endTime = scheduleItem.end_time 
        ? parse(scheduleItem.end_time, 'HH:mm', new Date()) 
        : new Date(new Date().setHours(9, 0, 0, 0));

      setFormData({
        day: scheduleItem.day || initialDay || '1',
        subject: scheduleItem.subject || '',
        teacher: scheduleItem.teacher || '',
        start_time: startTime,
        end_time: endTime,
        school_year: scheduleItem.school_year || schoolYear || ''
      });
    } else {
      setFormData({
        day: initialDay || '1',
        subject: '',
        teacher: '',
        start_time: new Date(new Date().setHours(8, 0, 0, 0)),
        end_time: new Date(new Date().setHours(9, 0, 0, 0)),
        school_year: schoolYear || ''
      });
    }
  }, [scheduleItem, initialDay, schoolYear]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (name, time) => {
    setFormData(prev => ({ ...prev, [name]: time }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = {
      ...formData,
      start_time: format(formData.start_time, 'HH:mm'),
      end_time: format(formData.end_time, 'HH:mm')
    };
    
    onSave(data);
    setLoading(false);
  };

  const dayOptions = [
    { value: '1', label: 'Lunedì' },
    { value: '2', label: 'Martedì' },
    { value: '3', label: 'Mercoledì' },
    { value: '4', label: 'Giovedì' },
    { value: '5', label: 'Venerdì' },
    { value: '6', label: 'Sabato' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{scheduleItem ? 'Modifica Lezione' : 'Nuova Lezione'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Giorno</InputLabel>
                <Select
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  label="Giorno"
                >
                  {dayOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
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
              <FormControl fullWidth required>
                <InputLabel>Insegnante</InputLabel>
                <Select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  label="Insegnante"
                >
                  {teachers.map(teacher => (
                    <MenuItem key={teacher._id || teacher.id} value={teacher.name}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
                <TimePicker
                  label="Ora Inizio"
                  value={formData.start_time}
                  onChange={(time) => handleTimeChange('start_time', time)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  ampm={false}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={it}>
                <TimePicker
                  label="Ora Fine"
                  value={formData.end_time}
                  onChange={(time) => handleTimeChange('end_time', time)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  ampm={false}
                />
              </LocalizationProvider>
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

export default ScheduleForm;
