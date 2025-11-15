// Mock API service for payment processing
export const paymentService = {
  // Get payment details
  getPaymentDetails: async (appointmentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          consultationFee: 500,
          gst: 90,
          total: 590,
          currency: 'INR',
        });
      }, 500);
    });
  },

  // Process payment (Razorpay simulation)
  processPayment: async (paymentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          orderId: `ORD${Date.now()}`,
          status: 'success',
          amount: paymentData.amount,
          transactionId: `TXN${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
        });
      }, 2000);
    });
  },

  // Verify payment
  verifyPayment: async (orderId, transactionId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'verified',
          orderId,
          transactionId,
        });
      }, 500);
    });
  },
};
