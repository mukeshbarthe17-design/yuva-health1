// Mock API service for appointments
const mockAppointments = [
  {
    id: 'APT001',
    patientId: 'P001',
    date: '2025-11-20',
    time: '10:00',
    department: 'cardiology',
    status: 'confirmed',
    notes: 'Regular checkup',
  },
  {
    id: 'APT002',
    patientId: 'P002',
    date: '2025-11-21',
    time: '14:00',
    department: 'neurology',
    status: 'pending',
    notes: 'Follow-up consultation',
  },
];

export const appointmentService = {
  // Get all appointments
  getAppointments: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAppointments), 500);
    });
  },

  // Get appointments by patient ID
  getPatientAppointments: async (patientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAppointments.filter((apt) => apt.patientId === patientId));
      }, 500);
    });
  },

  // Book new appointment
  bookAppointment: async (appointmentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppointment = {
          id: `APT${Date.now()}`,
          ...appointmentData,
          status: 'pending',
        };
        mockAppointments.push(newAppointment);
        resolve(newAppointment);
      }, 800);
    });
  },

  // Update appointment
  updateAppointment: async (appointmentId, updatedData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockAppointments.findIndex((apt) => apt.id === appointmentId);
        if (index !== -1) {
          mockAppointments[index] = { ...mockAppointments[index], ...updatedData };
          resolve(mockAppointments[index]);
        } else {
          reject(new Error('Appointment not found'));
        }
      }, 500);
    });
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockAppointments.findIndex((apt) => apt.id === appointmentId);
        if (index !== -1) {
          mockAppointments[index].status = 'cancelled';
          resolve(mockAppointments[index]);
        } else {
          reject(new Error('Appointment not found'));
        }
      }, 500);
    });
  },
};
