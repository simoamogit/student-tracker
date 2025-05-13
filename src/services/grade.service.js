import ApiService from './api.service';

const GradeService = {
  /**
   * Get grades for current student
   * @returns {Promise} Promise with grades data
   */
  getStudentGrades() {
    return ApiService.get('/grades/student')
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching student grades:', error);
        
        // For demo purposes, return mock data
        const mockGrades = [
          {
            id: 1,
            subject: 'Matematica',
            value: 8.5,
            date: '2023-10-15',
            description: 'Verifica sui limiti',
            weight: 1,
            teacher: 'Prof. Bianchi',
            type: 'written'
          },
          {
            id: 2,
            subject: 'Italiano',
            value: 7,
            date: '2023-10-10',
            description: 'Tema argomentativo',
            weight: 1,
            teacher: 'Prof. Rossi',
            type: 'written'
          },
          {
            id: 3,
            subject: 'Storia',
            value: 6.5,
            date: '2023-10-05',
            description: 'Interrogazione sulla Rivoluzione Francese',
            weight: 1,
            teacher: 'Prof. Verdi',
            type: 'oral'
          },
          {
            id: 4,
            subject: 'Inglese',
            value: 9,
            date: '2023-09-28',
            description: 'Reading comprehension',
            weight: 0.5,
            teacher: 'Prof. Smith',
            type: 'written'
          },
          {
            id: 5,
            subject: 'Fisica',
            value: 7.5,
            date: '2023-09-20',
            description: 'Esercizi su moto rettilineo uniforme',
            weight: 1,
            teacher: 'Prof. Bianchi',
            type: 'practical'
          }
        ];
        
        return mockGrades;
        return mockGrades;
      });
  },

  /**
   * Get grades for a class (teacher only)
   * @param {string} classId - Class ID
   * @returns {Promise} Promise with class grades data
   */
  getClassGrades(classId) {
    return ApiService.get(`/grades/class/${classId}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching class grades:', error);
        
        // For demo purposes, return mock data
        const mockGrades = [
          {
            id: 1,
            subject: 'Matematica',
            value: 8.5,
            date: '2023-10-15',
            description: 'Verifica sui limiti',
            weight: 1,
            student: 'Mario Rossi',
            studentId: 1,
            type: 'written'
          },
          {
            id: 2,
            subject: 'Matematica',
            value: 7,
            date: '2023-10-15',
            description: 'Verifica sui limiti',
            weight: 1,
            student: 'Luca Bianchi',
            studentId: 2,
            type: 'written'
          },
          {
            id: 3,
            subject: 'Matematica',
            value: 6.5,
            date: '2023-10-15',
            description: 'Verifica sui limiti',
            weight: 1,
            student: 'Giulia Verdi',
            studentId: 3,
            type: 'written'
          },
          {
            id: 4,
            subject: 'Italiano',
            value: 9,
            date: '2023-10-10',
            description: 'Tema argomentativo',
            weight: 1,
            student: 'Mario Rossi',
            studentId: 1,
            type: 'written'
          },
          {
            id: 5,
            subject: 'Italiano',
            value: 7.5,
            date: '2023-10-10',
            description: 'Tema argomentativo',
            weight: 1,
            student: 'Luca Bianchi',
            studentId: 2,
            type: 'written'
          }
        ];
        
        return mockGrades;
      });
  },

  /**
   * Add a new grade
   * @param {Object} grade - Grade data
   * @returns {Promise} Promise with created grade
   */
  addGrade(grade) {
    return ApiService.post('/grades', grade)
      .then(response => response.data)
      .catch(error => {
        console.error('Error adding grade:', error);
        throw error;
      });
  },

  /**
   * Update a grade
   * @param {number} id - Grade ID
   * @param {Object} grade - Updated grade data
   * @returns {Promise} Promise with updated grade
   */
  updateGrade(id, grade) {
    return ApiService.put(`/grades/${id}`, grade)
      .then(response => response.data)
      .catch(error => {
        console.error('Error updating grade:', error);
        throw error;
      });
  },

  /**
   * Delete a grade
   * @param {number} id - Grade ID
   * @returns {Promise} Promise with deletion result
   */
  deleteGrade(id) {
    return ApiService.delete(`/grades/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error deleting grade:', error);
        throw error;
      });
  },

  /**
   * Get grade statistics for a student
   * @returns {Promise} Promise with grade statistics
   */
  getStudentGradeStats() {
    return ApiService.get('/grades/stats/student')
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching student grade stats:', error);
        
        // For demo purposes, return mock data
        return {
          average: 7.7,
          bySubject: [
            { subject: 'Matematica', average: 8.5, count: 1 },
            { subject: 'Italiano', average: 7.0, count: 1 },
            { subject: 'Storia', average: 6.5, count: 1 },
            { subject: 'Inglese', average: 9.0, count: 1 },
            { subject: 'Fisica', average: 7.5, count: 1 }
          ],
          byMonth: [
            { month: 'Settembre', average: 8.25, count: 2 },
            { month: 'Ottobre', average: 7.33, count: 3 }
          ],
          byType: [
            { type: 'written', average: 8.17, count: 3 },
            { type: 'oral', average: 6.5, count: 1 },
            { type: 'practical', average: 7.5, count: 1 }
          ],
          trend: [
            { date: '2023-09-20', value: 7.5 },
            { date: '2023-09-28', value: 9.0 },
            { date: '2023-10-05', value: 6.5 },
            { date: '2023-10-10', value: 7.0 },
            { date: '2023-10-15', value: 8.5 }
          ]
        };
      });
  },

  /**
   * Get grade statistics for a class (teacher only)
   * @param {string} classId - Class ID
   * @returns {Promise} Promise with class grade statistics
   */
  getClassGradeStats(classId) {
    return ApiService.get(`/grades/stats/class/${classId}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching class grade stats:', error);
        
        // For demo purposes, return mock data
        return {
          average: 7.7,
          bySubject: [
            { subject: 'Matematica', average: 7.33, count: 3 },
            { subject: 'Italiano', average: 8.25, count: 2 }
          ],
          byStudent: [
            { student: 'Mario Rossi', studentId: 1, average: 8.75, count: 2 },
            { student: 'Luca Bianchi', studentId: 2, average: 7.25, count: 2 },
            { student: 'Giulia Verdi', studentId: 3, average: 6.5, count: 1 }
          ],
          distribution: [
            { range: '0-3', count: 0 },
            { range: '3-4', count: 0 },
            { range: '4-5', count: 0 },
            { range: '5-6', count: 0 },
            { range: '6-7', count: 1 },
            { range: '7-8', count: 2 },
            { range: '8-9', count: 1 },
            { range: '9-10', count: 1 }
          ]
        };
      });
  }
};

export default GradeService;
