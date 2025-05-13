import React, { useState } from 'react';
import {
  Paper, Grid, Typography, Box, Tabs, Tab, 
  Divider, IconButton, Tooltip, Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import DailySchedule from './DailySchedule';

const ScheduleView = ({ schedule, onEdit, onDelete, onAddToDay }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Giorni della settimana
  const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  
  // Organizza l'orario per giorno
  const scheduleByDay = days.map((day, index) => {
    return {
      day,
      dayIndex: index,
      items: schedule.filter(item => item.day === index)
        .sort((a, b) => a.start_time.localeCompare(b.start_time))
    };
  });

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleOpenDeleteDialog = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = () => {
    onDelete(itemToDelete._id);
    handleCloseDeleteDialog();
  };

  return (
    <>
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {days.map((day, index) => (
            <Tab key={index} label={day} />
          ))}
        </Tabs>
      </Paper>
      
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{days[currentTab]}</Typography>
          <Button 
            startIcon={<AddIcon />} 
            onClick={() => onAddToDay(currentTab)}
            size="small"
          >
            Aggiungi a questo giorno
          </Button>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <DailySchedule 
          scheduleItems={scheduleByDay[currentTab].items} 
          onEdit={onEdit}
          onDelete={handleOpenDeleteDialog}
        />
      </Paper>
      
      {/* Dialog di conferma eliminazione */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare questa lezione dall'orario? Questa azione non può essere annullata.
          </DialogContentText>
          {itemToDelete && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Materia:</strong> {itemToDelete.subject}
              </Typography>
              <Typography variant="body2">
                <strong>Giorno:</strong> {days[itemToDelete.day]}
              </Typography>
              <Typography variant="body2">
                <strong>Orario:</strong> {itemToDelete.start_time} - {itemToDelete.end_time}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annulla</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScheduleView;