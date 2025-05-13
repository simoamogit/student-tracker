import ApiService from './api.service';

const SettingsService = {
  /**
   * Get user settings
   * @returns {Promise} Promise with settings data
   */
  getSettings() {
    return ApiService.get('/settings')
      .then(response => response.data)
      .catch(error => {
        console.error('Error fetching settings:', error);
        // For demo purposes, return mock data
        return {
          notifications: {
            email: true,
            push: true,
            events: true,
            communications: true,
            grades: true
          },
          appearance: {
            darkMode: localStorage.getItem('darkMode') === 'true',
            fontSize: 'medium',
            colorScheme: 'default'
          },
          privacy: {
            showGrades: true,
            showAttendance: true,
            showProfile: true
          },
          language: 'it',
          security: {
            twoFactorAuth: false,
            sessionTimeout: 30
          }
        };
      });
  },

  /**
   * Update user settings
   * @param {Object} settings - Settings object
   * @returns {Promise} Promise with updated settings
   */
  updateSettings(settings) {
    return ApiService.put('/settings', settings)
      .then(response => {
        // Save darkMode preference to localStorage for persistence
        if (settings.appearance && settings.appearance.darkMode !== undefined) {
          localStorage.setItem('darkMode', settings.appearance.darkMode);
        }
        return response.data;
      })
      .catch(error => {
        console.error('Error updating settings:', error);
        // For demo purposes, just return the settings
        if (settings.appearance && settings.appearance.darkMode !== undefined) {
          localStorage.setItem('darkMode', settings.appearance.darkMode);
        }
        return settings;
      });
  }
};

export default SettingsService;
