import React from 'react';
import {
  Box, Typography, Paper, Grid, IconButton,
  Divider, Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Room as RoomIcon,
  Person as TeacherIcon
} from '@mui/icons-material';

const DailySchedule = ({ scheduleItems, onEdit, onDelete }) => {
  // Funzione per formattare l'orario (da "14:30" a "14:30")
  const formatTime = (time) => {
    return time;
  };

  return (
    <Box>
      {scheduleItems.length > 0 ? (
        scheduleItems.map((item, index) => (
          <Paper 
            key={item._id} 
            elevation={1} 
            sx={{ 
              p: 2, 
              mb: 2, 
              borderLeft: 4, 
              borderColor: 'primary.main' 
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={2}>
                <Typography variant="h6" color="primary">
                  {formatTime(item.start_time)} - {formatTime(item.end_time)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={7}>
                <Typography variant="h6">{item.subject}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap' }}>
                  {item.teacher && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, mb: 1 }}>
                      <TeacherIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{item.teacher}</Typography>
                    </Box>
                  )}
                  
                  {item.room && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <RoomIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{item.room}</Typography>
                    </Box>
                  )}
                </Box>
                
                {item.notes && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {item.notes}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton 
                  color="primary" 
                  onClick={() => onEdit(item)}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  color="error" 
                  onClick={() => onDelete(item)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="textSecondary">
            Nessuna lezione programmata per questo giorno
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DailySchedule;