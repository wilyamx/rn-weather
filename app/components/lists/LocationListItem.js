import React from "react";
import moment from "moment/moment";
import { Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

import colors from "../../config/colors";
import constants from "../../config/constants";
import TemperatureUnit from "../TemperatureUnit";
import YourLocation from "../YourLocation";
import { getWeatherImage } from "../../config/WeatherImages";

const DEBUG = constants.debug;

const getDateComponents = (dt_txt) => {
    // 2024-01-20 03:00:0
    let dateComponents = dt_txt.split(" ");
    return dateComponents
};

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

function LocationListItem({
    currentLocation,
    location,
    onPress,
    renderRightActions
}) {
    // redux
    const temperatureUnitSaved = useSelector(state => state.theme.temperatureUnit);

    // ui

    const theme = useTheme();

    // city name
    const locationName = location.city.name;

    // display forecast of the day if available
    // otherwise display the latest forecast available
    const validForecasts = location.list.filter((forecast) => {
        let dateComponents = getDateComponents(forecast.dt_txt);
        let date = dateComponents[0];
        return date == moment().format("YYYY-MM-DD");
    });
    var forecastOfTheDay = constants.defaultForecast;
    if (validForecasts.length == 0) {
        forecastOfTheDay = location.list[location.list.length - 1];
    }
    else {
        forecastOfTheDay = validForecasts[0];
    }
    
    const humidity = "Humidity: " + forecastOfTheDay.main.humidity;
    const weatherImage = getWeatherImage(forecastOfTheDay.weather[0].main);
    
    const momentDate = moment(forecastOfTheDay.dt * 1000);
    const forecastDate = momentDate.format('DD MMMM YYYY | hh:mm a');

    const isCurrentLocation = () => {
        return locationName === currentLocation.place;
    };

    return (
        <GestureHandlerRootView>
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={[styles.container, { backgroundColor: theme.colors.tertiaryContainer }]}>
                    { isCurrentLocation() && <YourLocation /> }
                    <Image
                        source={weatherImage}
                        style={styles.weatherImage}
                        resizeMode="contain"
                    />
                    <View style={styles.weatherTextContainer}>
                        <Text variant='titleLarge' style={styles.weatherText}>{forecastOfTheDay.weather[0].main}</Text>
                        <Text
                            variant='titleSmall'
                            style={[styles.weatherSubtext, { color: theme.colors.tertiary }]}>
                                {humidity}
                        </Text>
                    </View>
                    <View style={styles.leftContainer}>
                        <TemperatureUnit
                            temperature={
                                getTemperatureDisplay(
                                    location.list[0].main.temp,
                                    location.temperatureUnit,
                                    temperatureUnitSaved,
                                    true,
                                    DEBUG
                                )}
                            fontSize={40}
                            unit={getTemperatureUnitSign(location.temperatureUnit, temperatureUnitSaved, DEBUG)}
                            color={theme.colors.tertiary}
                        />
                        <View style={styles.locationContainer}>
                        <Text variant='titleLarge' style={styles.location}>{locationName}</Text>
                            <MaterialCommunityIcons
                                name="map-marker"
                                size={22}
                                style={styles.marker}
                            />
                        </View>
                        <Text variant='labelMedium' style={{color: theme.colors.secondary}} >{forecastDate}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Swipeable>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        marginBottom: 10,
        marginTop: 35,
        padding: 15,
        height: 160,
    },
    location: {
        fontWeight: "500",
    },
    locationContainer: {
        alignItems: "center",
        flexDirection: "row",
    },
    leftContainer: {
        flexDirection: "column",
        textAlign: "left",
        position: "absolute",
        top: 40,
        left: 20,
    },
    marker: {
        color: colors.danger
    },
    weatherImage: {
        width: 150,
        height: 150,
        position: "absolute",
        right: 10,
        top: -40,
    },
    weatherText: {
        textAlign: "right",
    },
    weatherSubtext: {
        textAlign: "right",
    },
    weatherTextContainer: {
        bottom: 10,
        position: "absolute",
        right: 20,
    },
});

export default LocationListItem;
