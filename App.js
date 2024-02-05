import React from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

import AppContextProvider from './app/auth/AppContextProvider';
import AppNavigator from './app/navigations/AppNavigator';
import reduxStore from "./app/redux/store";

export default function App() {
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