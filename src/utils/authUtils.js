import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_RESPONSE_KEY = 'LoginResponse';

export const isLoggedIn = async () => {
  const loginResponse = await AsyncStorage.getItem(LOGIN_RESPONSE_KEY);
  const isLoggedIn = loginResponse !== null;
  console.log(`isLoggedIn() method: ${isLoggedIn}`);
  return isLoggedIn;
};

export const saveLoginResponse = async (loginResponse) => {
  try {
    await AsyncStorage.setItem(LOGIN_RESPONSE_KEY, JSON.stringify(loginResponse));
  } catch (error) {
    console.error('Error saving login response', error);
  }
};

export const removeLoginResponse = async () => {
  try {
    await AsyncStorage.removeItem(LOGIN_RESPONSE_KEY);
  } catch (error) {
    console.error('Error removing login response', error);
  }
};

export const getToken = async () => {
  const isLoggedInUser = await isLoggedIn();
  if (!isLoggedInUser) {
    return null;
  }

  try {
    const loginResponse = await AsyncStorage.getItem(LOGIN_RESPONSE_KEY);
    return loginResponse ? JSON.parse(loginResponse).tokenStr : null;
  } catch (error) {
    console.error('Error retrieving token', error);
    return null;
  }
};
