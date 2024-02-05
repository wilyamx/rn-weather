import i18next from 'i18next';
// import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

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
            en: {
              translation: {
                description: {
                  part1: 'Edit <1>src/App.js</1> and save to reload.',
                  part2: 'Learn React'
                }
              },
              home: {
                forecastReport: 'Forecast Report'
              },
              locations: {
                pickLocations: 'Pick Locations'
              }
            },
            fr: {
              translation: {
                description: {
                  part1: 'Ändere <1>src/App.js</1> und speichere um neu zu laden.',
                  part2: 'Lerne React'
                }
              },
              home: {
                forecastReport: 'Rapport de prévision'
              },
              locations: {
                pickLocations: 'Pick Locations de'
              }
            }
          }
    });


// // const ret = i18next.t('forecastReport', { ns: 'home'});
// // console.log('[i18n]', ret)

export default i18next;