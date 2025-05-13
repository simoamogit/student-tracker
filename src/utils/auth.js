import AuthService from '../services/auth.service';

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  return AuthService.isLoggedIn();
};

/**
 * Get current user
 * @returns {Object|null} Current user or null
 */
export const getCurrentUser = () => {
  return AuthService.getCurrentUser();
};

/**
 * Check if current user is a student
 * @returns {boolean} True if user is a student
 */
export const isStudent = () => {
  const user = getCurrentUser();
  return user && user.role === 'student';
};

/**
 * Check if current user is a teacher
 * @returns {boolean} True if user is a teacher
 */
export const isTeacher = () => {
  const user = getCurrentUser();
  return user && user.role === 'teacher';
};

/**
 * Check if current user is an admin
 * @returns {boolean} True if user is an admin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

/**
 * Check if current user has a specific role
 * @param {string|Array} roles - Role or array of roles to check
 * @returns {boolean} True if user has any of the specified roles
 */
export const hasRole = (roles) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
};

/**
 * Get user's full name
 * @param {Object} user - User object (optional, uses current user if not provided)
 * @returns {string} User's full name
 */
export const getUserFullName = (user = null) => {
  const userObj = user || getCurrentUser();
  if (!userObj) return '';
  
  return `${userObj.firstName} ${userObj.lastName}`;
};

/**
 * Get user's initials
 * @param {Object} user - User object (optional, uses current user if not provided)
 * @returns {string} User's initials
 */
export const getUserInitials = (user = null) => {
  const userObj = user || getCurrentUser();
  if (!userObj) return '';
  
  return `${userObj.firstName.charAt(0)}${userObj.lastName.charAt(0)}`.toUpperCase();
};

/**
 * Get user's class
 * @param {Object} user - User object (optional, uses current user if not provided)
 * @returns {string} User's class or empty string if not a student
 */
export const getUserClass = (user = null) => {
  const userObj = user || getCurrentUser();
  if (!userObj || userObj.role !== 'student') return '';
  
  return userObj.class || '';
};

/**
 * Get user's profile picture URL
 * @param {Object} user - User object (optional, uses current user if not provided)
 * @returns {string|null} Profile picture URL or null
 */
export const getUserProfilePicture = (user = null) => {
  const userObj = user || getCurrentUser();
  if (!userObj) return null;
  
  return userObj.profilePicture || null;
};

/**
 * Logout user
 */
export const logout = () => {
  AuthService.logout();
  window.location.href = '/login';
};
