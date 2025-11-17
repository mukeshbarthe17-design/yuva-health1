import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Hospital Management App - Appointment Booking Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders home page with navigation', () => {
    render(<App />);
    expect(screen.getByText(/Welcome to Our Hospital/i)).toBeInTheDocument();
    expect(screen.getByText(/Book an Appointment/i)).toBeInTheDocument();
  });

  test('navigates to appointment form when clicking Book Appointment', async () => {
    render(<App />);
    const bookButton = screen.getByText(/Book an Appointment/i);
    fireEvent.click(bookButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Book Your Appointment/i)).toBeInTheDocument();
    });
  });

  test('appointment form has all required fields', async () => {
    render(<App />);
    
    // Navigate to appointment form
    const bookButton = screen.getByText(/Book an Appointment/i);
    fireEvent.click(bookButton);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    });
  });

  test('allows typing in form input fields without losing focus', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Navigate to appointment form
    fireEvent.click(screen.getByText(/Book an Appointment/i));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Full Name/i);
    await user.type(nameInput, 'John Doe');
    
    expect(nameInput).toHaveValue('John Doe');
  });

  test('validates required fields on form submission', async () => {
    render(<App />);
    
    fireEvent.click(screen.getByText(/Book an Appointment/i));
    
    await waitFor(() => {
      const submitButton = screen.getByText(/Continue to Registration/i);
      fireEvent.click(submitButton);
    });

    // HTML5 validation should prevent submission
    const nameInput = screen.getByLabelText(/Full Name/i);
    expect(nameInput).toBeRequired();
  });

  test('file upload section is present', async () => {
    render(<App />);
    
    fireEvent.click(screen.getByText(/Book an Appointment/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Upload Previous Report/i)).toBeInTheDocument();
      const fileInput = screen.getByLabelText(/Previous Medical Report/i);
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('type', 'file');
    });
  });

  test('submits appointment form with valid data', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    fireEvent.click(screen.getByText(/Book an Appointment/i));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    });

    // Fill out the form
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Age/i), '35');
    await user.type(screen.getByLabelText(/Date of Birth/i), '1990-01-15');
    
    const genderSelect = screen.getByLabelText(/Gender/i);
    await user.selectOptions(genderSelect, 'male');
    
    await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
    await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Address/i), '123 Main St');
    
    // Fill appointment details
    await user.type(screen.getByLabelText(/Preferred Date/i), '2025-12-01');
    await user.type(screen.getByLabelText(/Preferred Time/i), '10:00');
    await user.type(screen.getByLabelText(/Chief Complaint/i), 'Back pain');

    // Submit form
    const submitButton = screen.getByText(/Continue to Registration/i);
    fireEvent.click(submitButton);

    // Check if data is stored in localStorage
    await waitFor(() => {
      const pendingPatients = JSON.parse(localStorage.getItem('pendingPatients') || '[]');
      expect(pendingPatients.length).toBeGreaterThan(0);
      expect(pendingPatients[0].name).toBe('John Doe');
    });
  });
});

describe('Patient Login and Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    // Set up a test patient
    const patients = [{
      id: 1,
      name: 'Test Patient',
      email: 'test@example.com',
      password: 'password123',
      age: 30,
      phone: '1234567890',
      appointmentDate: '2025-12-01',
      appointmentTime: '10:00',
      status: 'approved'
    }];
    localStorage.setItem('patients', JSON.stringify(patients));
  });

  test('patient can login with valid credentials', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    fireEvent.click(screen.getByText(/Patient Login/i));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');
    
    fireEvent.click(screen.getByText(/Sign in/i));

    await waitFor(() => {
      expect(screen.getByText(/Patient Dashboard/i)).toBeInTheDocument();
    });
  });

  test('patient dashboard shows tabs', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Login
    fireEvent.click(screen.getByText(/Patient Login/i));
    await waitFor(() => screen.getByLabelText(/Email/i));
    
    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');
    fireEvent.click(screen.getByText(/Sign in/i));

    await waitFor(() => {
      expect(screen.getByText(/Profile/i)).toBeInTheDocument();
      expect(screen.getByText(/Careplan/i)).toBeInTheDocument();
      expect(screen.getByText(/Appointments/i)).toBeInTheDocument();
      expect(screen.getByText(/Reports/i)).toBeInTheDocument();
    });
  });

  test('reports tab shows message when no reports uploaded', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    fireEvent.click(screen.getByText(/Patient Login/i));
    await waitFor(() => screen.getByLabelText(/Email/i));
    
    await user.type(screen.getByLabelText(/Email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'password123');
    fireEvent.click(screen.getByText(/Sign in/i));

    await waitFor(() => {
      expect(screen.getByText(/Reports/i)).toBeInTheDocument();
    });

    const reportsTab = screen.getByText(/Reports/i);
    fireEvent.click(reportsTab);

    await waitFor(() => {
      expect(screen.getByText(/No previous reports uploaded/i)).toBeInTheDocument();
    });
  });
});

describe('Doctor Login and Panel', () => {
  beforeEach(() => {
    localStorage.clear();
    const doctors = [{
      id: 1,
      name: 'Dr. Smith',
      email: 'doctor@example.com',
      specialization: 'Physiotherapy'
    }];
    localStorage.setItem('doctors', JSON.stringify(doctors));
  });

  test('doctor can login with valid credentials', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    fireEvent.click(screen.getByText(/Doctor Login/i));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/Email/i), 'doctor@example.com');
    await user.type(screen.getByLabelText(/Password/i), 'doctor123');
    
    const signInButtons = screen.getAllByText(/Sign in/i);
    fireEvent.click(signInButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Dr. Smith/i)).toBeInTheDocument();
    });
  });
});

describe('Form Input Focus Bug Tests', () => {
  test('name input maintains focus while typing multiple characters', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    fireEvent.click(screen.getByText(/Book an Appointment/i));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Full Name/i);
    
    // Type multiple characters
    await user.type(nameInput, 'John');
    expect(nameInput).toHaveValue('John');
    
    // Continue typing
    await user.type(nameInput, ' Doe');
    expect(nameInput).toHaveValue('John Doe');
  });

  test('email input maintains focus while typing', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    fireEvent.click(screen.getByText(/Book an Appointment/i));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/Email Address/i);
    
    await user.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');
  });

  test('phone input maintains focus while typing', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    fireEvent.click(screen.getByText(/Book an Appointment/i));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    });

    const phoneInput = screen.getByLabelText(/Phone Number/i);
    
    await user.type(phoneInput, '1234567890');
    expect(phoneInput).toHaveValue('1234567890');
  });

  test('address textarea maintains focus while typing', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    fireEvent.click(screen.getByText(/Book an Appointment/i));
    
    await waitFor(() => {
      const addressField = document.getElementById('address');
      expect(addressField).toBeInTheDocument();
    });

    const addressInput = document.getElementById('address');
    
    await user.type(addressInput, '123 Main Street, City, State 12345');
    expect(addressInput).toHaveValue('123 Main Street, City, State 12345');
  });
});
