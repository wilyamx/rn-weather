import { StyleSheet, useColorScheme } from 'react-native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';

import AppNavigator from './app/navigations/AppNavigator';

export default function App() {
  const colorScheme = useColorScheme();
  const paperTheme =
      colorScheme === 'dark'
        ? { ...MD3DarkTheme }
        : { ...MD3LightTheme };

  return (
    <PaperProvider theme={paperTheme}>
      <AppNavigator />
    </PaperProvider>
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
