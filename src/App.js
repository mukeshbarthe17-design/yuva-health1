import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, User, FileText, Activity, CreditCard, Clock, Phone, Mail, MapPin, Plus, Save, LogOut, Home, Download } from 'lucide-react';
import { Button, Card, Badge } from './components/UI';
import Alert from './components/Alert';
import LoadingSpinner from './components/LoadingSpinner';
import { TextInput, TextArea, SelectInput } from './components/FormComponents';
import AppointmentForm from './components/AppointmentForm';
import { validateAppointmentForm, validateRegistrationForm, validateLoginForm } from './utils/validation';
import { appointmentService } from './services/appointmentService';
import { patientService } from './services/patientService';
import { doctorService } from './services/doctorService';
import { icdService } from './services/icdService';

const HospitalManagementApp = () => {
  // Page navigation
  const [currentPage, setCurrentPage] = useState('home');
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDoctorAuthenticated, setIsDoctorAuthenticated] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  
  // Alert/notification state
  const [alertState, setAlertState] = useState({ show: false, type: 'info', message: '' });
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    appointmentDate: '',
    appointmentTime: '',
    department: '',
    issue: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('hospital_patients');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'John Doe', email: 'john@example.com', password: 'patient123', age: 35, phone: '1234567890', gender: 'male', address: '123 Main St', department: 'general', lastVisit: '2024-01-15', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'patient123', age: 28, phone: '0987654321', gender: 'female', address: '456 Oak Ave', department: 'cardiology', lastVisit: '2024-01-10', status: 'active' }
    ];
  });
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. Ahmed', specialization: 'Cardiology', email: 'doctor1@hospital.com', password: 'doctor123', phone: '1111111111', status: 'available' },
    { id: 2, name: 'Dr. Sarah', specialization: 'Neurology', email: 'doctor2@hospital.com', password: 'doctor123', phone: '2222222222', status: 'available' }
  ]);

  // Persist patients to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hospital_patients', JSON.stringify(patients));
  }, [patients]);
  
  // Helper function to show alerts
  const showAlert = useCallback((type, message) => {
    setAlertState({ show: true, type, message });
  }, []);

  // Memoized change handlers for form fields
  const formChangeHandlers = useMemo(() => ({
    name: (e) => setFormData(prev => ({...prev, name: e.target.value})),
    age: (e) => setFormData(prev => ({...prev, age: e.target.value})),
    dob: (e) => setFormData(prev => ({...prev, dob: e.target.value})),
    gender: (e) => setFormData(prev => ({...prev, gender: e.target.value})),
    phone: (e) => setFormData(prev => ({...prev, phone: e.target.value})),
    email: (e) => setFormData(prev => ({...prev, email: e.target.value})),
    address: (e) => setFormData(prev => ({...prev, address: e.target.value})),
    emergencyContact: (e) => setFormData(prev => ({...prev, emergencyContact: e.target.value})),
    emergencyPhone: (e) => setFormData(prev => ({...prev, emergencyPhone: e.target.value})),
    appointmentDate: (e) => setFormData(prev => ({...prev, appointmentDate: e.target.value})),
    appointmentTime: (e) => setFormData(prev => ({...prev, appointmentTime: e.target.value})),
    department: (e) => setFormData(prev => ({...prev, department: e.target.value})),
    issue: (e) => setFormData(prev => ({...prev, issue: e.target.value}))
  }), []);
  
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const validation = validateAppointmentForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      showAlert('error', 'Please fill in all required fields correctly');
      return;
    }
    
    // Store pending patient and go to registration
    // Generate next ID properly (max existing ID + 1)
    const nextId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    
    // Store uploaded file if exists
    const fileData = e.target.querySelector('input[type="file"]')?.files[0];
    if (fileData) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64File = event.target.result;
        localStorage.setItem(`patient_${nextId}_report`, JSON.stringify({
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
          data: base64File,
          uploadDate: new Date().toISOString()
        }));
      };
      reader.readAsDataURL(fileData);
    }
    
    const newPatient = {
      id: nextId,
      name: formData.name,
      age: Number(formData.age),
      dob: formData.dob,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      emergencyPhone: formData.emergencyPhone,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      department: formData.department || 'general',
      issue: formData.issue,
      status: 'pending',
      hasPreviousReport: !!fileData
    };
    
    console.log('Creating pending patient with ID:', nextId, 'Form data:', formData);
    localStorage.setItem('pendingPatient', JSON.stringify(newPatient));
    showAlert('info', 'Appointment details saved. Please complete your registration.');
    setTimeout(() => setCurrentPage('register'), 1000);
  }, [formData, patients, showAlert]);
  
  // Home Page
  const HomePage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Hospital Management</h1>
            <div className="flex gap-4">
              <Button onClick={() => setCurrentPage('login')} variant="outline">Patient Login</Button>
              <Button onClick={() => setCurrentPage('doctor-login')} variant="outline">Doctor Login</Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Our Hospital</h2>
          <p className="text-xl text-gray-600 mb-8">Providing comprehensive healthcare management solutions</p>
          <Button onClick={() => setCurrentPage('appointment')} size="lg">Book an Appointment</Button>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
          <Card>
            <div className="flex flex-col items-center text-center">
              <Calendar className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Schedule appointments with ease</p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col items-center text-center">
              <User className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Patient Care</h3>
              <p className="text-gray-600">Personalized healthcare solutions</p>
            </div>
          </Card>
          <Card>
            <div className="flex flex-col items-center text-center">
              <FileText className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Medical Records</h3>
              <p className="text-gray-600">Secure digital health records</p>
            </div>
          </Card>
        </div>
      </div>
    );
  };
  
  // AppointmentForm is now imported from separate file

  const AppointmentFormOLD = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">New Patient Appointment</h2>
            <button onClick={() => setCurrentPage('home')} className="text-gray-600 hover:text-gray-800">
              <Home size={24} />
            </button>
          </div>

          {alertState.show && (
            <Alert
              type={alertState.type}
              message={alertState.message}
              onClose={() => setAlertState({ show: false, type: 'info', message: '' })}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({...prev, age: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData(prev => ({...prev, dob: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.dob && <p className="text-red-600 text-sm mt-1">{errors.dob}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender<span className="text-red-600 ml-1">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email<span className="text-red-600 ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address<span className="text-red-600 ml-1">*</span>
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData(prev => ({...prev, emergencyContact: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Emergency Phone
                </label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData(prev => ({...prev, emergencyPhone: e.target.value}))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Appointment Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Date<span className="text-red-600 ml-1">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData(prev => ({...prev, appointmentDate: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {errors.appointmentDate && <p className="text-red-600 text-sm mt-1">{errors.appointmentDate}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Time<span className="text-red-600 ml-1">*</span>
                  </label>
                  <select
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData(prev => ({...prev, appointmentTime: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                  {errors.appointmentTime && <p className="text-red-600 text-sm mt-1">{errors.appointmentTime}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department<span className="text-red-600 ml-1">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({...prev, department: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="neurology">Neurology</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="general">General Medicine</option>
                  </select>
                  {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
                </div>
              </div>
              <div className="mt-6">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chief Complaint / Reason for Visit<span className="text-red-600 ml-1">*</span>
                  </label>
                  <textarea
                    value={formData.issue}
                    onChange={(e) => setFormData(prev => ({...prev, issue: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe your symptoms or reason for appointment"
                    required
                  />
                  {errors.issue && <p className="text-red-600 text-sm mt-1">{errors.issue}</p>}
                </div>
              </div>
            </div>

            <Button type="submit" fullWidth>
              Continue to Registration
            </Button>
          </form>
        </div>
      </div>
    );
  };

  // Registration Page
  const RegistrationPage = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});

    const handleRegister = (e) => {
      e.preventDefault();
      const validation = validateRegistrationForm(credentials);

      if (!validation.isValid) {
        setErrors(validation.errors);
        showAlert('error', 'Please check your input');
        return;
      }

      const pendingPatient = JSON.parse(localStorage.getItem('pendingPatient'));
      if (!pendingPatient) {
        showAlert('error', 'Please start with booking an appointment first');
        setCurrentPage('appointment');
        return;
      }

      // Check if email already exists
      if (patients.some(p => p.email === credentials.email)) {
        showAlert('error', 'Email already registered');
        setErrors({ email: 'Email already exists' });
        return;
      }

      // Create new patient with all details (use ID from pendingPatient)
      const newPatient = {
        ...pendingPatient,
        email: credentials.email,
        password: credentials.password,
        status: 'active'
      };

      // Add to patients array
      console.log('Registering new patient:', newPatient);
      setPatients([...patients, newPatient]);

      localStorage.removeItem('pendingPatient');
      showAlert('success', `Registration Successful! Patient ID: ${newPatient.id}. You can now login.`);
      setTimeout(() => setCurrentPage('login'), 2000);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8">
        <Card className="max-w-md w-full">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Complete Registration</h2>
            <button
              onClick={() => setCurrentPage('home')}
              className="text-gray-500 hover:text-gray-700"
              title="Back to home"
            >
              ✕
            </button>
          </div>
          {alertState.show && <Alert type={alertState.type} message={alertState.message} />}
          <form onSubmit={handleRegister} className="space-y-6">
            <TextInput
              label="Email"
              type="email"
              required
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({...prev, email: e.target.value}))}
              error={errors.email}
            />
            <TextInput
              label="Create Password"
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({...prev, password: e.target.value}))}
              error={errors.password}
            />
            <TextInput
              label="Confirm Password"
              type="password"
              required
              value={credentials.confirmPassword}
              onChange={(e) => setCredentials(prev => ({...prev, confirmPassword: e.target.value}))}
              error={errors.confirmPassword}
            />
            <Button type="submit" fullWidth>
              Complete Registration
            </Button>
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className="w-full px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Back to Home
            </button>
          </form>
        </Card>
      </div>
    );
  };

  // Login Page
  const LoginPage = () => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});

    const handleLogin = (e) => {
      e.preventDefault();
      const validation = validateLoginForm(loginData);

      if (!validation.isValid) {
        setErrors(validation.errors);
        showAlert('error', 'Please fill in all fields');
        return;
      }

      const patient = patients.find(p => p.email === loginData.email && p.password === loginData.password);

      if (patient) {
        setCurrentUser(patient);
        setIsAuthenticated(true);
        if (patient.appointmentDate) {
          setCurrentPage('payment');
        } else {
          setCurrentPage('dashboard');
        }
        showAlert('success', `Welcome ${patient.name}!`);
      } else {
        showAlert('error', 'Invalid credentials!');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <div className="text-center mb-2">
                <Activity className="mx-auto text-blue-600 mb-4" size={48} />
                <h2 className="text-3xl font-bold text-gray-800">Patient Login</h2>
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('home')}
              className="text-gray-500 hover:text-gray-700 ml-4"
              title="Back to home"
            >
              ✕
            </button>
          </div>

          {alertState.show && <Alert type={alertState.type} message={alertState.message} />}

          <form onSubmit={handleLogin} className="space-y-6">
            <TextInput
              label="Email"
              type="email"
              required
              value={loginData.email}
              onChange={(e) => setLoginData(prev => ({...prev, email: e.target.value}))}
              error={errors.email}
            />
            <TextInput
              label="Password"
              type="password"
              required
              value={loginData.password}
              onChange={(e) => setLoginData(prev => ({...prev, password: e.target.value}))}
              error={errors.password}
            />
            <Button type="submit" fullWidth>
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-3">New patient?</p>
            <button
              onClick={() => setCurrentPage('appointment')}
              className="text-blue-600 hover:underline font-semibold"
            >
              Book an Appointment
            </button>
          </div>
        </Card>
      </div>
    );
  };

  // Payment Page (Razorpay Integration Simulation)
  const PaymentPage = () => {
    const [paymentStatus, setPaymentStatus] = useState('pending');

    const handlePayment = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setPaymentStatus('success');
        showAlert('success', 'Payment successful!');
        setTimeout(() => {
          setCurrentPage('dashboard');
          setPaymentStatus('pending');
        }, 2000);
      } catch (error) {
        showAlert('error', 'Payment failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <div className="text-center mb-8">
            <CreditCard className="mx-auto text-blue-600 mb-4" size={48} />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment</h2>
            <p className="text-gray-600">Consultation Fee</p>
          </div>

          {alertState.show && <Alert type={alertState.type} message={alertState.message} />}

          {paymentStatus === 'pending' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-semibold">₹500</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-semibold">₹90</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-blue-600">₹590</span>
                </div>
              </div>

              <Button fullWidth icon={CreditCard} onClick={handlePayment} disabled={loading}>
                {loading ? 'Processing...' : 'Pay with Razorpay'}
              </Button>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center">
              <Badge variant="success" size="lg">Payment Successful!</Badge>
              <p className="text-sm mt-4 text-gray-600">Redirecting to dashboard...</p>
            </div>
          )}
        </Card>
      </div>
    );
  };

  // Patient Dashboard
  const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [assessmentData, setAssessmentData] = useState({
      chiefComplaint: '',
      presentingComplaint: '',
      generalHistory: '',
      medicalHistory: '',
      bloodPressure: '',
      heartRate: '',
      temperature: '',
    });
    const [carePlan, setCarePlan] = useState({
      shortTermGoals: '',
      longTermGoals: '',
      exerciseTherapy: '',
      duration: '',
      frequency: '',
    });
    const [saving, setSaving] = useState(false);
    const [patientFeedback, setPatientFeedback] = useState('');
    const [savingFeedback, setSavingFeedback] = useState(false);

    useEffect(() => {
      // load existing assessment and care plan for current patient
      (async () => {
        if (!currentUser) return;
        try {
          const existingAssessment = await patientService.getAssessment(currentUser.id);
          if (existingAssessment) setAssessmentData(existingAssessment);
          const existingCarePlan = await patientService.getCarePlan(currentUser.id);
          if (existingCarePlan) setCarePlan(existingCarePlan);
        } catch (e) {
          // ignore
        }
      })();
    }, [currentUser]);

    const handleLogout = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setCurrentPage('home');
      showAlert('success', 'Logged out successfully');
    };

    // Patients should not perform assessments in this simplified flow.
    // Assessment is moved to the Doctor Panel where doctors will save assessments.

    const handleSavePatientFeedback = async () => {
      if (!patientFeedback.trim()) {
        showAlert('error', 'Please enter feedback');
        return;
      }
      setSavingFeedback(true);
      try {
        // Save feedback with timestamp
        const feedback = {
          patientId: currentUser.id,
          note: patientFeedback,
          timestamp: new Date().toISOString(),
        };
        // In a real app, you'd save this to a service
        // For now, show success
        showAlert('success', 'Progress feedback saved!');
        setPatientFeedback('');
      } catch (error) {
        showAlert('error', 'Failed to save feedback');
      } finally {
        setSavingFeedback(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Activity className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">Patient Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {currentUser?.name}</span>
              <Button variant="danger" size="sm" icon={LogOut} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {alertState.show && <Alert type={alertState.type} message={alertState.message} onClose={() => setAlertState({ show: false, type: 'info', message: '' })} />}

          <Card className="overflow-hidden">
            <div className="flex border-b">
              {['profile', 'careplan', 'appointments', 'reports'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-6 py-4 font-semibold ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {tab === 'profile' && <User className="inline mr-2" size={20} />}
                  {tab === 'careplan' && <Activity className="inline mr-2" size={20} />}
                  {tab === 'appointments' && <Calendar className="inline mr-2" size={20} />}
                  {tab === 'reports' && <FileText className="inline mr-2" size={20} />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Profile</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="flex items-center space-x-3 p-4">
                      <User className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Patient ID</p>
                        <p className="font-semibold">{currentUser?.id}</p>
                      </div>
                    </Card>
                    <Card className="flex items-center space-x-3 p-4">
                      <User className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold">{currentUser?.name}</p>
                      </div>
                    </Card>
                    <Card className="flex items-center space-x-3 p-4">
                      <Phone className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold">{currentUser?.phone}</p>
                      </div>
                    </Card>
                    <Card className="flex items-center space-x-3 p-4">
                      <Mail className="text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold">{currentUser?.email}</p>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'assessment' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Assessment</h2>
                  <div className="space-y-4">
                    <TextArea
                      label="Chief Complaint"
                      value={assessmentData.chiefComplaint}
                      onChange={(e) => setAssessmentData(prev => ({...prev, chiefComplaint: e.target.value}))}
                      rows="3"
                      placeholder="Main reason for visit"
                    />
                    <TextArea
                      label="Presenting Complaint/Needs"
                      value={assessmentData.presentingComplaint}
                      onChange={(e) => setAssessmentData(prev => ({...prev, presentingComplaint: e.target.value}))}
                      rows="3"
                      placeholder="Detailed symptoms"
                    />
                    <h3 className="text-xl font-bold text-gray-800 mt-6">Vital Signs</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <TextInput
                        label="Blood Pressure"
                        value={assessmentData.bloodPressure}
                        onChange={(e) => setAssessmentData(prev => ({...prev, bloodPressure: e.target.value}))}
                        placeholder="120/80 mmHg"
                      />
                      <TextInput
                        label="Heart Rate"
                        value={assessmentData.heartRate}
                        onChange={(e) => setAssessmentData(prev => ({...prev, heartRate: e.target.value}))}
                        placeholder="72 bpm"
                      />
                      <TextInput
                        label="Temperature"
                        value={assessmentData.temperature}
                        onChange={(e) => setAssessmentData(prev => ({...prev, temperature: e.target.value}))}
                        placeholder="98.6°F"
                      />
                    </div>
                    <Button icon={Save} variant="secondary" disabled>
                      Assessments are performed by doctors
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'careplan' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Goal Setting / Care Plan</h2>
                  
                  {/* Progress Display */}
                  <div className="flex items-center space-x-6 mb-6 bg-blue-50 p-6 rounded-lg">
                    <div>
                      <h4 className="text-sm text-gray-600 font-semibold">Care Plan Progress</h4>
                      <div className="mt-3">
                        <ProgressCircle percent={computeCarePlanProgress(carePlan)} />
                      </div>
                    </div>
                    <div className="flex-1 text-sm text-gray-700">
                      <p>This shows your progress on tasks as set by your doctor.</p>
                    </div>
                  </div>

                  {/* Doctor-Set Care Plan (Read-Only) */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Doctor's Care Plan</h3>
                    {carePlan.shortTermGoals ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Short Term Goals</label>
                          <div className="mt-1 p-3 bg-white rounded border border-gray-200 text-gray-800">{carePlan.shortTermGoals}</div>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Long Term Goals</label>
                          <div className="mt-1 p-3 bg-white rounded border border-gray-200 text-gray-800">{carePlan.longTermGoals}</div>
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Exercise / Manual Therapy</label>
                          <div className="mt-1 p-3 bg-white rounded border border-gray-200 text-gray-800">{carePlan.exerciseTherapy}</div>
                        </div>
                        {Array.isArray(carePlan.exercises) && carePlan.exercises.length > 0 && (
                          <div>
                            <label className="text-sm font-semibold text-gray-700">Prescribed Exercises</label>
                            <div className="mt-1 p-3 bg-white rounded border border-gray-200 text-gray-800">
                              <ul className="list-disc pl-5">
                                {carePlan.exercises.map((ex, i) => (
                                  <li key={i} className="mb-1">{ex}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-semibold text-gray-700">Duration</label>
                            <div className="mt-1 p-3 bg-white rounded border border-gray-200 text-gray-800">{carePlan.duration}</div>
                          </div>
                          <div>
                            <label className="text-sm font-semibold text-gray-700">Frequency</label>
                            <div className="mt-1 p-3 bg-white rounded border border-gray-200 text-gray-800">{carePlan.frequency}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">No care plan set by doctor yet.</p>
                    )}
                  </div>

                  {/* Patient Feedback / Progress Notes */}
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Your Progress / Feedback</h3>
                    <TextArea
                      label="Enter your progress notes and feedback"
                      value={patientFeedback}
                      onChange={(e) => setPatientFeedback(e.target.value)}
                      rows="4"
                      placeholder="E.g., I completed 3 exercises today, feeling better mobility..."
                    />
                    <div className="mt-4">
                      <Button icon={Save} onClick={handleSavePatientFeedback} disabled={savingFeedback}>
                        {savingFeedback ? 'Saving...' : 'Save Progress Note'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appointments' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
                    <Button icon={Plus} onClick={() => setCurrentPage('appointment')}>
                      Book New
                    </Button>
                  </div>

                  {currentUser?.appointmentDate ? (
                    <Card className="border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Calendar className="text-blue-600" size={20} />
                            <span className="font-semibold">{currentUser.appointmentDate}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="text-blue-600" size={20} />
                            <span className="font-semibold">{currentUser.appointmentTime}</span>
                          </div>
                          <Badge variant="success">Confirmed</Badge>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                      <p>No appointments scheduled</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Previous Medical Reports</h2>
                  {(() => {
                    const reportKey = `patient_${currentUser.id}_report`;
                    const reportData = localStorage.getItem(reportKey);
                    if (reportData) {
                      const report = JSON.parse(reportData);
                      return (
                        <Card className="border border-gray-200">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <FileText className="text-blue-600" size={24} />
                                <div>
                                  <h3 className="font-semibold text-lg">{report.name}</h3>
                                  <p className="text-sm text-gray-600">
                                    Uploaded: {new Date(report.uploadDate).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Size: {(report.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                icon={Download}
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = report.data;
                                  link.download = report.name;
                                  link.click();
                                }}
                              >
                                Download
                              </Button>
                            </div>
                            {report.type.startsWith('image/') && (
                              <div className="mt-4">
                                <img
                                  src={report.data}
                                  alt="Medical Report"
                                  className="max-w-full h-auto border border-gray-300 rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    } else {
                      return (
                        <div className="text-center py-12 text-gray-500">
                          <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                          <p>No previous reports uploaded</p>
                          <p className="text-sm mt-2">Upload reports when booking an appointment</p>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // Small helper: compute care plan progress (expects carePlan.tasks = [{ title, completed }])
  const computeCarePlanProgress = (carePlan) => {
    if (!carePlan) return 0;
    if (Array.isArray(carePlan.tasks) && carePlan.tasks.length > 0) {
      const total = carePlan.tasks.length;
      const completed = carePlan.tasks.filter((t) => t.completed).length;
      return Math.round((completed / total) * 100);
    }
    // fallback: if carePlan contains completed and total fields
    if (carePlan.completedTasks != null && carePlan.totalTasks != null && carePlan.totalTasks > 0) {
      return Math.round((carePlan.completedTasks / carePlan.totalTasks) * 100);
    }
    return 0;
  };

  const ProgressCircle = ({ percent = 0, size = 80 }) => {
    const stroke = 8;
    const normalizedRadius = (size - stroke) / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
      <svg height={size} width={size} className="mx-auto">
        <circle
          stroke="#e6e6e6"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="#3b82f6"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <text x="50%" y="50%" dy=".3em" textAnchor="middle" fontSize="14" fill="#111827">
          {percent}%
        </text>
      </svg>
    );
  };

  // Doctor Login Page
  const DoctorLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loadingDoctorLogin, setLoadingDoctorLogin] = useState(false);

    const handleDoctorLogin = async (e) => {
      e.preventDefault();
      setLoadingDoctorLogin(true);
      try {
        // find doctor by email
        const docs = doctors || [];
        const doc = docs.find((d) => d.email === email);
        // simple password match (demo): accept 'doctor123' or doctor.password if provided
        if (doc && (password === 'doctor123' || doc.password === password)) {
          setCurrentDoctor(doc);
          setIsDoctorAuthenticated(true);
          setCurrentPage('doctor-panel');
          showAlert('success', `Welcome Dr. ${doc.name}`);
        } else {
          showAlert('error', 'Invalid doctor credentials');
        }
      } catch (err) {
        showAlert('error', 'Login failed');
      } finally {
        setLoadingDoctorLogin(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Doctor Login</h2>
          {alertState.show && <Alert type={alertState.type} message={alertState.message} />}
          <form onSubmit={handleDoctorLogin} className="space-y-4">
            <TextInput label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextInput label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button fullWidth onClick={handleDoctorLogin} disabled={loadingDoctorLogin}>{loadingDoctorLogin ? 'Signing in...' : 'Sign in'}</Button>
            <div className="text-sm text-gray-600">Demo tip: use any doctor email from the system and password <strong>doctor123</strong></div>
          </form>
        </Card>
      </div>
    );
  };

  // Doctor Panel / Dashboard
  const DoctorPanel = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientAssessment, setPatientAssessment] = useState({
      chiefComplaint: '',
      presentingComplaint: '',
      generalHistory: '',
      medicalHistory: '',
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      // selected diagnosis codes (ICD/ICF)
      selectedCodes: [],
    });
    const [carePlanInput, setCarePlanInput] = useState({ 
      shortTermGoals: '', 
      longTermGoals: '', 
      exerciseTherapy: '', 
      duration: '', 
      frequency: '',
      completedCount: 0 
    });
  const [diseaseQuery, setDiseaseQuery] = useState('');
  const [icdResults, setIcdResults] = useState([]);
  const [loadingIcdSearch, setLoadingIcdSearch] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
    const [savingByDoctor, setSavingByDoctor] = useState(false);

    useEffect(() => {
      if (selectedPatient) {
        (async () => {
          const existing = await patientService.getAssessment(selectedPatient.id);
          if (existing) setPatientAssessment({ ...existing, selectedCodes: existing.selectedCodes || existing.diagnoses || [] });
          const existingPlan = await patientService.getCarePlan(selectedPatient.id);
          if (existingPlan) {
            setCarePlanInput({
              shortTermGoals: existingPlan.shortTermGoals || '',
              longTermGoals: existingPlan.longTermGoals || '',
              exerciseTherapy: existingPlan.exerciseTherapy || '',
              duration: existingPlan.duration || '',
              frequency: existingPlan.frequency || '',
              completedCount: existingPlan.completedTasks || 0,
            });
            // preselect exercises if present
            if (Array.isArray(existingPlan.exercises)) setSelectedExercises(existingPlan.exercises || []);
          }
        })();
      }
    }, [selectedPatient]);

    const performIcdSearch = async () => {
      const q = (diseaseQuery || '').trim();
      if (!q) return;
      setLoadingIcdSearch(true);
      try {
        const res = await icdService.lookupICD(q);
        console.log('ICD/ICF Search Results:', res);
        console.log('Total:', res?.length, 'ICD:', res?.filter(r => r.source?.includes('ICD')).length, 'ICF:', res?.filter(r => r.source?.includes('ICF')).length);
        if (res && res.length > 0) console.log('Sample result:', res[0]);
        // keep raw items if present; otherwise map
        setIcdResults(Array.isArray(res) ? res : []);
      } catch (e) {
        console.error('ICD Search Error:', e);
        setIcdResults([]);
      } finally {
        setLoadingIcdSearch(false);
      }
    };

    // Auto-search when doctor types a query (debounced)
    useEffect(() => {
      const q = (diseaseQuery || '').trim();
      if (q.length < 2) {
        setIcdResults([]);
        return;
      }
      const t = setTimeout(() => {
        performIcdSearch();
      }, 350);
      return () => clearTimeout(t);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [diseaseQuery]);

    const toggleAddCode = (item) => {
      // item should have code and description at minimum. Avoid duplicates by code+desc
      const key = `${item.code || item.id || item.name || ''}::${item.description || item.desc || ''}`;
      setPatientAssessment((prev) => {
        const existing = Array.isArray(prev.selectedCodes) ? prev.selectedCodes.slice() : [];
        const foundIndex = existing.findIndex((c) => `${c.code || c.id || ''}::${c.description || c.desc || ''}` === key);
        if (foundIndex >= 0) {
          // remove
          existing.splice(foundIndex, 1);
        } else {
          existing.push(item);
        }
        return { ...prev, selectedCodes: existing };
      });
    };

    const removeSelectedCode = (idx) => {
      setPatientAssessment((prev) => {
        const existing = Array.isArray(prev.selectedCodes) ? prev.selectedCodes.slice() : [];
        existing.splice(idx, 1);
        return { ...prev, selectedCodes: existing };
      });
    };

    const handleSaveByDoctor = async () => {
      if (!selectedPatient) return showAlert('error', 'Select a patient first');
      setSavingByDoctor(true);
      try {
        // save assessment
        await patientService.saveAssessment(selectedPatient.id, { ...patientAssessment, assessedBy: currentDoctor?.id });

        // Build care plan with all fields
        const carePlanToSave = {
          shortTermGoals: carePlanInput.shortTermGoals,
          longTermGoals: carePlanInput.longTermGoals,
          exerciseTherapy: carePlanInput.exerciseTherapy,
          duration: carePlanInput.duration,
          frequency: carePlanInput.frequency,
          exercises: selectedExercises,
          completedTasks: Number(carePlanInput.completedCount || 0),
          totalTasks: selectedExercises.length || 1,
          updatedBy: currentDoctor?.id,
        };

        await patientService.saveCarePlan(selectedPatient.id, carePlanToSave);
        // update local patients list so UI reflects new care plan immediately
        setPatients((prev) => prev.map((p) => (p.id === selectedPatient.id ? { ...p, carePlan: carePlanToSave } : p)));
        setSelectedPatient((prev) => prev ? { ...prev, carePlan: carePlanToSave } : prev);
        showAlert('success', 'Assessment and care plan saved for patient');
      } catch (err) {
        showAlert('error', 'Failed to save assessment/care plan');
      } finally {
        setSavingByDoctor(false);
      }
    };

    const handleDoctorLogout = () => {
      setIsDoctorAuthenticated(false);
      setCurrentDoctor(null);
      setCurrentPage('home');
    };

    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Activity className="text-blue-600" size={28} />
              <h1 className="text-xl font-bold">Doctor Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Dr. {currentDoctor?.name}</span>
              <Button variant="danger" size="sm" icon={LogOut} onClick={handleDoctorLogout}>Logout</Button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <Card className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">Patients</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{patients.length} total</span>
                </div>
                <div className="space-y-2 max-h-96 overflow-auto">
                  {patients.length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-4">No patients registered yet</div>
                  )}
                  {patients.map((p) => (
                    <button key={p.id} onClick={() => setSelectedPatient(p)} className={`w-full text-left p-2 rounded ${selectedPatient?.id === p.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-gray-600">PID: {p.id} • {p.age} yrs • {p.gender}</div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="col-span-2">
              <Card className="p-6">
                {!selectedPatient && (
                  <div className="text-center text-gray-500">Select a patient to view details and perform assessment</div>
                )}

                {selectedPatient && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                        <div className="text-sm text-gray-600">ID: {selectedPatient.id} • Age: {selectedPatient.age}</div>
                        <div className="text-sm text-gray-600">Phone: {selectedPatient.phone}</div>
                      </div>
                      <div className="w-32">
                        {/* care plan progress */}
                        <h4 className="text-sm text-gray-600 text-center">Care Plan Progress</h4>
                        <div className="mt-2">
                          <ProgressCircle percent={computeCarePlanProgress(selectedPatient.carePlan || {})} />
                        </div>
                      </div>
                    </div>

                    {/* Previous Reports Section */}
                    {selectedPatient.hasPreviousReport && (() => {
                      const reportKey = `patient_${selectedPatient.id}_report`;
                      const reportData = localStorage.getItem(reportKey);
                      if (reportData) {
                        const report = JSON.parse(reportData);
                        return (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-bold mb-3 flex items-center">
                              <FileText className="mr-2 text-blue-600" size={20} />
                              Previous Medical Report
                            </h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <FileText className="text-blue-600" size={24} />
                                <div>
                                  <h4 className="font-semibold">{report.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    Uploaded: {new Date(report.uploadDate).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Size: {(report.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={Download}
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = report.data;
                                  link.download = report.name;
                                  link.click();
                                }}
                              >
                                Download
                              </Button>
                            </div>
                            {report.type.startsWith('image/') && (
                              <div className="mt-4">
                                <img
                                  src={report.data}
                                  alt="Medical Report Preview"
                                  className="max-w-full h-64 object-contain border border-gray-300 rounded-lg bg-white"
                                />
                              </div>
                            )}
                          </div>
                        );
                      }
                    })()}

                    <div>
                      <h3 className="font-bold mb-2">Assessment</h3>
                      <TextArea label="Chief Complaint" value={patientAssessment.chiefComplaint} onChange={(e)=>setPatientAssessment(prev => ({...prev, chiefComplaint: e.target.value}))} rows="2" />
                      <TextArea label="Presenting Complaint" value={patientAssessment.presentingComplaint} onChange={(e)=>setPatientAssessment(prev => ({...prev, presentingComplaint: e.target.value}))} rows="2" />
                      <div className="grid md:grid-cols-3 gap-4 mt-3">
                        <TextInput label="Blood Pressure" value={patientAssessment.bloodPressure} onChange={(e)=>setPatientAssessment(prev => ({...prev, bloodPressure: e.target.value}))} />
                        <TextInput label="Heart Rate" value={patientAssessment.heartRate} onChange={(e)=>setPatientAssessment(prev => ({...prev, heartRate: e.target.value}))} />
                        <TextInput label="Temperature" value={patientAssessment.temperature} onChange={(e)=>setPatientAssessment(prev => ({...prev, temperature: e.target.value}))} />
                      </div>
                    </div>

                    {/* Diagnosis lookup: ICD / ICF search and selection */}
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <h3 className="font-bold mb-3">Diagnosis Lookup (ICD / ICF)</h3>
                      <div className="flex items-center gap-3">
                        <TextInput placeholder="Type disease or symptom and press Search" value={diseaseQuery} onChange={(e) => setDiseaseQuery(e.target.value)} />
                        <Button onClick={performIcdSearch} disabled={loadingIcdSearch}>{loadingIcdSearch ? 'Searching...' : 'Search'}</Button>
                        <Button variant="ghost" onClick={() => { setDiseaseQuery(''); setIcdResults([]); }}>Clear</Button>
                      </div>

                      {/* Results Summary */}
                      {icdResults.length > 0 && (
                        <div className="mt-3">
                          <div className="flex gap-4 text-sm">
                            <span className="text-gray-600">
                              Total: <span className="font-semibold">{icdResults.length}</span>
                            </span>
                            <span className="text-blue-600">
                              ICD-10-CM: <span className="font-semibold">{icdResults.filter(r => (r.source || '').includes('ICD')).length}</span>
                            </span>
                            <span className="text-purple-600">
                              ICF: <span className="font-semibold">{icdResults.filter(r => (r.source || '').includes('ICF')).length}</span>
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500 italic">
                            💡 Tip: For more ICF codes, try functional terms like "body functions", "activities participation", "sensation", "mobility", "movement"
                          </div>
                        </div>
                      )}

                      <div className="mt-3 space-y-3">
                        {icdResults.length === 0 && !loadingIcdSearch && (
                          <div className="text-sm text-gray-500">No results yet. Try a different query.</div>
                        )}
                        {loadingIcdSearch && (
                          <div className="text-sm text-blue-600 animate-pulse">Searching ICD-10-CM and ICF databases...</div>
                        )}

                        {icdResults.map((it, idx) => {
                          const code = it.code || it.id || it.icd || it.name || '';
                          const desc = it.description || it.desc || it.title || it.name || '';
                          const source = it.source || 'Unknown';
                          const score = it.score != null ? Number(it.score) : 0;
                          const scorePercent = (score * 100).toFixed(1);
                          const accuracy = score > 0.7 ? 'High' : score > 0.4 ? 'Medium' : 'Low';
                          const accuracyColor = score > 0.7 ? 'text-green-600' : score > 0.4 ? 'text-yellow-600' : 'text-orange-600';
                          const isSelected = (patientAssessment.selectedCodes || []).findIndex((c) => (c.code || c.id || c.name) === code && (c.description || c.desc || '') === desc) >= 0;
                          const isICD = source.includes('ICD');
                          const isICF = source.includes('ICF');
                          
                          return (
                            <div key={idx} className={`p-4 bg-white rounded-lg border-2 ${isSelected ? 'border-blue-400 bg-blue-50' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                  {/* Header with code, rank, and source badge */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-lg text-gray-900">{code}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isICD ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                      {source}
                                    </span>
                                    <span className="text-xs text-gray-500">#{idx + 1}</span>
                                    {score > 0 && (
                                      <div className="flex items-center gap-1 ml-auto">
                                        <span className={`text-xs font-semibold ${accuracyColor}`}>{accuracy}</span>
                                        <span className="text-xs text-gray-500">({scorePercent}%)</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Description */}
                                  <div className="text-sm font-medium text-gray-800 mb-2">{desc}</div>

                                  {/* Match snippet */}
                                  {it.match_snippet && it.match_snippet !== desc && (
                                    <div className="text-xs text-gray-600 italic mb-2 pl-3 border-l-2 border-gray-300">
                                      Match: {it.match_snippet}
                                    </div>
                                  )}

                                  {/* Chapter (for ICD) */}
                                  {isICD && it.chapter && (
                                    <div className="text-xs text-blue-600 mt-2">
                                      <span className="font-semibold">Chapter:</span> {it.chapter}
                                    </div>
                                  )}

                                  {/* Component (for ICF) */}
                                  {isICF && it.component && (
                                    <div className="text-xs text-purple-600 mt-2">
                                      <span className="font-semibold">Component:</span> {it.component}
                                    </div>
                                  )}

                                  {/* Notes section */}
                                  {it.notes && Object.keys(it.notes).length > 0 && (
                                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                                      <div className="font-semibold text-gray-700 mb-1">Clinical Notes:</div>
                                      {Object.entries(it.notes).map(([key, val], i) => {
                                        if (!val) return null;
                                        const valStr = Array.isArray(val) ? val.join(', ') : typeof val === 'object' ? JSON.stringify(val) : String(val);
                                        if (valStr.length > 200) return null; // Skip very long notes
                                        return (
                                          <div key={i} className="mb-1">
                                            <span className="font-medium text-gray-600 capitalize">{key}:</span>{' '}
                                            <span className="text-gray-700">{valStr.substring(0, 150)}{valStr.length > 150 ? '...' : ''}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Metadata */}
                                  {it.meta && Object.keys(it.meta).length > 0 && (
                                    <div className="mt-2 text-xs text-gray-500">
                                      <details className="cursor-pointer">
                                        <summary className="font-semibold hover:text-gray-700">Additional Metadata</summary>
                                        <div className="mt-1 pl-3">
                                          {Object.entries(it.meta).slice(0, 5).map(([k, v], i) => (
                                            <div key={i}><span className="font-medium">{k}:</span> {String(v).substring(0, 100)}</div>
                                          ))}
                                        </div>
                                      </details>
                                    </div>
                                  )}
                                </div>

                                {/* Add/Remove button */}
                                <div className="flex flex-col items-end gap-2">
                                  <Button size="sm" variant={isSelected ? 'secondary' : 'primary'} onClick={() => toggleAddCode(it)}>
                                    {isSelected ? '✓ Added' : '+ Add'}
                                  </Button>
                                  {score > 0 && (
                                    <div className="w-16 h-16 relative">
                                      <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                                        <circle 
                                          cx="32" cy="32" r="28" 
                                          stroke={score > 0.7 ? '#10b981' : score > 0.4 ? '#f59e0b' : '#f97316'} 
                                          strokeWidth="4" 
                                          fill="none"
                                          strokeDasharray={`${score * 176} 176`}
                                          className="transition-all duration-500"
                                        />
                                      </svg>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs font-bold text-gray-700">{scorePercent}%</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected codes */}
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-2">Selected Diagnosis Codes ({(patientAssessment.selectedCodes || []).length})</h4>
                        {(patientAssessment.selectedCodes || []).length === 0 && <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">No codes selected yet</div>}
                        <div className="space-y-2">
                          {(patientAssessment.selectedCodes || []).map((c, i) => {
                            const isICD = (c.source || '').includes('ICD');
                            const isICF = (c.source || '').includes('ICF');
                            const score = c.score ? (Number(c.score) * 100).toFixed(0) : null;
                            return (
                              <div key={i} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-900">{c.code || c.id || c.name}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${isICD ? 'bg-blue-600 text-white' : isICF ? 'bg-purple-600 text-white' : 'bg-gray-600 text-white'}`}>
                                      {c.source || 'Unknown'}
                                    </span>
                                    {score && <span className="text-xs text-gray-600">({score}%)</span>}
                                  </div>
                                  <div className="text-sm text-gray-700">{c.description || c.desc || ''}</div>
                                  {c.chapter && <div className="text-xs text-blue-600 mt-1">Chapter: {c.chapter}</div>}
                                  {c.component && <div className="text-xs text-purple-600 mt-1">Component: {c.component}</div>}
                                </div>
                                <button 
                                  onClick={() => removeSelectedCode(i)} 
                                  className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-sm font-bold transition"
                                  title="Remove code"
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-3 text-lg">Care Plan</h3>
                      <div className="space-y-4">
                        <TextArea 
                          label="Short Term Goals" 
                          value={carePlanInput.shortTermGoals} 
                          onChange={(e)=>setCarePlanInput(prev => ({...prev, shortTermGoals: e.target.value}))} 
                          rows="2"
                          placeholder="e.g., Reduce pain, Improve mobility"
                        />
                        <TextArea 
                          label="Long Term Goals" 
                          value={carePlanInput.longTermGoals} 
                          onChange={(e)=>setCarePlanInput(prev => ({...prev, longTermGoals: e.target.value}))} 
                          rows="2"
                          placeholder="e.g., Walking independently, Return to work"
                        />
                        <TextArea 
                          label="Exercise / Manual Therapy" 
                          value={carePlanInput.exerciseTherapy} 
                          onChange={(e)=>setCarePlanInput(prev => ({...prev, exerciseTherapy: e.target.value}))} 
                          rows="3"
                          placeholder="Describe exercises, techniques, and therapy details"
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                          <TextInput 
                            label="Duration" 
                            value={carePlanInput.duration} 
                            onChange={(e)=>setCarePlanInput(prev => ({...prev, duration: e.target.value}))}
                            placeholder="e.g., 30 minutes"
                          />
                          <TextInput 
                            label="Frequency" 
                            value={carePlanInput.frequency} 
                            onChange={(e)=>setCarePlanInput(prev => ({...prev, frequency: e.target.value}))}
                            placeholder="e.g., 3 times per week"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 block mb-2">Completed Tasks (for progress)</label>
                          <TextInput 
                            type="number" 
                            value={carePlanInput.completedCount} 
                            onChange={(e)=>setCarePlanInput(prev => ({...prev, completedCount: e.target.value}))}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm text-gray-600 font-semibold">Progress Preview</h4>
                          <div className="mt-3 flex justify-center">
                            <ProgressCircle percent={Number(carePlanInput.completedCount || 0)} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button icon={Save} onClick={handleSaveByDoctor} disabled={savingByDoctor}>{savingByDoctor ? 'Saving...' : 'Save Assessment & Care Plan'}</Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'appointment' && <AppointmentForm formData={formData} setFormData={setFormData} errors={errors} handleSubmit={handleSubmit} showAlert={showAlert} setCurrentPage={setCurrentPage} alertState={alertState} setAlertState={setAlertState} />}
      {currentPage === 'register' && <RegistrationPage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'doctor-login' && <DoctorLoginPage />}
      {currentPage === 'doctor-panel' && isDoctorAuthenticated && <DoctorPanel />}
      {currentPage === 'payment' && <PaymentPage />}
      {currentPage === 'dashboard' && isAuthenticated && <Dashboard />}
    </div>
  );
};

export default HospitalManagementApp;
