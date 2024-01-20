import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

function WeatherListItem({ forecast }) {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.tertiaryContainer }]}>
            <Text variant='headlineMedium'>{forecast.day}</Text>
            <Image
                source={require("../../../assets/sun.png")}
                style={styles.image}
            />
            <Text variant='displayMedium'>{Math.round(forecast.main.temp)}</Text>
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
    image: {
        height: 70,
        width: 70,
    },
});

export default WeatherListItem;