import i18next from 'i18next';
// import Backend from 'i18next-http-backend';
import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';
import { initReactI18next } from 'react-i18next';

import { en } from './app/localizations/en';
import { fr } from './app/localizations/fr';

i18next
    //.use(Backend)
    .use(RNLanguageDetector)
    .use(initReactI18next) // bind react-i18next to the instance
    .init({
        debug: false,
        fallbackLng: 'en',
        supportedLngs: ['en', 'fr'],
        compatibilityJSON: "v3",
        resources: {
            en: en,
            fr: fr
        }
    });

export default i18next;