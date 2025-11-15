# Hospital Management App - FAQ & Troubleshooting

## Frequently Asked Questions

### Installation & Setup

#### Q: How do I install the project?
**A:** 
```bash
cd c:\Users\Lenovo\projects\physio\main
npm install
npm start
```

#### Q: What are the system requirements?
**A:**
- Node.js v14 or higher
- npm v6 or higher
- 500MB free disk space
- Modern web browser (Chrome, Firefox, Safari, Edge)

#### Q: The npm install is taking too long?
**A:** This is normal for first-time installation. Try:
```bash
npm install --prefer-offline --no-audit
```

#### Q: Do I need to install Tailwind CSS separately?
**A:** No, it's already configured in the project. Just run `npm install`.

---

### Running the Application

#### Q: How do I start the development server?
**A:**
```bash
npm start
```
The app will open automatically at http://localhost:3000

#### Q: How do I stop the development server?
**A:** Press `Ctrl + C` in the terminal.

#### Q: Can I run the app on a different port?
**A:**
```bash
PORT=3001 npm start
```

#### Q: What if port 3000 is already in use?
**A:** React will automatically try the next available port (3001, 3002, etc.)

---

### Authentication & Login

#### Q: What are the demo credentials?
**A:**
Patient 1:
- Email: john@example.com
- Password: patient123

Patient 2:
- Email: jane@example.com
- Password: patient123

#### Q: Can I create new test accounts?
**A:** Yes! Go to "Book Appointment" → "New Patient Appointment" → fill form → continue to registration → set email/password

#### Q: What if I forget the password?
**A:** In the current version, passwords are stored in-memory. Log out and create a new patient account. Future versions will have password reset.

#### Q: Is the password encrypted?
**A:** Currently, passwords use a basic Base64 encoding. For production, implement bcrypt or similar hashing.

---

### Features & Functionality

#### Q: How do I book an appointment?
**A:** 
1. Click "Login" or "Book Appointment Now" on home page
2. Fill in the appointment form
3. Complete registration with email/password
4. Process payment
5. Access dashboard

#### Q: Can patients book multiple appointments?
**A:** Currently, one appointment per patient. Future versions will support multiple.

#### Q: How do I save assessment data?
**A:** 
1. Login to dashboard
2. Click "Assessment" tab
3. Fill in the form
4. Click "Save Assessment"

#### Q: Where is my data stored?
**A:** Currently stored in application state/localStorage (in-memory). Implement a database for persistence.

#### Q: Can I cancel or reschedule appointments?
**A:** Not in current version. These features are planned for next release.

---

### Technical Issues

#### Q: Styles (Tailwind CSS) are not applying
**A:**
- Clear browser cache (Ctrl + Shift + Delete)
- Restart the dev server (`npm start`)
- Check that `src/index.css` has Tailwind imports:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Q: React DevTools shows warnings
**A:** Some warnings are normal in development. Check console for errors.

#### Q: Component is not rendering
**A:**
1. Check browser console for errors (F12)
2. Verify component imports are correct
3. Check that state updates are working
4. Restart dev server

#### Q: Form validation is not working
**A:**
1. Check that validation utility is imported
2. Verify validation function is called
3. Check error state is being set
4. Console log errors to debug

#### Q: Alerts/notifications not showing
**A:**
1. Ensure Alert component is rendered
2. Check alertState is being updated
3. Verify setTimeout for auto-hide is working
4. Check z-index CSS if hidden behind other elements

---

### Customization

#### Q: How do I change the app colors?
**A:** Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    },
  },
}
```

#### Q: How do I add more departments?
**A:** Edit the SelectInput in `src/App.js` (AppointmentForm):
```javascript
options={[
  { value: '', label: 'Select Department' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'your-department', label: 'Your Department' }
]}
```

#### Q: How do I add more appointment times?
**A:** Edit the SelectInput for appointment times in `src/App.js`:
```javascript
options={[
  { value: '', label: 'Select Time' },
  { value: '08:00', label: '08:00 AM' },
  { value: 'your-time', label: 'Your Time' }
]}
```

#### Q: How do I change the application title?
**A:** Edit `public/index.html`:
```html
<title>Your Hospital Name</title>
```

#### Q: How do I change the logo/icon?
**A:** Replace or modify the Activity icon in navbar. See `src/App.js` line ~32

---

### Backend Integration

#### Q: How do I connect to a real backend?
**A:**
1. Replace mock services in `src/services/` with real API calls
2. Use axios for HTTP requests
3. Implement environment variables for API URLs

Example:
```javascript
// Replace mock
export const appointmentService = {
  getAppointments: async () => {
    const response = await axios.get('/api/appointments');
    return response.data;
  }
};
```

#### Q: Where should I store API endpoints?
**A:** Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=30000
```

Use in code:
```javascript
const API_URL = process.env.REACT_APP_API_URL;
```

#### Q: How do I handle API errors?
**A:**
```javascript
try {
  const data = await appointmentService.getAppointments();
} catch (error) {
  showAlert('error', 'Failed to load appointments');
  console.error(error);
}
```

#### Q: How do I authenticate API requests?
**A:** Add JWT token to headers:
```javascript
const config = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
};
const response = await axios.get('/api/protected', config);
```

---

### Deployment

#### Q: How do I build for production?
**A:**
```bash
npm run build
```
Output will be in `build/` folder

#### Q: What hosting services support this app?
**A:** 
- Netlify (recommended for React)
- Vercel (optimized for React)
- GitHub Pages (free static hosting)
- AWS S3 + CloudFront
- Google Cloud
- Heroku (for backend + frontend)
- DigitalOcean

#### Q: How do I deploy to Netlify?
**A:**
1. Build: `npm run build`
2. Install Netlify CLI: `npm install -g netlify-cli`
3. Deploy: `netlify deploy --prod --dir=build`
4. Or connect GitHub repo in Netlify dashboard

#### Q: How large is the bundle size?
**A:** ~150-200KB (gzipped) for production build

#### Q: How do I reduce bundle size?
**A:**
1. Code splitting with React.lazy
2. Remove unused dependencies
3. Image optimization
4. CSS purging with Tailwind

---

### Performance

#### Q: The app is running slowly
**A:**
1. Check browser DevTools for long-running tasks
2. Use React DevTools to find unnecessary re-renders
3. Implement useMemo for expensive computations
4. Profile with Chrome DevTools (Performance tab)

#### Q: How do I optimize component rendering?
**A:** Use React.memo:
```javascript
const MyComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});
```

#### Q: Should I use useState or useContext?
**A:**
- Use `useState` for local component state
- Use `useContext` for global state (already set up in AuthContext.js)

---

### Security

#### Q: Is my data secure?
**A:** 
- Current version has basic validation only
- No encryption for stored passwords
- For production: implement proper authentication, HTTPS, data encryption

#### Q: How do I add HTTPS?
**A:** 
- Generate SSL certificate
- Configure web server
- Update API URLs to use https://

#### Q: How do I protect against XSS attacks?
**A:** React automatically escapes content. Additional measures:
- Never use dangerouslySetInnerHTML
- Sanitize any user-generated HTML with DOMPurify
- Use Content Security Policy headers

#### Q: How do I protect against CSRF?
**A:**
- Include CSRF token in all POST requests
- Use SameSite cookie attribute
- Implement CORS properly on backend

---

### Database

#### Q: Should I use MongoDB or PostgreSQL?
**A:** 
- MongoDB: Flexible schema, good for rapid development
- PostgreSQL: Structured data, better for complex queries

#### Q: How do I persist data?
**A:** 
1. Set up backend database
2. Implement API endpoints
3. Replace mock services with real API calls
4. Store authentication tokens

#### Q: How do I handle data validation?
**A:** 
- Frontend: Use existing validation functions
- Backend: Implement server-side validation
- Database: Use constraints and triggers

---

### Troubleshooting Common Errors

#### Error: "Cannot find module 'react'"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error: "Port 3000 is already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm start
```

#### Error: "Tailwind CSS not working"
**Solution:**
1. Rebuild: `npm run build`
2. Clear cache: Ctrl + Shift + Delete in browser
3. Restart dev server: `npm start`

#### Error: "localStorage is not defined"
**Solution:** This error occurs in server-side rendering. Wrap in condition:
```javascript
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

#### Error: "Module not found"
**Solution:**
1. Check import path is correct
2. Verify file exists
3. Check file extension matches

---

### Getting Help

#### Where can I find documentation?
- `README.md` - Project overview
- `DEVELOPMENT_GUIDE.md` - Detailed development guide
- `SETUP_SUMMARY.md` - Setup and features summary
- This file - FAQ and troubleshooting

#### How do I report a bug?
1. Reproduce the issue
2. Check console for errors (F12)
3. Document steps to reproduce
4. Create GitHub issue with details

#### How do I request a feature?
1. Check if feature exists in current version
2. Search existing issues
3. Create GitHub issue with feature description
4. Provide use cases and examples

---

## Quick Reference

### Key Commands
```bash
npm install          # Install dependencies
npm start            # Start dev server
npm run build        # Build for production
npm test             # Run tests (when configured)
npm eject            # Eject from create-react-app (not reversible)
```

### File Locations
- Main app: `src/App.js`
- Styles: `src/index.css`
- Config: `tailwind.config.js`
- Services: `src/services/`
- Utilities: `src/utils/`

### Import Examples
```javascript
// Components
import { Button, Card } from './components/UI';

// Services
import { appointmentService } from './services/appointmentService';

// Utilities
import { validateAppointmentForm } from './utils/validation';

// Icons
import { Save, User, Calendar } from 'lucide-react';
```

---

## Getting More Help

If you encounter issues not covered here:
1. Check browser console (F12) for error messages
2. Check terminal for build errors
3. Review relevant documentation files
4. Search online for specific error messages
5. Check official documentation:
   - React: https://react.dev
   - Tailwind: https://tailwindcss.com/docs
   - Lucide Icons: https://lucide.dev

---

**Last Updated:** November 14, 2025  
**Version:** 1.0.0

Happy coding! 🚀
