import React from 'react';
import moment from 'moment/moment';
import { Image, View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { daysShort } from '../../config/constants';
import { getWeatherImage } from "../../config/WeatherImages";

const getDateComponents = (dt_txt) => {
    // 2024-01-20 03:00:0
    let dateComponents = dt_txt.split(" ");
    return dateComponents
};

function WeatherListItem({ forecast }) {
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
            <Text variant='displayMedium' style={{ color: theme.colors.tertiary }}>{Math.round(forecast.main.temp)}</Text>
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