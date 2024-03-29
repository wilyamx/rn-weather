import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import * as SplashScreen from 'expo-splash-screen';

import AppContextProvider from './app/auth/AppContextProvider';
import AppNavigator from './app/navigations/AppNavigator';
import reduxStore from "./app/redux/store";
import LOG from './app/utility/logger';

export default function App() {

  const environment = process.env.NODE_ENV;

  const [isReady, setIsReady] = useState(false);
  const { store, persistor } = reduxStore();

  const prepare = async () => {
    try {
      LOG.debug("[App]/useEffect/prepare");
      // delay simulation
      //await new Promise(resolve => setTimeout(resolve, 5000));
      await SplashScreen.hideAsync();
      setIsReady(true);
    } catch (error) {    
      console.log("[App]/useEffect/prepare/error", error);
    }
  };

  // Keep the splash screen visible while we fetch resources
  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    LOG.debug("[App]/useEffect/environment", environment);
    prepare();
  }, []);

  if (!isReady) return null;

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