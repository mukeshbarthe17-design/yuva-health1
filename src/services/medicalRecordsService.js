// Medical records and reports service
const mockMedicalRecords = {};
const mockLabReports = [];

export const medicalRecordsService = {
  // Get patient medical history
  getMedicalHistory: async (patientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMedicalRecords[patientId] || { records: [] });
      }, 500);
    });
  },

  // Add medical record
  addMedicalRecord: async (patientId, recordData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!mockMedicalRecords[patientId]) {
          mockMedicalRecords[patientId] = { records: [] };
        }

        const record = {
          id: `REC${Date.now()}`,
          patientId,
          ...recordData,
          createdAt: new Date().toISOString(),
        };

        mockMedicalRecords[patientId].records.push(record);
        resolve(record);
      }, 800);
    });
  },

  // Upload lab report
  uploadLabReport: async (patientId, reportData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = {
          id: `LAB${Date.now()}`,
          patientId,
          ...reportData,
          uploadedAt: new Date().toISOString(),
          status: 'uploaded',
        };

        mockLabReports.push(report);
        resolve(report);
      }, 1000);
    });
  },

  // Get lab reports
  getLabReports: async (patientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reports = mockLabReports.filter(
          (r) => r.patientId === patientId
        );
        resolve(reports);
      }, 500);
    });
  },

  // Download lab report
  downloadLabReport: async (reportId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          reportId,
          downloadUrl: `/api/reports/${reportId}/download`,
          filename: `lab_report_${reportId}.pdf`,
        });
      }, 800);
    });
  },

  // Get medical summary
  getMedicalSummary: async (patientId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const history = mockMedicalRecords[patientId] || { records: [] };
        const reports = mockLabReports.filter((r) => r.patientId === patientId);

        resolve({
          patientId,
          totalRecords: history.records.length,
          totalReports: reports.length,
          lastUpdated: new Date().toISOString(),
          history: history.records,
          labReports: reports,
        });
      }, 500);
    });
  },
};
