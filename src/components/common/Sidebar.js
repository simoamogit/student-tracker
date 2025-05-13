import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  List, ListItem, ListItemIcon, ListItemText, Divider,
  Box, Typography, Avatar, useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Grade as GradeIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  BarChart as StatsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import AuthService from '../../services/auth.service';

const Sidebar = ({ onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const currentUser = AuthService.getCurrentUser();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Voti', icon: <GradeIcon />, path: '/grades' },
    { text: 'Statistiche Voti', icon: <StatsIcon />, path: '/grades/stats' },
    { text: 'Orario', icon: <ScheduleIcon />, path: '/schedule' },
    { text: 'Eventi', icon: <EventIcon />, path: '/events' },
    { divider: true },
    { text: 'Profilo', icon: <PersonIcon />, path: '/profile' },
    { text: 'Impostazioni', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onItemClick) onItemClick();
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <Box sx={{ overflow: 'auto' }}>
      {/* Profilo utente */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar 
          sx={{ 
            width: 64, 
            height: 64, 
            mb: 1,
            bgcolor: theme.palette.primary.main 
          }}
        >
          {currentUser?.name?.charAt(0) || 'U'}
        </Avatar>
        <Typography variant="subtitle1" noWrap>
          {currentUser?.name || 'Utente'}
        </Typography>
        <Typography variant="body2" color="textSecondary" noWrap>
          {currentUser?.email || ''}
        </Typography>
      </Box>
      
      <Divider />
      
      {/* Menu di navigazione */}
      <List>
        {menuItems.map((item, index) => (
          item.divider ? (
            <Divider key={`divider-${index}`} sx={{ my: 1 }} />
          ) : (
            <ListItem 
              button 
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: '8px',
                mx: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: `${theme.palette.primary.main}15`,
                  '&:hover': {
                    bgcolor: `${theme.palette.primary.main}25`,
                  },
                },
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}10`,
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        ))}
      </List>
      
      <Divider />
      
      {/* Logout */}
      <List>
        <ListItem 
          button 
          onClick={handleLogout}
          sx={{
            borderRadius: '8px',
            mx: 1,
            mt: 1,
            color: theme.palette.error.main,
            '&:hover': {
              bgcolor: `${theme.palette.error.main}10`,
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
