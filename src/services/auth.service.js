import ApiService from './api.service';

const AuthService = {
  /**
   * Login user and save token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Promise with user data
   */
  login(email, password) {
    return ApiService.post('/auth/login', { email, password })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          ApiService.setAuthHeader(response.data.token);
        }
        return response.data;
      })
      .catch(error => {
        console.error('Login error:', error);
        
        // For demo purposes, simulate successful login with mock data
        if (process.env.NODE_ENV === 'development') {
          const mockUser = {
            id: 1,
            firstName: 'Mario',
            lastName: 'Rossi',
            email: email,
            role: email.includes('teacher') ? 'teacher' : 'student',
            class: '3A',
            profilePicture: null
          };
          
          const mockToken = 'mock-jwt-token';
          
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          ApiService.setAuthHeader(mockToken);
          
          return { user: mockUser, token: mockToken };
        }
        
        throw error;
      });
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise with registration result
   */
  register(userData) {
    return ApiService.post('/auth/register', userData)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Registration error:', error);
        throw error;
      });
  },

  /**
   * Logout user and remove token
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    ApiService.removeAuthHeader();
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} Current user or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn() {
    return !!this.getCurrentUser() && !!localStorage.getItem('token');
  },

  /**
   * Check if current user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean} True if user has the role
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }
};

export default AuthService;
