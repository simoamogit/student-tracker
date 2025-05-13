import React from 'react';
import {
  List, ListItem, ListItemText, Typography, Box, Divider
} from '@mui/material';
import {
  Room as RoomIcon,
  Person as TeacherIcon
} from '@mui/icons-material';

const TodaySchedule = ({ schedule }) => {
  // Ordina l'orario per ora di inizio
  const sortedSchedule = [...schedule].sort((a, b) => 
    a.start_time.localeCompare(b.start_time)
  );

  return (
    <Box>
      {sortedSchedule.length > 0 ? (
        <List>
          {sortedSchedule.map((item, index) => (
            <React.Fragment key={item._id}>
              {index > 0 && <Divider component="li" />}
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body1" component="span">
                        {item.subject}
                      </Typography>
                      <Typography variant="body2" color="primary" component="span">
                        {item.start_time} - {item.end_time}
                      </Typography>
                    </Box>
                  }
                  secondary={
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
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="textSecondary">
            Nessuna lezione programmata per oggi
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TodaySchedule;