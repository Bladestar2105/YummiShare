import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase Configuration
// ⚠️ HIER EIGENE FIREBASE KONFIGURATION EINFÜGEN
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  RECIPES: 'recipes',
  INGREDIENTS: 'ingredients',
  CATEGORIES: 'categories',
  SHOPPING_LISTS: 'shopping_lists',
  FAVORITES: 'favorites',
  RATINGS: 'ratings',
  NOTIFICATIONS: 'notifications'
} as const

// Default values
export const DEFAULT_RECIPE_VALUES = {
  DEFAULT_SERVINGS: 4,
  DEFAULT_PREP_TIME: 15,
  DEFAULT_COOK_TIME: 30,
  MAX_IMAGES: 5,
  MAX_STEP_LENGTH: 500
}

// Error Messages (German)
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_EMAIL: 'Ungültige E-Mail Adresse',
    USER_NOT_FOUND: 'Benutzer nicht gefunden',
    WRONG_PASSWORD: 'Falsches Passwort',
    EMAIL_ALREADY_IN_USE: 'E-Mail Adresse bereits vergeben',
    WEAK_PASSWORD: 'Passwort zu schwach (mindestens 6 Zeichen)',
    NETWORK_ERROR: 'Netzwerkfehler. Bitte Verbindung überprüfen',
    UNKNOWN_ERROR: 'Ein unbekannter Fehler ist aufgetreten'
  },
  RECIPE: {
    NOT_FOUND: 'Rezept nicht gefunden',
    CREATE_FAILED: 'Rezept konnte nicht erstellt werden',
    UPDATE_FAILED: 'Rezept konnte nicht aktualisiert werden',
    DELETE_FAILED: 'Rezept konnte nicht gelöscht werden',
    UPLOAD_FAILED: 'Foto konnte nicht hochgeladen werden',
    TOO_MANY_IMAGES: `Maximal ${DEFAULT_RECIPE_VALUES.MAX_IMAGES} Fotos erlaubt`
  },
  VALIDATION: {
    REQUIRED_FIELD: 'Dieses Feld ist erforderlich',
    INVALID_NUMBER: 'Bitte eine gültige Zahl eingeben',
    INVALID_EMAIL: 'Bitte eine gültige E-Mail Adresse eingeben',
    PASSWORD_TOO_SHORT: 'Passwort muss mindestens 6 Zeichen lang sein',
    NAME_TOO_SHORT: 'Name muss mindestens 2 Zeichen lang sein',
    DESCRIPTION_TOO_SHORT: 'Beschreibung muss mindestens 10 Zeichen lang sein'
  }
}

// Success Messages (German)
export const SUCCESS_MESSAGES = {
  RECIPE: {
    CREATED: 'Rezept erfolgreich erstellt',
    UPDATED: 'Rezept erfolgreich aktualisiert',
    DELETED: 'Rezept erfolgreich gelöscht',
    SHARED: 'Rezept erfolgreich geteilt'
  },
  AUTH: {
    LOGGED_IN: 'Erfolgreich eingeloggt',
    LOGGED_OUT: 'Erfolgreich ausgeloggt',
    REGISTERED: 'Registrierung erfolgreich',
    PASSWORD_RESET: 'Passwort-Reset E-Mail gesendet'
  }
}

export default app