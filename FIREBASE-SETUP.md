# 🔥 Firebase Setup for RootPuter - SuggestionFlow

## 📋 Prerequisites

1. Google Account
2. Access to Firebase Console

## 🚀 Step by Step

### 1. Create Firebase Project

1. Go to: https://console.firebase.google.com/
2. Click "Create project"
3. Enter the name: `RootPuter - SuggestionFlow`
4. Accept the terms and continue
5. **Disable** Google Analytics (optional)
6. Click "Create project"

### 2. Enable Firestore Database

1. In the sidebar, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Choose the closest location (e.g., `us-central1`)
5. Click "Done"

### 3. Get Credentials

1. In the sidebar, click ⚙️ (Settings) > "Project settings"
2. In the "General" tab, scroll to "Your apps"
3. Click the web icon (</>) to add web app
4. Enter the name: `RootPuter - SuggestionFlow Web`
5. **DO NOT** check "Also set up Firebase Hosting"
6. Click "Register app"
7. Copy the configuration that appears

### 4. Update the Code

Create a `.env` file in the project root and add your Firebase credentials:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important:** Copy the `.env.example` file to `.env` and replace the placeholder values with your real Firebase credentials.

### 5. Configure Firestore Rules

1. In Firestore Database, click the "Rules" tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /suggestions/{document} {
      allow read, write: if true; // For development
    }
  }
}
```

3. Click "Publish"

## ✅ Verification

1. Run `npm run dev`
2. Go to http://localhost:5174/
3. Try adding a suggestion
4. Check in Firebase Console > Firestore Database if the `suggestions` collection was created

## 🔒 Security (Production)

For production, update the Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /suggestions/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users
    }
  }
}
```

## 🆘 Troubleshooting

### Error 400 (Bad Request)
- Check if the credentials are correct
- Confirm if the project exists in Firebase Console

### Permission Error
- Check the Firestore rules
- Certifique-se de que a coleção `suggestions` pode ser criada

### Dados não aparecem
- Verifique se o Firestore está ativo
- Confirme se as regras permitem leitura

## 📞 Suporte

Se ainda tiver problemas:
1. Verifique o console do navegador (F12)
2. Confirme se o Firebase está inicializado corretamente
3. Teste com as regras de teste primeiro 