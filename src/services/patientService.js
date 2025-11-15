// Mock API service for patient records and assessments
const mockAssessments = {};
const mockCarePlans = {};

export const patientService = {
  // Get patient assessment
  getAssessment: async (patientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAssessments[patientId] || null);
      }, 500);
    });
  },

  // Save patient assessment
  saveAssessment: async (patientId, assessmentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockAssessments[patientId] = {
          ...assessmentData,
          patientId,
          savedAt: new Date().toISOString(),
        };
        resolve(mockAssessments[patientId]);
      }, 800);
    });
  },

  // Get care plan
  getCarePlan: async (patientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCarePlans[patientId] || null);
      }, 500);
    });
  },

  // Save care plan
  saveCarePlan: async (patientId, carePlanData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockCarePlans[patientId] = {
          ...carePlanData,
          patientId,
          savedAt: new Date().toISOString(),
        };
        resolve(mockCarePlans[patientId]);
      }, 800);
    });
  },

  // Get patient medical history
  getMedicalHistory: async (patientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          patientId,
          records: [],
          lastUpdated: new Date().toISOString(),
        });
      }, 500);
    });
  },
};
