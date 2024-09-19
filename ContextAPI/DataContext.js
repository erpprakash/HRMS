import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import customFetch from '../Frontend/utils/CustomFetch';
import { useNavigation } from '@react-navigation/native';
import { decode as base64decode } from 'base-64';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [Theme, setTheme] = useState("#FF5733");
  const navigation = useNavigation();

  function parseJwt(token) {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const base64WithPadding = base64 + padding;
    try {
      const jsonString = base64decode(base64WithPadding);
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Error decoding Base64 or parsing JSON:', e);
      return null;
    }
  }

  const handleTheme = async (storedColor) => {
    try {
      setTheme(storedColor);
      // await AsyncStorage.setItem('color', color); // Save color in AsyncStorage
    } catch (error) {
      console.error('Error during setting color:', error);
    }
  };

  const handleLogin = async (token) => {
    try {
      setUserToken(token);
      const user = parseJwt(token);

      if (user) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (user.exp < currentTime) {
          console.error('Token has expired');
          await handleLogout();
          return;
        }

        if (user.userId) {
          await getUserDetails(user.userId);
        } else {
          console.error('Invalid user data in token:', user);
        }
      } else {
        console.error('Failed to parse token:', user);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setUserToken(null);
      setUserDetail(null);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getUserDetails = async (userId) => {
    if (!userId) {
      console.error('User ID is null or undefined');
      return;
    }

    try {
      const response = await customFetch.get(`/users/${userId}`);
      if (response.status >= 200 && response.status <= 299) {
        setUserDetail(response.data);
      } else {
        console.error('Failed to fetch user details:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const initializeApp = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const storedColor = await AsyncStorage.getItem('theme');

      if (token) {
        await handleLogin(token);
      } else {
        setUserDetail(null);
      }
      if (storedColor) {
        handleTheme(storedColor);
      } else {
        setTheme("#FF5733");
      }
    } catch (error) {
      console.error('Error retrieving token/color:', error);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <DataContext.Provider value={{ userDetail, handleLogin, handleLogout, handleTheme, Theme }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
