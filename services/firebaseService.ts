import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { auth, db, storage, COLLECTIONS } from '../config/firebase'
import { Recipe, Ingredient, User, ShoppingItem } from '../types'
import { generateId } from '../utils/recipeUtils'

// ==================== USER SERVICES ====================

/**
 * Create or update user document
 */
export const createUserDocument = async (user: any): Promise<User> => {
  const userRef = doc(db, COLLECTIONS.USERS, user.uid)
  const userSnapshot = await getDoc(userRef)

  if (!userSnapshot.exists()) {
    const userData = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await setDoc(userRef, userData)
    return { ...userData, id: user.uid, createdAt: new Date(), updatedAt: new Date() }
  }

  return userSnapshot.data() as User
}

/**
 * Get user data
 */
export const getUserData = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId)
  const userSnapshot = await getDoc(userRef)

  if (!userSnapshot.exists()) {
    return null
  }

  return userSnapshot.data() as User
}

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId)
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp()
  })
}

// ==================== RECIPE SERVICES ====================

/**
 * Create a new recipe
 */
export const createRecipe = async (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('Benutzer nicht eingeloggt')
  }

  const recipesCollection = collection(db, COLLECTIONS.RECIPES)
  const newRecipe = {
    ...recipeData,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    totalTime: recipeData.prepTime + recipeData.cookTime
  }

  const docRef = await addDoc(recipesCollection, newRecipe)
  return docRef.id
}

/**
 * Get recipe by ID
 */
export const getRecipeById = async (recipeId: string): Promise<Recipe | null> => {
  const recipeRef = doc(db, COLLECTIONS.RECIPES, recipeId)
  const recipeSnapshot = await getDoc(recipeRef)

  if (!recipeSnapshot.exists()) {
    return null
  }

  const recipeData = recipeSnapshot.data()
  return {
    id: recipeSnapshot.id,
    ...recipeData,
    createdAt: recipeData.createdAt?.toDate() || new Date(),
    updatedAt: recipeData.updatedAt?.toDate() || new Date()
  } as Recipe
}

/**
 * Get all recipes for a user
 */
export const getUserRecipes = async (userId: string): Promise<Recipe[]> => {
  const recipesQuery = query(
    collection(db, COLLECTIONS.RECIPES),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  )

  const querySnapshot = await getDocs(recipesQuery)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date()
  })) as Recipe[]
}

/**
 * Get public recipes
 */
export const getPublicRecipes = async (limitCount: number = 20): Promise<Recipe[]> => {
  const recipesQuery = query(
    collection(db, COLLECTIONS.RECIPES),
    where('isPublic', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )

  const querySnapshot = await getDocs(recipesQuery)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date()
  })) as Recipe[]
}

/**
 * Search recipes by name
 */
export const searchRecipes = async (searchQuery: string, limitCount: number = 20): Promise<Recipe[]> => {
  if (!searchQuery.trim()) {
    return []
  }

  // Note: Firestore doesn't support full-text search natively
  // For production, consider using Algolia or Elasticsearch
  const recipesQuery = query(
    collection(db, COLLECTIONS.RECIPES),
    where('isPublic', '==', true),
    limit(limitCount * 2) // Fetch more to filter client-side
  )

  const querySnapshot = await getDocs(recipesQuery)
  const lowerQuery = searchQuery.toLowerCase()

  return querySnapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }))
    .filter((recipe: Recipe) =>
      recipe.name.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    ) as Recipe
}

/**
 * Search recipes by ingredients
 */
export const searchRecipesByIngredient = async (ingredient: string, limitCount: number = 20): Promise<Recipe[]> => {
  const recipesQuery = query(
    collection(db, COLLECTIONS.RECIPES),
    where('isPublic', '==', true),
    limit(limitCount * 2)
  )

  const querySnapshot = await getDocs(recipesQuery)
  const lowerIngredient = ingredient.toLowerCase()

  return querySnapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    }))
    .filter((recipe: Recipe) =>
      recipe.ingredients.some(ing =>
        ing.name.toLowerCase().includes(lowerIngredient)
      )
    ) as Recipe
}

/**
 * Update recipe
 */
export const updateRecipe = async (recipeId: string, recipeData: Partial<Recipe>): Promise<void> => {
  const recipeRef = doc(db, COLLECTIONS.RECIPES, recipeId)

  await updateDoc(recipeRef, {
    ...recipeData,
    updatedAt: serverTimestamp(),
    totalTime: recipeData.prepTime ? recipeData.prepTime + (recipeData.cookTime || 0) : undefined
  })
}

/**
 * Delete recipe
 */
export const deleteRecipe = async (recipeId: string): Promise<void> => {
  const recipeRef = doc(db, COLLECTIONS.RECIPES, recipeId)
  await deleteDoc(recipeRef)
}

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (recipeId: string, isFavorite: boolean): Promise<void> => {
  const recipeRef = doc(db, COLLECTIONS.RECIPES, recipeId)
  await updateDoc(recipeRef, { isFavorite })
}

/**
 * Get favorite recipes
 */
export const getFavoriteRecipes = async (userId: string): Promise<Recipe[]> => {
  const recipesQuery = query(
    collection(db, COLLECTIONS.RECIPES),
    where('userId', '==', userId),
    where('isFavorite', '==', true),
    orderBy('updatedAt', 'desc')
  )

  const querySnapshot = await getDocs(recipesQuery)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date()
  })) as Recipe[]
}

// ==================== STORAGE SERVICES ====================

/**
 * Upload image to Firebase Storage
 */
export const uploadImage = async (uri: string, path: string): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('Benutzer nicht eingeloggt')
  }

  const response = await fetch(uri)
  const blob = await response.blob()

  const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const storageRef = ref(storage, `${path}/${auth.currentUser.uid}/${fileName}`)

  await uploadBytes(storageRef, blob)
  const downloadURL = await getDownloadURL(storageRef)

  return downloadURL
}

/**
 * Delete image from Firebase Storage
 */
export const deleteImage = async (url: string): Promise<void> => {
  try {
    const storageRef = ref(storage, url)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Error deleting image:', error)
    // Don't throw error, as image might have already been deleted
  }
}

/**
 * Upload multiple images
 */
export const uploadMultipleImages = async (uris: string[], path: string): Promise<string[]> => {
  const uploadPromises = uris.map(uri => uploadImage(uri, path))
  return Promise.all(uploadPromises)
}

// ==================== SHOPPING LIST SERVICES ====================

/**
 * Create shopping list
 */
export const createShoppingList = async (name: string, items: ShoppingItem[]): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error('Benutzer nicht eingeloggt')
  }

  const shoppingListsCollection = collection(db, COLLECTIONS.SHOPPING_LISTS)
  const newList = {
    name,
    items,
    userId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }

  const docRef = await addDoc(shoppingListsCollection, newList)
  return docRef.id
}

/**
 * Get shopping lists
 */
export const getShoppingLists = async (userId: string): Promise<any[]> => {
  const listsQuery = query(
    collection(db, COLLECTIONS.SHOPPING_LISTS),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  )

  const querySnapshot = await getDocs(listsQuery)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date()
  }))
}

/**
 * Subscribe to recipes in real-time
 */
export const subscribeToUserRecipes = (userId: string, callback: (recipes: Recipe[]) => void) => {
  const recipesQuery = query(
    collection(db, COLLECTIONS.RECIPES),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  )

  return onSnapshot(recipesQuery, (snapshot) => {
    const recipes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as Recipe[]
    
    callback(recipes)
  })
}

/**
 * Subscribe to single recipe updates
 */
export const subscribeToRecipe = (recipeId: string, callback: (recipe: Recipe | null) => void) => {
  const recipeRef = doc(db, COLLECTIONS.RECIPES, recipeId)

  return onSnapshot(recipeRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null)
      return
    }

    const recipe = {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate() || new Date(),
      updatedAt: snapshot.data().updatedAt?.toDate() || new Date()
    } as Recipe

    callback(recipe)
  })
}

// ==================== EXPORT FUNCTIONS ====================

export const FirebaseService = {
  // User
  createUserDocument,
  getUserData,
  updateUserProfile,

  // Recipe
  createRecipe,
  getRecipeById,
  getUserRecipes,
  getPublicRecipes,
  searchRecipes,
  searchRecipesByIngredient,
  updateRecipe,
  deleteRecipe,
  toggleFavorite,
  getFavoriteRecipes,

  // Storage
  uploadImage,
  deleteImage,
  uploadMultipleImages,

  // Shopping List
  createShoppingList,
  getShoppingLists,

  // Real-time
  subscribeToUserRecipes,
  subscribeToRecipe
}

export default FirebaseService