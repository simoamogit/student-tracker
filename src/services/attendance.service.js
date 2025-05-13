import ApiService from './api.service';

const AttendanceService = {
  /**
   * Get attendances for a student
   * @returns {Promise} Promise with student attendances
   */
  getStudentAttendances() {
    return ApiService.get('/attendances/student')
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching student attendances:', error);
        throw error;
      });
  },

  /**
   * Get attendances for a class (teacher only)
   * @returns {Promise} Promise with class attendances
   */
  getClassAttendances() {
    return ApiService.get('/attendances/class')
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching class attendances:', error);
        throw error;
      });
  },

  /**
   * Add a new attendance record
   * @param {Object} attendance - Attendance data
   * @returns {Promise} Promise with created attendance
   */
  addAttendance(attendance) {
    return ApiService.post('/attendances', attendance)
      .then(response => response.data)
      .catch(error => {
        console.error('Error adding attendance:', error);
        throw error;
      });
  },

  /**
   * Update an attendance record
   * @param {number} id - Attendance ID
   * @param {Object} attendance - Updated attendance data
   * @returns {Promise} Promise with updated attendance
   */
  updateAttendance(id, attendance) {
    return ApiService.put(`/attendances/${id}`, attendance)
      .then(response => response.data)
      .catch(error => {
        console.error('Error updating attendance:', error);
        throw error;
      });
  },

  /**
   * Delete an attendance record
   * @param {number} id - Attendance ID
   * @returns {Promise} Promise with deletion result
   */
  deleteAttendance(id) {
    return ApiService.delete(`/attendances/${id}`)
      .then(response => response.data)
      .catch(error => {
        console.error('Error deleting attendance:', error);
        throw error;
      });
  }
};

export default AttendanceService;
