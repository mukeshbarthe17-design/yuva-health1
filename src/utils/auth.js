// Authentication utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Password should be at least 6 characters
  return password.length >= 6;
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateAge = (age) => {
  const ageNum = parseInt(age);
  return ageNum >= 18 && ageNum <= 120;
};

export const getPatientIdFromEmail = (email) => {
  return `P${Date.now()}`;
};

export const hashPassword = (password) => {
  // Simple hash function - in production, use bcrypt or similar
  return btoa(password);
};

export const verifyPassword = (password, hash) => {
  return btoa(password) === hash;
};
