# Firebase Configuration Template

This file shows example values. **DO NOT use these in production!**

## Example Firebase Config

Replace the values in `script.js` with your actual Firebase credentials:

```javascript
// This is an EXAMPLE - Replace with your actual values
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

## Where to Find Your Credentials

1. **Firebase Console**: https://console.firebase.google.com
2. Click on your project
3. Click ⚙️ (Settings) → Project Settings
4. Scroll to "Your apps" section
5. Click on the Web app (</> icon)
6. Copy your complete config object

## Firebase Credentials Explanation

| Field | Description | Example |
|-------|-------------|---------|
| `apiKey` | API key for this project | AIzaSyDxxxxxx... |
| `authDomain` | Authentication domain | project-name.firebaseapp.com |
| `databaseURL` | Realtime Database URL | https://project-name-rtdb.firebaseio.com |
| `projectId` | Your Firebase project ID | project-name |
| `storageBucket` | Cloud Storage bucket | project-name.appspot.com |
| `messagingSenderId` | Cloud Messaging sender ID | 123456789012 |
| `appId` | Your Firebase app ID | 1:123456789012:web:abc123 |

## How to Copy Your Real Config

### Method 1: From Firebase Console (Recommended)
```
1. Go to Firebase Console
2. Select your project
3. Click ⚙️ Settings
4. Scroll down to "Your apps"
5. Click Web icon (</> )
6. Copy entire config object
7. Paste in script.js
```

### Method 2: From Google Services File
```
1. Firebase Console
2. Project Settings
3. "Service accounts" tab
4. Click "Generate new private key"
5. Add values from downloaded JSON
```

## Example: Before & After

### ❌ BEFORE (Demo/Test Mode)
```javascript
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

### ✅ AFTER (Real Values)
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDEF4gk9n3l2mQ8xL6N9p0R1sT2u3vW4x5y",
    authDomain: "my-autoloan-project.firebaseapp.com",
    databaseURL: "https://my-autoloan-project-default-rtdb.firebaseio.com",
    projectId: "my-autoloan-project",
    storageBucket: "my-autoloan-project.appspot.com",
    messagingSenderId: "987654321098",
    appId: "1:987654321098:web:xyz789abc123def456"
};
```

## Testing Your Config

After updating `script.js`:

1. Open `index.html` in browser
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Look for one of these messages:

✅ **Success**: `Firebase initialized successfully`
❌ **Error**: `Firebase initialization skipped - Demo mode enabled`

If you see error, check:
- All values are copied correctly
- No extra spaces or quotes
- Database URL is complete
- Credentials match your Firebase project

## Security Best Practices

### ❌ DON'T DO THIS
```javascript
// Don't expose keys in GitHub
const apiKey = "AIzaSyDxxxxxx"; // Visible to everyone!

// Don't hardcode credentials in client-side code
const password = "my-secret-password";
```

### ✅ DO THIS
```javascript
// Use environment variables
const apiKey = process.env.REACT_APP_API_KEY;

// Store sensitive data on backend
// Only expose what client needs
```

### Production Checklist
- [ ] Use environment variables
- [ ] Enable Firebase Security Rules
- [ ] Restrict API key to your domain
- [ ] Enable Google reCAPTCHA
- [ ] Add rate limiting
- [ ] Validate all inputs server-side
- [ ] Use HTTPS only
- [ ] Regular security audits

## Troubleshooting

### Error: Invalid API Key
**Solution**: Copy exact API key from Firebase Console, no extra characters

### Error: databaseURL is required
**Solution**: Make sure you have `databaseURL` field with full URL including `https://`

### Error: Project not found
**Solution**: Verify `projectId` matches your Firebase project ID

### Data not saving
**Solution**: Check database rules allow write access

```json
{
  "rules": {
    "leads": {
      ".write": true  // Allow writes for testing
    }
  }
}
```

## Support

Need help?
- See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for step-by-step guide
- See [README.md](README.md) for documentation
- Visit [Firebase Docs](https://firebase.google.com/docs)

---

**Keep your credentials safe! Never share your Firebase config with anyone.**
