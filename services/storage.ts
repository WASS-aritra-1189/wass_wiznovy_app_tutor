import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

export const storeOnboardingStatus = async (completed: boolean) => {
  try {
    await AsyncStorage.setItem('onboardingCompleted', completed.toString());
  } catch (error) {
    console.error('Error storing onboarding status:', error);
  }
};

export const getOnboardingStatus = async () => {
  try {
    const status = await AsyncStorage.getItem('onboardingCompleted');
    return status === 'true';
  } catch (error) {
    console.error('Error getting onboarding status:', error);
    return false;
  }
};

export const removeOnboardingStatus = async () => {
  try {
    await AsyncStorage.removeItem('onboardingCompleted');
  } catch (error) {
    console.error('Error removing onboarding status:', error);
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove(['authToken', 'onboardingCompleted']);
    console.log('All app data cleared successfully');
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};