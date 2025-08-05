# 🚀 BonkPuter - SuggestionFlow

<img width="1276" height="932" alt="image" src="https://github.com/user-attachments/assets/536087de-98ef-46fa-8548-e54b14cf5a97" />


A collaborative real-time suggestion panel built with React, TypeScript and Firebase.

## ✨ Features

- ✅ **Suggestion System**: Create, view and manage suggestions
- ✅ **Two Views**: Cards and Forum
- ✅ **Like System**: Vote on suggestions
- ✅ **Highlight System**: Mark important suggestions
- ✅ **Advanced Filters**: By status, category and highlight
- ✅ **Real-time**: Instant updates with Firebase
- ✅ **Modern Interface**: Responsive design with TailwindCSS
- ✅ **Statistics**: Dashboard with real-time metrics

## 🛠️ Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + HeadlessUI
- **Backend**: Firebase Firestore
- **Icons**: Lucide React
- **Real-time**: Firebase Realtime Database

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <your-repository>
cd BonkPuter - SuggestionFlow
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
   - Create a project in [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy project credentials
   - Edit the file `src/services/firebase.ts` and replace the credentials

4. **Run the project**
```bash
npm run dev
```

## 🔧 Firebase Configuration

### Quick Setup:

1. **Copy the example file:**
   ```bash
   cp src/config/firebase-config.example.ts src/config/firebase-config.ts
   ```

2. **Follow the detailed guide:** `FIREBASE-SETUP.md`

### Or configure manually:

1. **Create a Firebase project**
   - Go to [console.firebase.google.com](https://console.firebase.google.com/)
   - Click "Create project"
   - Name: `BonkPuter - SuggestionFlow`

2. **Enable Firestore**
   - Side menu → "Firestore Database"
   - Click "Create database"
   - Choose "Test mode" (for development)

3. **Get credentials**
   - Side menu → ⚙️ "Project settings"
   - "General" tab → "Your apps"
   - Click the web icon (</>) to add app
   - Copy the configuration

4. **Configure the file**
   - Edit `src/config/firebase-config.ts`
   - Replace example credentials with real ones

## 📁 Project Structure

```
src/
├── components/          # React Components
│   ├── SuggestionCard.tsx
│   ├── ForumTopic.tsx
│   ├── SuggestionForm.tsx
│   ├── ViewSwitcher.tsx
│   └── FirebaseTest.tsx
├── pages/              # Application Pages
│   └── Home.tsx
├── services/           # Services and APIs
│   └── firebase.ts
├── types/              # TypeScript Types
│   └── index.ts
├── App.tsx
└── index.css
```

## �� How to Use

### 1. **Create a Suggestion**
- Click the "New Suggestion" button
- Fill in the form with title, description and your name
- Add category and tags (optional)
- Click "Submit Suggestion"

### 2. **View Suggestions**
- **Card View**: Grid view of cards
- **Forum View**: List view similar to a forum
- Use the switcher in the top right corner to toggle

### 3. **Interact with Suggestions**
- **Like**: Click the heart to like
- **Highlight**: Click the star to highlight/unhighlight
- **Filters**: Use filters to find specific suggestions

### 4. **Available Filters**
- **Status**: Pending, Accepted, Rejected
- **Category**: Improvement, Bug, Feature, Design, Performance, Other
- **Highlight**: Only highlighted suggestions

## 🔄 Implemented Sprints

### ✅ Sprint 1 - FUNDAÇÃO (COMPLETO)
- [x] Setup of React + TypeScript + Vite project
- [x] TailwindCSS configuration
- [x] Main App.tsx component
- [x] Home.tsx page
- [x] Organized folder structure
- [x] Firebase configuration
- [x] Firebase connection service
- [x] Basic CRUD functions
- [x] Detailed logging system
- [x] Suggestion submission form
- [x] Suggestion listing
- [x] Like system
- [x] Highlight system
- [x] Two views (cards/forum)
- [x] All main components
- [x] Responsive design
- [x] Modern interface
- [x] Basic animations
- [x] Colors and typography
- [x] All .tsx files
- [x] TypeScript types defined

## 🚧 Next Sprints

### 🔄 Sprint 2 - ESSENTIAL FUNCTIONALITIES
- [ ] Improve highlight visual
- [ ] Filter by highlighted suggestions
- [ ] Counter for highlighted suggestions
- [ ] Highlight animation
- [ ] More elegant loading states
- [ ] Better success/error feedback
- [ ] Informative tooltips
- [ ] Confirmation of actions
- [ ] Complete status system
- [ ] Basic performance

### ⏳ Sprint 3 - ADMINISTRATION AND CONTROL
- [ ] Admin panel
- [ ] Admin mode with password
- [ ] Dashboard with metrics
- [ ] Highlight control
- [ ] Suggestion moderation

## 🐛 Troubleshooting

### Firebase Connection Error
1. Check if credentials are correct
2. Confirm Firestore is enabled
3. Check Firestore security rules

### Build Problems
```bash
npm run build
```

### Clear Cache
```bash
npm run dev -- --force
```

## 📝 Firestore Rules

For development, use these basic rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANT**: These rules allow full access. For production, configure appropriate security rules.

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the `LICENSE` file for more details.

## 🆘 Support

If you encounter any problems or have questions:

1. Check the troubleshooting section
2. Open an issue on GitHub
3. Contact the development team

---

**🎯 Objective**: Transform the BonkPuter - Suggestion into a complete and robust platform for collaborative suggestion management.

**📅 Status**: Sprint 1 complete - Basic functionalities implemented and working!
