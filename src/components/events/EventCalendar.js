import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/it';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Paper, Typography, Button, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight, Today } from '@mui/icons-material';

// Configura moment per l'italiano
moment.locale('it');
const localizer = momentLocalizer(moment);

const EventCalendar = ({ events, onEdit, onDelete, onAdd }) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');

  // Formatta gli eventi per il calendario
  const formattedEvents = events.map(event => ({
    id: event._id,
    title: event.title,
    start: new Date(event.date),
    end: new Date(event.date),
    allDay: true,
    resource: event
  }));

  // Gestisce il click su un evento
  const handleSelectEvent = (event) => {
    const confirmed = window.confirm(
      `"${event.title}"\n\nVuoi modificare questo evento?`
    );
    if (confirmed) {
      onEdit(event.resource);
    }
  };

  // Gestisce il click su uno slot vuoto
  const handleSelectSlot = ({ start }) => {
    onAdd({ date: start });
  };

  // Componenti personalizzati per la toolbar
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };

    const goToView = (view) => {
      toolbar.onView(view);
      setView(view);
    };

    const viewNames = {
      month: 'Mese',
      week: 'Settimana',
      day: 'Giorno',
      agenda: 'Agenda'
    };

    return (
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2,
        gap: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={goToBack}
            startIcon={<ChevronLeft />}
          >
            Precedente
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={goToToday}
            startIcon={<Today />}
          >
            Oggi
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={goToNext}
            endIcon={<ChevronRight />}
          >
            Successivo
          </Button>
        </Box>
        
        <Typography variant="h6">
          {toolbar.label}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['month', 'week', 'day', 'agenda'].map(viewName => (
            <Button
              key={viewName}
              variant={view === viewName ? "contained" : "outlined"}
              size="small"
              onClick={() => goToView(viewName)}
            >
              {viewNames[viewName]}
            </Button>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: 700, borderRadius: 2 }}>
      <Calendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        defaultDate={currentDate}
        onNavigate={date => setCurrentDate(date)}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        popup
        components={{
          toolbar: CustomToolbar
        }}
        messages={{
          today: 'Oggi',
          previous: 'Precedente',
          next: 'Successivo',
          month: 'Mese',
          week: 'Settimana',
          day: 'Giorno',
          agenda: 'Agenda',
          date: 'Data',
          time: 'Ora',
          event: 'Evento',
          noEventsInRange: 'Nessun evento in questo periodo'
        }}
      />
    </Paper>
  );
};

export default EventCalendar;
