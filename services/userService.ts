import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'user_id';

/**
 * Retrieves the current user ID from local storage.
 * If no user ID exists, a new one is generated and stored.
 * @returns The persistent user ID.
 */
export const getUserId = async (): Promise<string> => {
  try {
    const userId = await AsyncStorage.getItem(USER_ID_KEY);
    if (userId) {
      return userId;
    }

    const newUserId = uuidv4();
    await AsyncStorage.setItem(USER_ID_KEY, newUserId);
    return newUserId;
  } catch (e) {
    console.error('Failed to get or create user ID.', e);
    // In case of error, return a temporary ID to allow the app to function,
    // though this ID won't be persisted if storage is broken.
    // Using a distinct prefix to identify these cases if needed.
    return `temp-user-${uuidv4()}`;
  }
};
