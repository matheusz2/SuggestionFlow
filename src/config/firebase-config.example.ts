// 🔥 FIREBASE CONFIGURATION EXAMPLE
// Copy this file to firebase-config.ts and fill in your credentials

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// To get your credentials:
// 1. Go to: https://console.firebase.google.com/
// 2. Create a project or select an existing one
// 3. Go to Settings > Project settings
// 4. In the "General" tab, scroll to "Your apps"
// 5. Click the web icon (</>) to add app
// 6. Copy the configuration that appears
// 7. Add the values to your .env file 