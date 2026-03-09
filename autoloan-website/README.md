# AutoLoan India - Car Loan Lead Generation Website

A modern, responsive car loan lead generation website built with vanilla HTML, CSS, and JavaScript with Firebase integration for lead storage.

## 📋 Features

### 1. **Home Page**
- Attractive hero section with catchy headline
- "Apply Now" call-to-action button
- Modern finance theme design

### 2. **Banks Section**
- Displays 10 major Indian banks providing car loans
- Shows interest rates for each bank
- Quick apply buttons for each bank

### 3. **EMI Calculator**
- Real-time EMI calculation
- Calculates:
  - Monthly EMI
  - Total Interest
  - Total Payment

### 4. **Car Loan Application Form**
- Comprehensive form with fields:
  - Full Name
  - Mobile Number
  - City
  - Employment Type
  - Car Type (New/Used)
  - Car Price
  - Loan Amount
  - Preferred Bank
- Form validation
- Success message on submission

### 5. **Additional Sections**
- Why Choose Us section with 4 key features
- Documents required section
- Contact information
- WhatsApp floating button
- Responsive footer

### 6. **Lead Management**
- Leads stored in Firebase Realtime Database
- Fallback to localStorage if Firebase unavailable
- Console functions for lead management:
  - `displayAllLeads()` - View all leads
  - `exportLeadsAsJSON()` - Export leads as JSON
  - `clearAllLeads()` - Clear all leads

## 🎨 Design Features

- **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- **Modern UI**: Professional finance-themed design with blue and white colors
- **Smooth Animations**: Hover effects, transitions, and floating animations
- **Accessible**: Semantic HTML and proper color contrast
- **Fast Loading**: Optimized CSS and vanilla JavaScript (no frameworks)

## 📁 Project Structure

```
autoloan-website/
├── index.html          # Main HTML file
├── style.css           # Responsive CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🚀 Getting Started

### 1. **Local Setup**
- Extract the project files
- Open `index.html` in any modern web browser
- No build process or installation required!

### 2. **Firebase Setup** (Optional but Recommended)

To enable Firebase lead storage:

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add Project"
   - Enter project name "autoloan-india"
   - Accept the terms and create project

2. **Enable Realtime Database**
   - In Firebase Console, go to "Realtime Database"
   - Click "Create Database"
   - Choose "United States" as location
   - Start in test mode (for development)

3. **Get Firebase Configuration**
   - Go to Project Settings (⚙️ icon)
   - Scroll to "Your apps" section
   - Click on Web app (</> icon)
   - Copy the Firebase config object

4. **Update script.js**
   - Open `script.js`
   - Find the Firebase configuration section at the top
   - Replace the placeholder config with your actual Firebase credentials:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. **Firebase Security Rules** (Important!)

For production, set proper security rules in Firebase Console:

```javascript
{
  "rules": {
    "leads": {
      ".read": false,
      ".write": true,
      "$uid": {
        ".validate": "newData.hasChildren(['fullName', 'mobileNumber', 'city'])"
      }
    }
  }
}
```

## 🔧 Testing

### 1. **EMI Calculator**
- Enter loan amount: 500000
- Interest rate: 8.5%
- Tenure: 60 months
- Click "Calculate EMI"
- Verify calculations in browser console

### 2. **Form Submission**
- Fill all form fields
- Click "Apply for Loan"
- Check browser console for lead data
- Verify localStorage: Open DevTools > Application > localStorage

### 3. **Console Commands** (Open DevTools with F12)

```javascript
// View all submitted leads
displayAllLeads()

// Export leads as JSON file
exportLeadsAsJSON()

// Clear all leads (caution!)
clearAllLeads()
```

### 4. **Firebase Verification**
- Submit a form with Firebase configured
- Go to Firebase Console > Realtime Database
- Check "leads" section for new entries

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## 🎯 Customization

### Colors
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #003d99;      /* Main blue */
    --secondary-color: #0056cc;    /* Darker blue */
    --accent-color: #1e88e5;       /* Light blue */
    --light-bg: #f8f9fa;           /* Light gray */
    /* ... other colors ... */
}
```

### Contact Information
Update in `index.html`:
- Phone number: Line 363
- Email: Line 368
- WhatsApp number: Lines 378, 404

### Banks List
Add or remove banks in `index.html` (Lines 140-189)

### Interest Rates
Update interest rates for each bank in `index.html`

## 📊 Lead Data Structure

Each submitted lead contains:
```javascript
{
    fullName: "John Doe",
    mobileNumber: "9876543210",
    city: "Mumbai",
    employmentType: "Salaried",
    carType: "New",
    carPrice: "1500000",
    loanAmount: "1200000",
    preferredBank: "HDFC Bank",
    timestamp: "3/6/2026, 2:30:45 PM",
    leadId: "LEAD_1646568645000_ABC123XYZ"
}
```

## 🔒 Security Notes

1. **Firebase Configuration**
   - Keep API keys in `.env` file for production
   - Don't commit keys to public repositories
   - Use proper environment variables

2. **CORS**
   - Firebase handles CORS for client-side database
   - No backend required for basic setup

3. **Data Validation**
   - All form fields are validated client-side
   - Add server-side validation for production

## 🌐 Deployment Options

### 1. **Firebase Hosting** (Recommended)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### 2. **Netlify**
- Connect GitHub repository
- Auto-deploy on push

### 3. **Vercel**
- Drag and drop folder
- Automatic deployment

### 4. **GitHub Pages**
- Push to GitHub repository
- Enable Pages in settings

## 📞 Support Features

### WhatsApp Integration
- Floating WhatsApp button (bottom-right)
- Opens WhatsApp chat with pre-filled message
- Update phone number in `index.html` line 404

### Contact Section
- Phone, Email, WhatsApp links
- All clickable and functional

## 🎓 Learning Resources

- **EMI Calculator Logic**: See `calculateEMI()` function in `script.js`
- **Form Validation**: See `validateFormData()` function
- **Firebase Integration**: See Firebase config and `saveToFirebase()` function
- **Responsive Design**: See CSS media queries in `style.css`

## 🐛 Troubleshooting

### Issue: Firebase not saving data
**Solution**: 
- Check Firebase configuration in `script.js`
- Verify database URL is correct
- Check Firebase Console security rules
- Falls back to localStorage automatically

### Issue: Form not submitting
**Solution**:
- Check browser console for validation errors
- Verify all required fields are filled
- Check mobile number format (10 digits)
- Ensure enthusiasm type and car type are selected

### Issue: EMI Calculator not working
**Solution**:
- Verify all input fields have numeric values
- Check browser console for JavaScript errors
- Try refreshing the page

## 📈 Analytics & Tracking

Add Google Analytics for tracking:
```html
<!-- Add to index.html before closing </head> tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 📄 License

This project is free to use and modify for personal and commercial use.

## 👨‍💻 Developer Notes

### Performance Tips
- Minify CSS and JavaScript for production
- Use CDN for Font Awesome icons
- Enable gzip compression on server
- Optimize images if added

### Accessibility
- Use semantic HTML
- Proper contrast ratios
- Keyboard navigation support
- Screen reader friendly

### Next Steps
1. Set up Firebase with proper configuration
2. Add email notifications for new leads
3. Create admin dashboard for lead management
4. Integrate with CRM system
5. Add SMS notifications
6. Implement reCAPTCHA for form spam prevention

---

**Made with ❤️ for AutoLoan India**

For questions or improvements, feel free to customize this template!
