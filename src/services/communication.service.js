import ApiService from './api.service';

const CommunicationService = {
  /**
   * Get all communications for the current user
   * @returns {Promise} Promise with communications data
   */
  getCommunications() {
    return ApiService.get('/communications')
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching communications:', error);
        
        // For demo purposes, return mock data
        const mockCommunications = [
          {
            id: 1,
            title: 'Riunione genitori-insegnanti',
            content: 'Si comunica che il giorno 15 novembre 2023 si terrà la riunione genitori-insegnanti dalle ore 17:00 alle ore 19:00. Si prega di prenotare il colloquio tramite il registro elettronico.',
            date: '2023-10-25',
            sender: 'Segreteria',
            type: 'announcement',
            read: true,
            important: true,
            attachments: [
              { id: 1, name: 'calendario_colloqui.pdf', size: '245 KB' }
            ]
          },
          {
            id: 2,
            title: 'Uscita didattica al museo',
            content: 'Si comunica che il giorno 10 novembre 2023 è prevista un\'uscita didattica al Museo di Storia Naturale. Il costo è di 15€ per studente. Si prega di consegnare l\'autorizzazione firmata entro il 5 novembre.',
            date: '2023-10-20',
            sender: 'Prof. Bianchi',
            type: 'event',
            read: false,
            important: true,
            attachments: [
              { id: 2, name: 'autorizzazione_uscita.pdf', size: '180 KB' },
              { id: 3, name: 'programma_visita.pdf', size: '320 KB' }
            ]
          },
          {
            id: 3,
            title: 'Recupero lezione di matematica',
            content: 'Si comunica che la lezione di matematica del 18 ottobre verrà recuperata il giorno 30 ottobre dalle ore 14:00 alle ore 15:00 in aula 3B.',
            date: '2023-10-16',
            sender: 'Prof. Rossi',
            type: 'message',
            read: true,
            important: false,
            attachments: []
          },
          {
            id: 4,
            title: 'Chiusura scuola per festività',
            content: 'Si comunica che la scuola rimarrà chiusa nei giorni 1 e 2 novembre 2023 in occasione della festività di Ognissanti.',
            date: '2023-10-15',
            sender: 'Segreteria',
            type: 'announcement',
            read: true,
            important: false,
            attachments: []
          },
          {
            id: 5,
            title: 'Consegna compiti di italiano',
            content: 'Si ricorda che i compiti di italiano assegnati il 10 ottobre dovranno essere consegnati entro il 30 ottobre.',
            date: '2023-10-12',
            sender: 'Prof. Verdi',
            type: 'homework',
            read: false,
            important: true,
            attachments: [
              { id: 4, name: 'traccia_tema.pdf', size: '150 KB' }
            ]
          }
        ];
        
        return mockCommunications;
      });
  },

  /**
   * Get a specific communication by ID
   * @param {number} id - Communication ID
   * @returns {Promise} Promise with communication data
   */
  getCommunication(id) {
    return ApiService.get(`/communications/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error fetching communication ${id}:`, error);
        throw error;
      });
  },

  /**
   * Mark a communication as read
   * @param {number} id - Communication ID
   * @returns {Promise} Promise with updated communication
   */
  markAsRead(id) {
    return ApiService.put(`/communications/${id}/read`, { read: true })
      .then(response => response.data)
      .catch(error => {
        console.error(`Error marking communication ${id} as read:`, error);
        throw error;
      });
  },

  /**
   * Send a new communication (teacher/admin only)
   * @param {Object} communication - Communication data
   * @returns {Promise} Promise with created communication
   */
  sendCommunication(communication) {
    return ApiService.post('/communications', communication)
      .then(response => response.data)
      .catch(error => {
        console.error('Error sending communication:', error);
        throw error;
      });
  },

  /**
   * Delete a communication (teacher/admin only)
   * @param {number} id - Communication ID
   * @returns {Promise} Promise with deletion result
   */
  deleteCommunication(id) {
    return ApiService.delete(`/communications/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error deleting communication ${id}:`, error);
        throw error;
      });
  },

  /**
   * Get unread communications count
   * @returns {Promise} Promise with unread count
   */
  getUnreadCount() {
    return ApiService.get('/communications/unread/count')
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching unread count:', error);
        
        // For demo purposes, calculate from mock data
        const mockCommunications = [
          { id: 1, read: true },
          { id: 2, read: false },
          { id: 3, read: true },
          { id: 4, read: true },
          { id: 5, read: false }
        ];
        
        return { count: mockCommunications.filter(c => !c.read).length };
      });
  }
};

export default CommunicationService;
