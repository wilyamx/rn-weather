import React, { createContext, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import { LightBlue } from '../config/Themes';

export const AppContext = createContext(null);

// https://medium.com/@SeishinBG/dynamic-switching-of-themes-in-react-native-app-the-funky-way-with-hooks-48b57ab62a79

export default ({ children }) => {
    const [theme, changeTheme] = useState(LightBlue);

    return (
        <AppContext.Provider value={{theme: theme, changeTheme}}>
            <PaperProvider theme={theme}>
                {children}
            </PaperProvider>
        </AppContext.Provider>
    )
}