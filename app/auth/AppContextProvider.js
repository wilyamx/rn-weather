import React, { createContext, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { DarkTheme, LightTheme } from '../config/Themes';

export const AppContext = createContext(null);

// https://medium.com/@SeishinBG/dynamic-switching-of-themes-in-react-native-app-the-funky-way-with-hooks-48b57ab62a79

export default ({ children }) => {
    // redux
    const colorScheme = useSelector(state => state.theme.colorScheme);

    // theme
    const [theme, changeTheme] = useState(colorScheme === 'dark' ? DarkTheme : LightTheme);

    return (
        <AppContext.Provider value={{theme: theme, changeTheme}}>
            <PaperProvider theme={theme}>
                {children}
            </PaperProvider>
        </AppContext.Provider>
    )
};