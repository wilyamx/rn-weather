import React, { useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { Text } from 'react-native-paper';

import AppNavigator from './app/navigations/AppNavigator';
import store from './app/redux/store';
import Screen from './app/components/Screen';
import { DarkTheme, LightTheme } from './app/config/Themes';

export default function App() {
  //const mode2 = useSelector(state => state.theme.colorScheme);
  const [mode, setMode] = useState("light");

  // working
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const paperTheme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <Provider store={store}>
      <PaperProvider theme={paperTheme}>
        <AppNavigator />
      </PaperProvider>
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