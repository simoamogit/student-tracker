import { format, parseISO, isValid, isToday, isThisWeek, isThisMonth, addDays } from 'date-fns';
import { it } from 'date-fns/locale';

/**
 * Format a date string to a localized format
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  let dateObj;
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }
  
  if (!isValid(dateObj)) return '';
  
  return format(dateObj, formatStr, { locale: it });
};

/**
 * Format a date string to a localized format with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date with time
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Check if a date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const checkIsToday = (date) => {
  if (!date) return false;
  
  let dateObj;
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }
  
  if (!isValid(dateObj)) return false;
  
  return isToday(dateObj);
};

/**
 * Check if a date is in this week
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in this week
 */
export const checkIsThisWeek = (date) => {
  if (!date) return false;
  
  let dateObj;
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }
  
  if (!isValid(dateObj)) return false;
  
  return isThisWeek(dateObj, { weekStartsOn: 1 }); // Week starts on Monday
};

/**
 * Check if a date is in this month
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in this month
 */
export const checkIsThisMonth = (date) => {
  if (!date) return false;
  
  let dateObj;
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }
  
  if (!isValid(dateObj)) return false;
  
  return isThisMonth(dateObj);
};

/**
 * Get the day name from a date
 * @param {string|Date} date - Date to get day name from
 * @returns {string} Day name
 */
export const getDayName = (date) => {
  return formatDate(date, 'EEEE');
};

/**
 * Get the short day name from a date
 * @param {string|Date} date - Date to get short day name from
 * @returns {string} Short day name
 */
export const getShortDayName = (date) => {
  return formatDate(date, 'EEE');
};

/**
 * Get the month name from a date
 * @param {string|Date} date - Date to get month name from
 * @returns {string} Month name
 */
export const getMonthName = (date) => {
  return formatDate(date, 'MMMM');
};

/**
 * Get the short month name from a date
 * @param {string|Date} date - Date to get short month name from
 * @returns {string} Short month name
 */
export const getShortMonthName = (date) => {
  return formatDate(date, 'MMM');
};

/**
 * Get an array of dates for the current week
 * @returns {Array} Array of date objects for the current week
 */
export const getCurrentWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Adjust to get Monday as the first day
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  // Get Monday of current week
  const monday = new Date(today);
  monday.setDate(today.getDate() - diff);
  
  // Generate array of dates for the week
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date);
  }
  
  return weekDates;
};

/**
 * Get the relative time description for a date
 * @param {string|Date} date - Date to get relative time for
 * @returns {string} Relative time description
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  let dateObj;
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }
  
  if (!isValid(dateObj)) return '';
  
  const now = new Date();
  const diffTime = Math.abs(now - dateObj);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (isToday(dateObj)) {
    return 'Oggi';
  } else if (isToday(addDays(dateObj, 1))) {
    return 'Ieri';
  } else if (isToday(addDays(dateObj, -1))) {
    return 'Domani';
  } else if (diffDays < 7) {
    return formatDate(dateObj, 'EEEE');
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} settimane fa`;
  } else if (diffDays < 365) {
    return formatDate(dateObj, 'd MMMM');
  } else {
    return formatDate(dateObj, 'd MMMM yyyy');
  }
};

export function getRelativeDateDescription(date) {
  // esempio finto
  return "Oggi"; 
}
