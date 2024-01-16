import {
    MD3DarkTheme,
    MD3LightTheme,
  } from 'react-native-paper';

export const LightTheme = {
    ...MD3LightTheme,
    dark: false,
    colors: {
        ...MD3LightTheme.colors,
    }
}

export const DarkTheme = {
    ...MD3DarkTheme,
    dark: true,
    colors: {
        ...MD3DarkTheme.colors,
    }
}