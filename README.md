# YummiShare - Recipe Sharing App

Eine moderne, benutzerfreundliche App zum Erstellen, Verwalten und Teilen von Rezepten für Android und iOS.

## 🎯 Features

### Core Features
- ✅ Rezepte anlegen und bearbeiten
- ✅ Kategorisierung von Rezepten (Vorspeisen, Hauptgerichte, Desserts, etc.)
- ✅ Detaillierte Zubereitungsanleitungen
- ✅ Rezepte suchen (nach Namen und Zutaten)
- ✅ Zutaten-basierte Suche
- ✅ Automatische Portionen-Berechnung (Standard: 4 Portionen)
- ✅ Einfaches Sharing (WhatsApp, Mail, SMS)
- ✅ Favoriten-System
- ✅ Foto-Upload (mehrere Fotos pro Rezept)

### Premium Features
- 🎯 Schritt-für-Schritt Kochmodus mit Timer
- 🛒 Integrierte Einkaufsliste
- 📊 Nährwert-Berechnung
- 🌙 Dark Mode
- 📱 Offline-Modus
- 👥 Community-Features
- ⭐ Bewertungssystem

## 🛠️ Technologie-Stack

### Frontend
- **React Native** - Cross-Platform Mobile Development
- **Expo** - Entwicklungstools und Build-System
- **TypeScript** - Type-Safe Development
- **React Navigation** - Navigation & Routing
- **React Native Paper** - UI Component Library

### Backend
- **Firebase** - Backend-as-a-Service
  - **Firestore** - NoSQL Database
  - **Authentication** - User Management
  - **Storage** - Cloud Storage für Fotos
  - **Cloud Functions** - Serverless Backend Logic

### Tools & Libraries
- **Redux Toolkit** - State Management
- **React Query** - Data Fetching & Caching
- **Zod** - Schema Validation
- **React Hook Form** - Form Management
- **date-fns** - Date Utilities
- **expo-image-picker** - Foto Auswahl
- **expo-sharing** - Sharing Funktionalität

## 📁 Projektstruktur

```
yummi-share/
├── app/                 # Navigation & App Root
├── assets/              # Bilder, Fonts, Icons
├── components/          # Wiederverwendbare UI Komponenten
├── config/              # Konfigurationsdateien
├── screens/             # App Screens
│   ├── auth/           # Authentication Screens
│   ├── recipe/         # Recipe Screens
│   ├── search/         # Search Screens
│   └── profile/        # Profile Screens
├── services/           # API Services
├── utils/              # Utility Functions
└── types/              # TypeScript Type Definitions
```

## 🚀 Schnellstart

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn
- Expo CLI
- iOS: Xcode (für Mac)
- Android: Android Studio

### Installation

```bash
# Repository klonen
git clone https://github.com/Bladestar2105/YummiShare.git
cd YummiShare

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm start

# App auf Gerät/Emulator starten
npm run ios    # für iOS
npm run android  # für Android
```

## 📱 App Screens

### Authentication
- Login Screen
- Register Screen
- Forgot Password

### Recipe Management
- Recipe List Screen (Home)
- Recipe Detail Screen
- Create/Edit Recipe Screen
- My Recipes Screen
- Favorites Screen

### Search
- Search Screen (by Name)
- Ingredient Search Screen
- Category Filter Screen

### User
- Profile Screen
- Settings Screen
- Shopping List Screen

## 🎨 Design System

### Farben
- Primary: #FF6B6B (Coral Red)
- Secondary: #4ECDC4 (Teal)
- Background: #F7F7F7
- Surface: #FFFFFF
- Text: #333333
- Text Light: #666666

### Typography
- Font Family: System UI
- Headline: Bold 24px
- Title: Semi-Bold 20px
- Body: Regular 16px
- Caption: Regular 14px

## 🔧 Konfiguration

### Firebase Setup
1. Firebase Projekt erstellen unter https://console.firebase.google.com
2. Android App hinzufügen und `google-services.json` zu `android/app/` hinzufügen
3. iOS App hinzufügen und `GoogleService-Info.plist` zu `ios/YummiShare/` hinzufügen
4. Firebase Configuration in `config/firebase.ts` anpassen

## 📄 Data Models

### Recipe
```typescript
{
  id: string
  name: string
  description: string
  category: string
  images: string[]
  prepTime: number
  cookTime: number
  servings: number
  ingredients: Ingredient[]
  steps: string[]
  tags: string[]
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
}
```

### Ingredient
```typescript
{
  id: string
  name: string
  amount: number
  unit: string
}
```

## 🧪 Testing

```bash
# Unit Tests
npm test

# E2E Tests
npm run test:e2e
```

## 📦 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
# Android
npm run build:android

# iOS
npm run build:ios
```

### App Store & Play Store
- Follow the official Expo deployment guides
- Prepare app icons and splash screens
- Configure app signing

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Commit Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Pull Request öffnen

## 📝 License

Dieses Projekt ist unter der MIT License lizenziert.

## 👥 Team

- **Entwickler**: Bladestar2105
- **Projekt**: YummiShare

## 📞 Kontakt

Bei Fragen oder Problemen: Bitte ein Issue im Repository erstellen.

---

**Made with ❤️ for Food Lovers**