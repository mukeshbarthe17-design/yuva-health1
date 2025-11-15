// Form validation utilities
export const validateAppointmentForm = (formData) => {
  const errors = {};

  if (!formData.name?.trim()) errors.name = 'Name is required';
  if (!formData.email?.trim()) errors.email = 'Email is required';
  if (!formData.phone?.trim()) errors.phone = 'Phone is required';
  if (!formData.age) errors.age = 'Age is required';
  if (!formData.dob) errors.dob = 'Date of birth is required';
  if (!formData.gender) errors.gender = 'Gender is required';
  if (!formData.address?.trim()) errors.address = 'Address is required';
  if (!formData.appointmentDate) errors.appointmentDate = 'Appointment date is required';
  if (!formData.appointmentTime) errors.appointmentTime = 'Appointment time is required';
  if (!formData.department) errors.department = 'Department is required';
  if (!formData.issue?.trim()) errors.issue = 'Chief complaint is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegistrationForm = (data) => {
  const errors = {};

  if (!data.email?.trim()) errors.email = 'Email is required';
  if (!data.password) errors.password = 'Password is required';
  if (!data.confirmPassword) errors.confirmPassword = 'Confirm password is required';
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  if (data.password && data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (data) => {
  const errors = {};

  if (!data.email?.trim()) errors.email = 'Email is required';
  if (!data.password) errors.password = 'Password is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
