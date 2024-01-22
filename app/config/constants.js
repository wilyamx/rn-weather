export default {
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
        temperatureUnit: "metric",
        city: {
            name: "Unknown",
        },
        list: [{
            dt: 0,
            main: {
                temp: 0,
                humidity: 0,
            },
            weather: [{
                id: 0,
                main: "Unknown",
                description: "Unknown",
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