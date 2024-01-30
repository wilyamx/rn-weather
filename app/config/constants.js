export default {
    // logs for redux
    enableStoreLogger: false,
    // disable detection of network status
    offlineMode: false,
    // allow to see actual temperature from the store
    debug: false,
    temperatureUnit: {
        celsiusUnit: "metric",
        fahrenheitUnit: "imperial",
        kelvinUnit: "standard",
    },
    temperatureUnitSign: {
        celsiusUnit: "C",
        fahrenheitUnit: "F",
        kelvinUnit: "K",
    },
    defaultForecast: {
        uuid: "",
        temperatureUnit: "metric",
        homeDisplayed: 0,
        city: {
            name: "",
        },
        list: [{
            dt: 0,
            dt_txt: "",
            main: {
                temp: 0,
                humidity: 0,
            },
            weather: [{
                id: 0,
                main: "Default",
                description: "",
                icon: 0,
            }]
        }]
    }
};

export const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

export const daysShort = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thur',
    'Fri',
    'Sat'
];

export const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

// Lapulapu City
//10.316722604986218, 123.96592344056735