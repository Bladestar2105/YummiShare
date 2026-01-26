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
  }
}
