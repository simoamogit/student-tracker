import api from './api.service';

const EventService = {
  getEvents: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.school_year) params.append('school_year', filters.school_year);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.event_type) params.append('event_type', filters.event_type);
    if (filters.subject) params.append('subject', filters.subject);
    
    const response = await api.get(`/events?${params.toString()}`);
    return response.data;
  },
  
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  
  addEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
  
  getUpcomingEvents: async (days = 7, school_year) => {
    const params = new URLSearchParams();
    params.append('days', days);
    if (school_year) params.append('school_year', school_year);
    
    const response = await api.get(`/events/upcoming?${params.toString()}`);
    return response.data;
  },
};

export default EventService;