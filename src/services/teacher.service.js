import apiService from './api.service';

const TeacherService = {
  getTeachers: async () => {
    try {
      const response = await apiService.get('/teachers');
      return response.data;
    } catch (error) {
      // Se non ci sono insegnanti nel database, restituisci un elenco predefinito
      console.warn('Impossibile caricare gli insegnanti dal server, uso predefiniti', error);
      return [
        { id: 1, name: 'Prof. Rossi' },
        { id: 2, name: 'Prof.ssa Bianchi' },
        { id: 3, name: 'Prof. Verdi' },
        { id: 4, name: 'Prof.ssa Neri' },
        { id: 5, name: 'Prof. Gialli' }
      ];
    }
  },

  addTeacher: async (teacherData) => {
    const response = await apiService.post('/teachers', teacherData);
    return response.data;
  },

  updateTeacher: async (id, teacherData) => {
    const response = await apiService.put(`/teachers/${id}`, teacherData);
    return response.data;
  },

  deleteTeacher: async (id) => {
    const response = await apiService.delete(`/teachers/${id}`);
    return response.data;
  }
};

export default TeacherService;
