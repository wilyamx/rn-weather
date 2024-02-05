import i18next from 'i18next';
// import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { en } from './app/localizations/en';
import { fr } from './app/localizations/fr';

i18next
    //.use(Backend)
    // .use(LanguageDetector)
    .use(initReactI18next) // bind react-i18next to the instance
    .init({
        debug: true,
        fallbackLng: 'en',
        supportedLngs: ['en', 'fr'],
        compatibilityJSON: "v3",
        resources: {
            en: en,
            fr: fr
        }
    });

export default i18next;