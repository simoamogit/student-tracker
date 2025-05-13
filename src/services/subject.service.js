import apiService from './api.service';

const SubjectService = {
  getSubjects: async () => {
    try {
      const response = await apiService.get('/subjects');
      return response.data;
    } catch (error) {
      // Se non ci sono materie nel database, restituisci un elenco predefinito
      console.warn('Impossibile caricare le materie dal server, uso predefinite', error);
      return [
        { id: 1, name: 'Italiano' },
        { id: 2, name: 'Matematica' },
        { id: 3, name: 'Storia' },
        { id: 4, name: 'Geografia' },
        { id: 5, name: 'Inglese' },
        { id: 6, name: 'Scienze' },
        { id: 7, name: 'Fisica' },
        { id: 8, name: 'Chimica' },
        { id: 9, name: 'Arte' },
        { id: 10, name: 'Educazione Fisica' },
        { id: 11, name: 'Informatica' }
      ];
    }
  },

  addSubject: async (subjectData) => {
    const response = await apiService.post('/subjects', subjectData);
    return response.data;
  },

  updateSubject: async (id, subjectData) => {
    const response = await apiService.put(`/subjects/${id}`, subjectData);
    return response.data;
  },

  deleteSubject: async (id) => {
    const response = await apiService.delete(`/subjects/${id}`);
    return response.data;
  }
};

export default SubjectService;
