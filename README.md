# Hospital Management System

A comprehensive React-based Hospital Management Application designed for physiotherapy clinics and hospitals, featuring patient appointment booking, medical records management, and care planning.

## Features

- **Patient Registration & Authentication**: Secure registration and login system
- **Appointment Booking**: Easy-to-use appointment scheduling system
- **Patient Dashboard**: Personalized patient portal for managing health information
- **Assessment Forms**: Digital patient assessment and vital signs recording
- **Care Planning**: Goal-setting and treatment plan creation
- **Payment Integration**: Simulated Razorpay payment processing
- **Patient Records**: Comprehensive medical history and records management

## Technology Stack

- **Frontend**: React 18.2
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Alert.js        # Alert notification component
│   ├── FormComponents.js # Form field components
│   ├── LoadingSpinner.js # Loading indicator
│   └── UI.js           # UI components (Button, Card, Badge)
├── context/            # React Context
│   └── AuthContext.js  # Authentication context
├── pages/              # Page components
├── services/           # API integration layer
│   ├── appointmentService.js
│   ├── patientService.js
│   └── paymentService.js
├── utils/              # Utility functions
│   ├── auth.js        # Authentication utilities
│   ├── helpers.js     # General helpers
│   └── validation.js  # Form validation
├── App.js             # Main application component
├── index.js           # React DOM render
└── index.css          # Global styles
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

## Usage

### Running the Application

```bash
npm start
```

The application will open at `http://localhost:3000`.

### Demo Credentials

Two demo patients are pre-configured:

**Patient 1:**
- Email: `john@example.com`
- Password: `patient123`

**Patient 2:**
- Email: `jane@example.com`
- Password: `patient123`

## Features Details

### 1. Home Page
- Welcoming landing page with service overview
- Quick access to appointment booking and login

### 2. Patient Registration
- New patient appointment form with comprehensive details
- Multi-step registration process
- Email and password setup

### 3. Patient Dashboard
- **Profile Tab**: View patient personal information
- **Assessment Tab**: Record patient assessment and vital signs
- **Care Plan Tab**: Set treatment goals and therapy plans
- **Appointments Tab**: View and manage appointments

### 4. Payment Processing
- Simulated payment gateway
- Consultation fee calculation with GST
- Transaction confirmation

## API Services

The application includes mock services that can be easily replaced with actual backend APIs:

### Appointment Service
- `getAppointments()` - Fetch all appointments
- `getPatientAppointments(patientId)` - Fetch patient-specific appointments
- `bookAppointment(data)` - Book new appointment
- `updateAppointment(id, data)` - Update existing appointment
- `cancelAppointment(id)` - Cancel appointment

### Patient Service
- `getAssessment(patientId)` - Get patient assessment
- `saveAssessment(patientId, data)` - Save assessment
- `getCarePlan(patientId)` - Get care plan
- `saveCarePlan(patientId, data)` - Save care plan

### Payment Service
- `getPaymentDetails(appointmentId)` - Get payment details
- `processPayment(data)` - Process payment
- `verifyPayment(orderId, transactionId)` - Verify payment

## Form Validation

All forms include comprehensive validation:

- **Appointment Form**: Validates all required fields including contact information and appointment details
- **Registration Form**: Email format, password strength, and confirmation match
- **Login Form**: Basic required field validation

## Styling

The application uses Tailwind CSS for styling with a consistent blue and indigo color scheme:

- Primary Color: `#2563eb` (Blue-600)
- Secondary Color: `#10b981` (Green-600)
- Neutral backgrounds using gray color palette

## Future Enhancements

- Backend API integration (Node.js/Express)
- Database implementation (MongoDB/PostgreSQL)
- Real Razorpay payment integration
- SMS/Email notifications
- Prescription management
- Lab reports integration
- Video consultation feature
- Mobile app development
- Admin dashboard

## Contributing

Contributions are welcome! Please follow the existing code structure and styles.

## License

This project is open source and available for educational and commercial use.

## Support

For support or questions, please create an issue or contact the development team.
