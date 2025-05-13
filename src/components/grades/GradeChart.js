import React, { useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { formatDate } from '../../utils/dateUtils';

// Registra i componenti necessari per Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GradeChart = ({ grades, title = 'Andamento Voti', height = 300 }) => {
  const theme = useTheme();
  
  // Ordina i voti per data
  const sortedGrades = useMemo(() => {
    if (!grades || !grades.length) return [];
    return [...grades].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [grades]);

  // Raggruppa i voti per materia
  const gradesBySubject = useMemo(() => {
    if (!sortedGrades.length) return {};
    
    return sortedGrades.reduce((acc, grade) => {
      const subject = grade.subject;
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(grade);
      return acc;
    }, {});
  }, [sortedGrades]);

  // Prepara i dati per il grafico
  const chartData = useMemo(() => {
    if (!sortedGrades.length) return null;
    
    // Estrai tutte le date uniche
    const allDates = [...new Set(sortedGrades.map(grade => formatDate(grade.date)))];
    
    // Colori predefiniti per le linee
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
      '#9c27b0', // purple
      '#ff9800', // orange
      '#795548', // brown
      '#607d8b', // blue-grey
    ];
    
    // Crea i dataset per ogni materia
    const datasets = Object.keys(gradesBySubject).map((subject, index) => {
      const subjectGrades = gradesBySubject[subject];
      const color = colors[index % colors.length];
      
      // Mappa i voti alle date
      const data = allDates.map(date => {
        const gradeForDate = subjectGrades.find(g => formatDate(g.date) === date);
        return gradeForDate ? gradeForDate.value : null;
      });
      
      return {
        label: subject,
        data,
        borderColor: color,
        backgroundColor: `${color}33`, // Colore con opacità
        pointBackgroundColor: color,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3, // Rende la linea leggermente curva
        spanGaps: true, // Connette i punti anche se ci sono valori null
      };
    });
    
    return {
      labels: allDates,
      datasets,
    };
  }, [sortedGrades, gradesBySubject, theme]);

  // Opzioni del grafico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return `Data: ${tooltipItems[0].label}`;
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.raw || 'N/D'}`;
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  if (!chartData || !sortedGrades.length) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          height, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Nessun dato disponibile per il grafico
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height: `${height}px` }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default GradeChart;
