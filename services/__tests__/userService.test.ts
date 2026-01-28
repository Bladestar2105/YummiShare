import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from '../userService';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockClear();
    (AsyncStorage.setItem as jest.Mock).mockClear();
  });

  it('should return existing user ID if present', async () => {
    const existingUserId = 'existing-user-id';
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(existingUserId);

    const userId = await getUserId();

    expect(userId).toBe(existingUserId);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_id');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('should generate and save new user ID if none exists', async () => {
    const newUserId = 'new-user-id';
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (uuidv4 as jest.Mock).mockReturnValue(newUserId);

    const userId = await getUserId();

    expect(userId).toBe(newUserId);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_id');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_id', newUserId);
  });
});
