// Doctor/Staff management service
const mockDoctors = [
  {
    id: 'DOC001',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Cardiology',
    email: 'rajesh@medicare.com',
    phone: '9876543200',
    experience: '12 years',
    qualifications: ['MBBS', 'MD Cardiology'],
    availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
  },
  {
    id: 'DOC002',
    name: 'Dr. Priya Sharma',
    specialization: 'Neurology',
    email: 'priya@medicare.com',
    phone: '9876543201',
    experience: '8 years',
    qualifications: ['MBBS', 'MD Neurology'],
    availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'],
  },
  {
    id: 'DOC003',
    name: 'Dr. Amit Patel',
    specialization: 'Orthopedics',
    email: 'amit@medicare.com',
    phone: '9876543202',
    experience: '15 years',
    qualifications: ['MBBS', 'MS Orthopedics'],
    availableSlots: ['09:00', '11:00', '14:00', '15:00', '16:00'],
  },
];

export const doctorService = {
  // Get all doctors
  getAllDoctors: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDoctors), 500);
    });
  },

  // Get doctors by specialization
  getDoctorsBySpecialization: async (specialization) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const doctors = mockDoctors.filter(
          (d) => d.specialization.toLowerCase() === specialization.toLowerCase()
        );
        resolve(doctors);
      }, 500);
    });
  },

  // Get doctor details
  getDoctorDetails: async (doctorId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const doctor = mockDoctors.find((d) => d.id === doctorId);
        if (doctor) {
          resolve(doctor);
        } else {
          reject(new Error('Doctor not found'));
        }
      }, 500);
    });
  },

  // Get available slots
  getAvailableSlots: async (doctorId, date) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const doctor = mockDoctors.find((d) => d.id === doctorId);
        resolve(doctor?.availableSlots || []);
      }, 500);
    });
  },

  // Rate doctor
  rateDoctor: async (doctorId, rating, review) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          doctorId,
          rating,
          review,
          timestamp: new Date().toISOString(),
          status: 'saved',
        });
      }, 500);
    });
  },
};
