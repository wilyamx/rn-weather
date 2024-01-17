import React, { useContext } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

import AppContextProvider, { AppContext } from './app/auth/AppContextProvider';
import AppNavigator from './app/navigations/AppNavigator';
import reduxStore from "./app/redux/store";
import { DarkTheme, LightTheme } from './app/config/Themes';

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const paperTheme = isDarkMode ? DarkTheme : LightTheme;

  const { store, persistor } = reduxStore();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <AppContextProvider>
              <AppNavigator />
          </AppContextProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});