import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [patients, setPatients] = useState([
    {
      id: 'P001',
      name: 'John Doe',
      email: 'john@example.com',
      password: btoa('patient123'),
      phone: '9876543210',
      age: '35',
      gender: 'male',
      dob: '1988-05-15',
      address: '123 Main St, City',
    },
    {
      id: 'P002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: btoa('patient123'),
      phone: '9876543211',
      age: '28',
      gender: 'female',
      dob: '1995-08-20',
      address: '456 Oak Ave, City',
    },
  ]);

  const login = useCallback((email, password) => {
    const patient = patients.find((p) => p.email === email && p.password === btoa(password));
    if (patient) {
      setCurrentUser(patient);
      setIsAuthenticated(true);
      return { success: true, user: patient };
    }
    return { success: false, error: 'Invalid credentials' };
  }, [patients]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  const register = useCallback((patientData) => {
    const newPatient = {
      ...patientData,
      id: `P${String(patients.length + 1).padStart(3, '0')}`,
      password: btoa(patientData.password),
    };
    setPatients([...patients, newPatient]);
    return newPatient;
  }, [patients]);

  const updatePatient = useCallback((updatedData) => {
    const updated = patients.map((p) => (p.id === currentUser.id ? { ...p, ...updatedData } : p));
    setPatients(updated);
    setCurrentUser({ ...currentUser, ...updatedData });
  }, [patients, currentUser]);

  const value = {
    isAuthenticated,
    currentUser,
    patients,
    login,
    logout,
    register,
    updatePatient,
    setPatients,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
