import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue, pink, grey } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery';

// Crea un contesto per il tema
const ColorModeContext = createContext({ toggleColorMode: () => {} });

// Hook personalizzato per usare il tema
export const useColorMode = () => useContext(ColorModeContext);

// Provider del tema
export const AppThemeProvider = ({ children }) => {
  // Controlla se il sistema preferisce la modalità scura
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Controlla se c'è una preferenza salvata
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || (prefersDarkMode ? 'dark' : 'light');
  });

  // Aggiorna la modalità quando cambia la preferenza del sistema
  useEffect(() => {
    if (!localStorage.getItem('themeMode')) {
      setMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, [prefersDarkMode]);

  // Salva la modalità nel localStorage quando cambia
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    // Aggiunge o rimuove la classe dark-mode al body
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [mode]);

  // Funzione per cambiare la modalità
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  // Crea il tema in base alla modalità
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: blue[600],
            ...(mode === 'dark' && {
              main: blue[400],
            }),
          },
          secondary: {
            main: pink[500],
            ...(mode === 'dark' && {
              main: pink[300],
            }),
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#fff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? grey[900] : grey[100],
            secondary: mode === 'light' ? grey[700] : grey[400],
          },
        },
        shape: {
          borderRadius: 8,
        },
        typography: {
          fontFamily: [
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
          h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 500,
          },
          h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
          },
          h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
          },
          h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
          },
          h6: {
            fontSize: '1rem',
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                boxShadow: mode === 'light' 
                  ? '0 2px 8px rgba(0,0,0,0.1)' 
                  : '0 2px 8px rgba(0,0,0,0.5)',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light' 
                  ? '0 1px 4px rgba(0,0,0,0.1)' 
                  : '0 1px 4px rgba(0,0,0,0.5)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AppThemeProvider;
