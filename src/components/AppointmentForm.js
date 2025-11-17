import React, { useState, useCallback } from 'react';
import { Home } from 'lucide-react';
import Alert from './Alert';

const AppointmentForm = ({ 
  formData, 
  setFormData, 
  errors, 
  handleSubmit, 
  showAlert,
  setCurrentPage,
  alertState,
  setAlertState
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file);
    setAnalyzing(true);

    // Simulate OCR analysis
    setTimeout(() => {
      const extractedData = {
        name: "John Extracted",
        age: "35",
        dob: "1990-01-15",
        phone: "9876543210",
        email: "extracted@email.com",
        issue: "Extracted medical complaint from previous report"
      };

      // Auto-fill form
      setFormData(prev => ({
        ...prev,
        name: extractedData.name,
        age: extractedData.age,
        dob: extractedData.dob,
        phone: extractedData.phone,
        email: extractedData.email,
        issue: extractedData.issue
      }));

      setAnalyzing(false);
      showAlert('success', `Data extracted from ${file.name}`);
    }, 2000);
  }, [setFormData, showAlert]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Book Your Appointment</h2>
          <button 
            type="button"
            onClick={() => setCurrentPage('home')} 
            className="text-gray-600 hover:text-gray-800 transition"
          >
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

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({...prev, age: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="1"
                    max="120"
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dob"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={(e) => setFormData(prev => ({...prev, dob: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="1234567890"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    required
                    placeholder="Street address, city, state, zip code"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    id="emergencyContact"
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData(prev => ({...prev, emergencyContact: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Phone
                  </label>
                  <input
                    id="emergencyPhone"
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData(prev => ({...prev, emergencyPhone: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Upload Previous Report Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Upload Previous Report (Optional)</h3>
              <div>
                <label htmlFor="medicalReport" className="block text-sm font-medium text-gray-700 mb-1">
                  Previous Medical Report (PDF or Image)
                </label>
                <input
                  id="medicalReport"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                {analyzing && (
                  <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Analyzing document and extracting data...
                  </div>
                )}
                {uploadedFile && !analyzing && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ File uploaded: {uploadedFile.name}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Upload your previous medical reports. We'll automatically extract information to fill the form.
                </p>
              </div>
            </div>

            {/* Appointment Details Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Appointment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="appointmentDate"
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData(prev => ({...prev, appointmentDate: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.appointmentDate && <p className="text-red-500 text-xs mt-1">{errors.appointmentDate}</p>}
                </div>

                <div>
                  <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="appointmentTime"
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData(prev => ({...prev, appointmentTime: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    step="900"
                  />
                  {errors.appointmentTime && <p className="text-red-500 text-xs mt-1">{errors.appointmentTime}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">
                    Chief Complaint <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="issue"
                    name="issue"
                    value={formData.issue}
                    onChange={(e) => setFormData(prev => ({...prev, issue: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                    placeholder="Describe your symptoms or reason for visit"
                  />
                  {errors.issue && <p className="text-red-500 text-xs mt-1">{errors.issue}</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Continue to Registration
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
