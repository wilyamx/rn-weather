import React from "react";
import { Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from "react-native-gesture-handler";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import colors from "../../config/colors";
import TemperatureUnit from "../TemperatureUnit";
import YourLocation from "../YourLocation";

function LocationListItem({ location, onPress, renderRightActions }) {
    const theme = useTheme();

    return (
        <GestureHandlerRootView>
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={[styles.container, { backgroundColor: theme.colors.tertiaryContainer }]}>
                    <YourLocation />
                    <Image
                        source={require("../../../assets/sun.png")}
                        style={styles.weatherImage}
                    />
                    <View style={styles.weatherTextContainer}>
                        <Text variant='titleLarge' style={styles.weatherText}>{location.weather[0].main}</Text>
                        <Text variant='titleSmall' style={styles.weatherSubtext}>{"Humidity: 32°"}</Text>
                    </View>
                    <View style={styles.leftContainer}>
                        <TemperatureUnit temperature={location.main.temp} fontSize={40}/>
                        <View style={styles.locationContainer}>
                        <Text variant='titleLarge' style={styles.location}>{location.name}</Text>
                            <MaterialCommunityIcons
                                name="map-marker"
                                size={22}
                                style={styles.marker}
                            />
                        </View>
                        <Text variant='labelMedium'>Mon, January 1, 2024</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Swipeable>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: colors.light,
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
