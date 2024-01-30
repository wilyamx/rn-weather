import React from 'react';
import moment from 'moment/moment';
import { Image, View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import constants from '../../config/constants';
import { daysShort } from '../../config/constants';
import { getWeatherImage } from "../../config/WeatherImages";

// to show the actual temperature unit saved locally
const DEBUG = constants.debug;

const getTemperatureUnitSign = (
    forecastUnit,
    unitTemperature,
    debug = false) => {

    // forecastUnit - unit of the weather forecast from api response
    // unitTemperature - unit to display from the settings view

    var unit = unitTemperature;
    if (debug) {
        unit = forecastUnit
    }
    
    if (unit == constants.temperatureUnit.celsiusUnit) {
        return constants.temperatureUnitSign.celsiusUnit;
    }
    else if (unit == constants.temperatureUnit.fahrenheitUnit) {
        return constants.temperatureUnitSign.fahrenheitUnit;
    }
    else {
        return constants.temperatureUnitSign.kelvinUnit;
    }
};

const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9 / 5) + 32;
};

const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * 5 / 9;
};

const getTemperatureDisplay = (
    reading,
    fromDisplayUnit,
    temperatureUnit,
    withDecimal = false,
    debug = false) => {
    
    // LOG.info("[HomeScreen]/getTemperatureDisplay", reading);
    if (debug) return reading;

    var result = reading;

    // from: metric (celsius), to: metric (celsius)
    if (fromDisplayUnit == constants.temperatureUnit.celsiusUnit &&
        temperatureUnit == constants.temperatureUnit.celsiusUnit) {
            result = reading;
        }
    // from: imperial (fahrenheit), to: imperial (fahrenheit)
    else if (fromDisplayUnit == constants.temperatureUnit.fahrenheitUnit &&
        temperatureUnit == constants.temperatureUnit.fahrenheitUnit) {
            result = reading;
        }
    // from metric (celsius), to: imperial (fahrenheit)
    else if (fromDisplayUnit == constants.temperatureUnit.celsiusUnit &&
        temperatureUnit == constants.temperatureUnit.fahrenheitUnit) {
            result = celsiusToFahrenheit(reading);
        }
    // from imperial (fahrenheit), to: metric (celsius)
    else if (fromDisplayUnit == constants.temperatureUnit.fahrenheitUnit &&
        temperatureUnit == constants.temperatureUnit.celsiusUnit) {
            result = fahrenheitToCelsius(reading);
        }
    return withDecimal ? result.toFixed(2) : Math.round(result);
};

function WeatherListItem({ forecast, temperatureUnit }) {
    // redux
    const temperatureUnitSaved = useSelector(state => state.theme.temperatureUnit);

    const theme = useTheme();

    // display weekday
    const momentDate = moment(forecast.dt * 1000);
    const weekday = daysShort[momentDate.day()];
    
    const weatherImage = getWeatherImage(forecast.weather[0].main);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Text variant='headlineMedium' style={styles.day}>{weekday}</Text>
            <Image
                source={weatherImage}
                style={styles.image}
                resizeMode="contain"
            />
            <Text variant='displayMedium' style={{ color: theme.colors.tertiary }}>
                {
                    getTemperatureDisplay(
                        forecast.main.temp,
                        temperatureUnit,
                        temperatureUnitSaved,
                        false,
                        DEBUG
                    )
                }
            </Text>
            <Text variant='titleMedium'>{forecast.weather[0].main}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        marginRight: 10,
    },
    day: {
        textTransform: "uppercase",
    },
    image: {
        height: 70,
        width: 70,
    },
});

export default WeatherListItem;