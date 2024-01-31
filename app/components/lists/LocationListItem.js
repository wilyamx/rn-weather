import React from "react";
import moment from "moment/moment";
import { Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

import CircularIcon from "../CircularIcon";
import colors from "../../config/colors";
import constants from "../../config/constants";
import TemperatureUnit from "../TemperatureUnit";
import YourLocation from "../YourLocation";
import { getWeatherImage } from "../../config/WeatherImages";
import {
    getDateComponents,
    getTemperatureUnitSign,
    getTemperatureDisplay,
} from '../../utility/forecast';

// to show the actual temperature unit saved locally
const DEBUG = constants.debug;

function LocationListItem({
    currentLocation,
    location,
    onPress,
    renderRightActions
}) {
    // redux
    const temperatureUnitSaved = useSelector(state => state.theme.temperatureUnit);
    const homeDisplayedForecast = useSelector(state => state.weather.homeDisplayForecast);

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
    const homeDisplayed = () => {
        //console.log("LocationListItem/homeDisplayed", homeDisplayedForecast);
        return homeDisplayedForecast.city.name === location.city.name;
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
                    { homeDisplayed() &&
                        <View style={styles.homeDisplayContainer}>
                            <CircularIcon
                                image={"home"}
                                backgroundColor={theme.colors.primary}
                            />
                        </View>
                    }
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
    homeDisplayContainer: {
        position: "absolute",
        top: -25,
        right: 10,
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
