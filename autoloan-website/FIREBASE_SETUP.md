# Firebase Setup Guide for AutoLoan India

This guide will help you set up Firebase Realtime Database to store car loan leads.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"** button
3. Enter project name: `autoloan-india`
4. Accept the Firebase terms
5. Choose country and click **"Create Project"**
6. Wait for project to be created (2-3 minutes)

## Step 2: Create Realtime Database

1. In Firebase Console, click on your project
2. In the left sidebar, go to **"Build"** → **"Realtime Database"**
3. Click **"Create Database"**
4. Select region:
   - **Development** - For testing (recommended for starters)
   - Choose region close to your users (e.g., Asia-southeast1 for India)
5. Choose security rules:
   - Select **"Start in test mode"** (for development)
   - Click **"Enable"**

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the **⚙️ (Settings)** icon
2. Go to **"Project Settings"**
3. Scroll to **"Your apps"** section
4. If you see a Web app (</> icon), click it
5. If not, click **"Add app"** and select **"Web"**
6. Follow the setup wizard
7. Copy your config object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "autoloan-india-xxxxx.firebaseapp.com",
  databaseURL: "https://autoloan-india-xxxxx-default-rtdb.firebaseio.com",
  projectId: "autoloan-india-xxxxx",
  storageBucket: "autoloan-india-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 4: Update script.js

1. Open `script.js` from the `autoloan-website` folder
2. Find the Firebase configuration section at the top:

```javascript
// ============ Firebase Configuration ============
const firebaseConfig = {
    apiKey: "AIzaSyExample1234567890",
    authDomain: "autoloan-india.firebaseapp.com",
    databaseURL: "https://autoloan-india-default-rtdb.firebaseio.com",
    projectId: "autoloan-india",
    storageBucket: "autoloan-india.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef1234567890"
};
```

3. Replace the values with your actual Firebase credentials from Step 3
4. Save the file

## Step 5: Set Up Database Security Rules

For development/testing (HIGH SECURITY RISK):
1. In Firebase Console, go to **Realtime Database**
2. Click **"Rules"** tab
3. Replace with this rule:

```json
{
  "rules": {
    "leads": {
      ".read": false,
      ".write": true
    }
  }
}
```

4. Click **"Publish"**

⚠️ **IMPORTANT**: This rule allows anyone to write to your database. Use only for development!

### For Production (Secure):

```json
{
  "rules": {
    "leads": {
      ".read": false,
      ".write": "root.child('totalLeads').val() < 10000",
      "$leadId": {
        ".validate": "newData.hasChildren(['fullName', 'mobileNumber', 'city', 'timestamp', 'leadId'])",
        "fullName": {
          ".validate": "newData.isString() && newData.val().length > 2"
        },
        "mobileNumber": {
          ".validate": "newData.isString() && newData.val().length == 10"
        }
      }
    }
  }
}
```

## Step 6: Test Firebase Setup

1. Open `index.html` in your browser
2. Open Developer Tools (F12)
3. Go to **"Console"** tab
4. You should see: `Firebase initialized successfully`
5. Fill out the car loan form and submit
6. Check Firebase Console → Realtime Database → "leads" section
7. New lead entry should appear!

## Verify Setup

### Check Console Messages
Open browser console (F12) and look for:
- ✅ `Firebase initialized successfully` - Firebase is connected
- ⚠️ `Firebase initialization skipped - Demo mode enabled` - Firebase not configured

### View Database
In Firebase Console:
1. Go to **Realtime Database**
2. Click on **"leads"** section
3. You should see submitted applications with structure:

```
leads
├── LEAD_1646568645000_ABC123XYZ
│   ├── fullName: "John Doe"
│   ├── mobileNumber: "9876543210"
│   ├── city: "Mumbai"
│   ├── carPrice: "1500000"
│   ├── loanAmount: "1200000"
│   ├── preferredBank: "HDFC Bank"
│   ├── timestamp: "3/6/2026, 2:30:45 PM"
│   └── employmentType: "Salaried"
```

## Common Issues & Solutions

### Issue: "Firebase initialized successfully" doesn't appear in console

**Solution:**
1. Check if Firebase CDN links are loaded
2. Verify API key is correct
3. Clear browser cache (Ctrl+Shift+Delete)
4. Reload page
5. Check if JavaScript errors appear

### Issue: Leads not saving to Firebase

**Solution:**
1. Check Firebase configuration values are accurate
2. Verify database URL ends with `firebaseio.com`
3. Check Firebase Console - Realtime Database security rules
4. Ensure database is created and active
5. Check browser console for error messages
6. Verify form validation passes (all fields filled correctly)

### Issue: "Error: Permission denied"

**Solution:**
1. Go to Firebase Console → Realtime Database → "Rules"
2. Review security rules - make sure writes are allowed
3. For testing: Use test mode rule (shown above)
4. Verify `.write` is `true`

### Issue: Cannot find Database URL

**Solution:**
1. In Firebase Console, go to Realtime Database
2. Click "Rules" tab
3. At the top, you'll see the Database URL
4. Example: `https://autoloan-india-xxxxx-default-rtdb.firebaseio.com`
5. Copy and paste in `script.js` databaseURL field

## Advanced: Using Environment Variables

For production, use environment variables instead of exposing keys:

```javascript
// Don't do this in production:
const firebaseConfig = {
    apiKey: "AIzaSyDxxxxxx", // Exposed!
};

// Do this instead:
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    // ... other variables
};
```

Tools that support environment variables:
- Firebase Hosting (add in `.firebaserc`)
- Netlify (add in `netlify.toml`)
- Vercel (add in `vercel.json`)
- GitHub Pages (use GitHub Secrets)

## Alternative: Using Firebase Emulator (Local Testing)

Install Firebase Emulator for local development without exposing keys:

```bash
npm install -g firebase-tools
firebase login
firebase init emulators
firebase emulators:start
```

## Monitor Your Database

Go to Firebase Console and check:
1. **Database Size**: How much data you're storing
2. **Realtime Database > Index**: Add indexes for better performance
3. **Monitor > Realtime Database**: View connections and operations

## Deploy to Firebase Hosting

After setting up database, deploy your website:

```bash
npm install -g firebase-tools
firebase login
cd autoloan-website
firebase init hosting
firebase deploy
```

Your site will be live at: `https://autoloan-india-xxxxx.web.app`

## Support & Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Realtime Database Guide](https://firebase.google.com/docs/database)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)
- [Firebase Console](https://console.firebase.google.com)

## Costs

Firebase offers:
- **Free Plan**: Up to 100 simultaneous connections, 1 GB storage
- **After free tier**: Pay only for what you use
- **Typical cost**: $0 - $50/month for small projects like this

---

**Your AutoLoan India website is now ready to collect leads from Firebase! 🎉**
