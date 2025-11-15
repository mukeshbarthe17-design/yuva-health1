// Prescription management service
const mockPrescriptions = [];

export const prescriptionService = {
  // Get prescriptions for patient
  getPrescriptions: async (patientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const prescriptions = mockPrescriptions.filter(
          (p) => p.patientId === patientId
        );
        resolve(prescriptions);
      }, 500);
    });
  },

  // Create new prescription
  createPrescription: async (patientId, prescriptionData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const prescription = {
          id: `PRE${Date.now()}`,
          patientId,
          ...prescriptionData,
          createdAt: new Date().toISOString(),
          status: 'active',
        };
        mockPrescriptions.push(prescription);
        resolve(prescription);
      }, 800);
    });
  },

  // Update prescription
  updatePrescription: async (prescriptionId, updatedData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockPrescriptions.findIndex(
          (p) => p.id === prescriptionId
        );
        if (index !== -1) {
          mockPrescriptions[index] = {
            ...mockPrescriptions[index],
            ...updatedData,
            updatedAt: new Date().toISOString(),
          };
          resolve(mockPrescriptions[index]);
        } else {
          reject(new Error('Prescription not found'));
        }
      }, 500);
    });
  },

  // Get prescription details
  getPrescriptionDetails: async (prescriptionId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const prescription = mockPrescriptions.find(
          (p) => p.id === prescriptionId
        );
        if (prescription) {
          resolve(prescription);
        } else {
          reject(new Error('Prescription not found'));
        }
      }, 500);
    });
  },

  // Download prescription (PDF)
  downloadPrescription: async (prescriptionId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          prescriptionId,
          downloadUrl: `/api/prescriptions/${prescriptionId}/download`,
          filename: `prescription_${prescriptionId}.pdf`,
        });
      }, 1000);
    });
  },
};
