import React from "react";
import Moment from 'moment';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import colors from "../../config/colors";
import TemperatureUnit from "../TemperatureUnit";
import YourLocation from "../YourLocation";
import { getWeatherImage } from "../../config/WeatherImages";

function LocationListItem({ location, onPress, renderRightActions }) {
    const theme = useTheme();

    const locationName = location.city.name;
    const latestForecast = location.list[location.list.length - 1];

    const humidity = "Humidity: " + latestForecast.main.humidity;
    const forecastDate = Moment(latestForecast.dt_txt).format('d MMMM YYYY | h:mm a');
    const weatherImage = getWeatherImage(latestForecast.weather[0].main);
    
    return (
        <GestureHandlerRootView>
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={[styles.container, { backgroundColor: theme.colors.tertiaryContainer }]}>
                    <YourLocation />
                    <Image
                        source={weatherImage}
                        style={styles.weatherImage}
                        resizeMode="contain"
                    />
                    <View style={styles.weatherTextContainer}>
                        <Text variant='titleLarge' style={styles.weatherText}>{latestForecast.weather[0].main}</Text>
                        <Text
                            variant='titleSmall'
                            style={[styles.weatherSubtext, { color: theme.colors.tertiary }]}>
                                {humidity}
                        </Text>
                    </View>
                    <View style={styles.leftContainer}>
                        <TemperatureUnit temperature={location.list[0].main.temp} fontSize={40}/>
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
