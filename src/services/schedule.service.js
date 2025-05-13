import api from './api.service';

const ScheduleService = {
  getSchedule: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.school_year) params.append('school_year', filters.school_year);
    if (filters.day !== undefined) params.append('day', filters.day);
    
    const response = await api.get(`/schedule?${params.toString()}`);
    return response.data;
  },
  
  getTodaySchedule: async (school_year) => {
    const params = new URLSearchParams();
    if (school_year) params.append('school_year', school_year);
    
    const response = await api.get(`/schedule/today?${params.toString()}`);
    return response.data;
  },
  
  addScheduleItem: async (itemData) => {
    const response = await api.post('/schedule', itemData);
    return response.data;
  },
  
  updateScheduleItem: async (id, itemData) => {
    const response = await api.put(`/schedule/${id}`, itemData);
    return response.data;
  },
  
  deleteScheduleItem: async (id) => {
    const response = await api.delete(`/schedule/${id}`);
    return response.data;
  },
};

export default ScheduleService;