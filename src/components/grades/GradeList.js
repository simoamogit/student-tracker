import React, { useState } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Chip, Typography,
  TablePagination, Box, Tooltip, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

const GradeList = ({ grades, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDeleteDialog = (grade) => {
    setGradeToDelete(grade);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setGradeToDelete(null);
  };

  const confirmDelete = () => {
    onDelete(gradeToDelete._id);
    handleCloseDeleteDialog();
  };

  // Funzione per determinare il colore del voto
  const getGradeColor = (value) => {
    if (value >= 8) return 'success';
    if (value >= 6) return 'primary';
    if (value >= 5) return 'warning';
    return 'error';
  };

  // Calcola le righe da visualizzare nella pagina corrente
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - grades.length) : 0;
  const visibleGrades = grades.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="tabella voti">
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Materia</TableCell>
                <TableCell>Voto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Semestre</TableCell>
                <TableCell>Note</TableCell>
                <TableCell align="right">Azioni</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleGrades.length > 0 ? (
                visibleGrades.map((grade) => (
                  <TableRow key={grade._id} hover>
                    <TableCell>{formatDate(grade.date)}</TableCell>
                    <TableCell>{grade.subject}</TableCell>
                    <TableCell>
                      <Chip 
                        label={grade.value} 
                        color={getGradeColor(grade.value)}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      {grade.grade_type === 'written' ? 'Scritto' : 
                       grade.grade_type === 'oral' ? 'Orale' : 
                       grade.grade_type === 'practical' ? 'Pratico' : 'Altro'}
                    </TableCell>
                    <TableCell>{grade.semester}</TableCell>
                    <TableCell>
                      {grade.notes ? (
                        <Tooltip title={grade.notes}>
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => onEdit(grade)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleOpenDeleteDialog(grade)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      Nessun voto trovato
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={grades.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Righe per pagina:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} di ${count}`}
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
            Sei sicuro di voler eliminare questo voto? Questa azione non può essere annullata.
          </DialogContentText>
          {gradeToDelete && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Materia:</strong> {gradeToDelete.subject}
              </Typography>
              <Typography variant="body2">
                <strong>Voto:</strong> {gradeToDelete.value}
              </Typography>
              <Typography variant="body2">
                <strong>Data:</strong> {formatDate(gradeToDelete.date)}
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

export default GradeList;