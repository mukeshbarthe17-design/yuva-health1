// Notification service for sending alerts to patients
const notificationLog = [];

export const notificationService = {
  // Send notification (email simulation)
  sendEmailNotification: async (email, subject, body) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = {
          id: `NOTIF${Date.now()}`,
          type: 'email',
          email,
          subject,
          body,
          timestamp: new Date().toISOString(),
          status: 'sent',
        };
        notificationLog.push(notification);
        console.log('Email sent:', notification);
        resolve(notification);
      }, 500);
    });
  },

  // Send SMS notification
  sendSMSNotification: async (phone, message) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = {
          id: `SMS${Date.now()}`,
          type: 'sms',
          phone,
          message,
          timestamp: new Date().toISOString(),
          status: 'sent',
        };
        notificationLog.push(notification);
        console.log('SMS sent:', notification);
        resolve(notification);
      }, 500);
    });
  },

  // Get notification history
  getNotificationHistory: async (filter = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = notificationLog;
        if (filter.type) {
          filtered = filtered.filter((n) => n.type === filter.type);
        }
        if (filter.email) {
          filtered = filtered.filter((n) => n.email === filter.email);
        }
        resolve(filtered);
      }, 300);
    });
  },

  // Schedule appointment reminder
  scheduleReminder: async (appointmentId, patientEmail, appointmentTime) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reminder = {
          id: `REM${Date.now()}`,
          appointmentId,
          patientEmail,
          appointmentTime,
          scheduledFor: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
          status: 'scheduled',
        };
        resolve(reminder);
      }, 500);
    });
  },
};
