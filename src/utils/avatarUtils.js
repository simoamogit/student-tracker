/**
 * Utility functions for avatar handling
 */

/**
 * Generate initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (up to 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  const parts = name.split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate a consistent color based on a string
 * @param {string} str - Input string
 * @returns {string} Hex color code
 */
export const stringToColor = (str) => {
  if (!str) return '#9e9e9e';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

/**
 * Generate avatar props based on a name
 * @param {string} name - Full name
 * @returns {object} Avatar props including sx styles
 */
export const getAvatarProps = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: getInitials(name),
  };
};

/**
 * Get avatar URL for a user
 * @param {object} user - User object
 * @returns {string|null} Avatar URL or null if not available
 */
export const getAvatarUrl = (user) => {
  if (!user) return null;
  
  // Return profile picture if available
  if (user.profilePicture) {
    return user.profilePicture;
  }
  
  // Otherwise return null (will use initials)
  return null;
};

export function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: getInitials(name),
  };
}
