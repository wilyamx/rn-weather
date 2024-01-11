import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Screen from "../Screen";
import colors from "../../config/colors";

function LocationListItem({ location }) {
    const theme = useTheme();

    return (
    <Screen style={styles.container}>
        <Image
            source={require("../../../assets/sun.png")}
            style={styles.weatherImage}
        />
        <View style={styles.weatherTextContainer}>
            <Text variant='titleLarge' style={styles.weatherText}>{location.weather[0].main}</Text>
            <Text variant='titleSmall' style={styles.weatherSubtext}>{"Humidity: 32°"}</Text>
        </View>
        <View style={styles.leftContainer}>
            <Text variant='displayMedium'>{location.main.temp}°</Text>
            <View style={styles.locationContainer}>
                <Text variant='titleSmall'>{location.name}</Text>
                <MaterialCommunityIcons
                    name="map-marker"
                    size={30}
                    style={styles.marker}
                />
            </View>
            <Text variant='labelMedium'>Mon, January 1, 2024</Text>
        </View>
    </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.light,
        borderRadius: 15,
        marginBottom: 10,
        marginTop: 30,
        padding: 15,
        height: 160,
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
