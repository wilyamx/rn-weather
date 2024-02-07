import React, { createContext, useEffect, useState } from 'react';
import * as Localization from 'expo-localization';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { useTranslation } from 'react-i18next';

import constants from '../config/constants';
import i18next from '../../i18next';
import { DarkTheme, LightTheme } from '../config/Themes';
import LOG from '../utility/logger';

// context api
export const AppContext = createContext(null);
export const AppLanguageContext = createContext(null);

// https://medium.com/@SeishinBG/dynamic-switching-of-themes-in-react-native-app-the-funky-way-with-hooks-48b57ab62a79

export default ({ children }) => {
    // redux
    const colorScheme = useSelector(state => state.theme.colorScheme);

    // localizations
    const { t, i18n } = useTranslation();
    const [locale, changeLocale] = useState(
        (constants.defaultLanguage == 'auto') ?
            Localization.locale :
            constants.defaultLanguage
    );

    // theme
    const [theme, changeTheme] = useState(colorScheme === 'dark' ? DarkTheme : LightTheme);

    useEffect(() => {
        LOG.info("[App]/useEffect");
        //
        var language = constants.defaultLanguage;
        if (language === 'auto') {
            language = Localization.locale;
            console.log("[App]/useEffect/language/auto", language);
        }
        i18n.changeLanguage(language);
        LOG.info("[App]/useEffect/language/preset", language);
      }, []);

    useEffect(() => {
        LOG.info("[App]/useEffect/locale", locale);
        i18n.changeLanguage(locale);
    }, [locale]);

    return (
        <AppContext.Provider value={{ theme: theme, changeTheme }}>
        <AppLanguageContext.Provider value={{ locale: locale, changeLocale }}>
            <PaperProvider theme={theme}>
                <I18nextProvider i18n={i18next} defaultNS={'translation'}>
                    {children}
                </I18nextProvider>
            </PaperProvider>
        </AppLanguageContext.Provider>
        </AppContext.Provider>
    )
};