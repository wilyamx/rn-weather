import React, { useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import {
  PaperProvider,
} from 'react-native-paper';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { Text } from 'react-native-paper';
import { PersistGate } from 'redux-persist/integration/react'

import AppContextProvider from './app/auth/AppContextProvider';
import AppNavigator from './app/navigations/AppNavigator';
import reduxStore from "./app/redux/store";
import { DarkTheme, LightTheme } from './app/config/Themes';

export default function App() {
  //const mode2 = useSelector(state => state.theme.colorScheme);
  const [mode, setMode] = useState("light");

  // working
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const paperTheme = isDarkMode ? DarkTheme : LightTheme;

  const { store, persistor } = reduxStore();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <PaperProvider theme={paperTheme}>
            <AppNavigator />
          </PaperProvider>
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