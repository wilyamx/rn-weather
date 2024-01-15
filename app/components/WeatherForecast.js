import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { GestureHandlerRootView, TouchableHighlight } from 'react-native-gesture-handler';

import colors from '../config/colors';
import CircularIcon from './CircularIcon';
import WeatherListItem from './lists/WeatherListItem';


const initialForecasts = [
    {
        day: "MON",
        main: {
            temp: 212.55,
            humidity: 50
        },
        weather: [{
            id: 803,
            main: "Clouds",
            description: "broken clouds",
            icon: "04d"
        }]
    },
    {
        day: "TUE",
        main: {
            temp: 192.55,
            humidity: 70
        },
        weather: [{
            id: 803,
            main: "Rain",
            description: "broken clouds",
            icon: "04d"
        }]
    },
    {
        day: "WED",
        main: {
            temp: 294.55,
            humidity: 60
        },
        weather: [{
            id: 803,
            main: "Clear",
            description: "broken clouds",
            icon: "04d"
        }]
    },
    {
        day: "THU",
        main: {
            temp: 222.55,
            humidity: 63
        },
        weather: [{
            id: 803,
            main: "Thunder",
            description: "broken clouds",
            icon: "04d"
        }]
    },
    {
        day: "FRI",
        main: {
            temp: 202.55,
            humidity: 55
        },
        weather: [{
            id: 803,
            main: "Clouds",
            description: "broken clouds",
            icon: "04d"
        }]
    }
    
];

function WeatherForecast({ onRefresh, onDismiss }) {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text variant='titleLarge'>5 Day Forecasts</Text>
                    <Text variant='titleSmall'>Updated 12m ago</Text>
                </View>
                <View style={styles.actions}>
                    <CircularIcon
                        image={"refresh"}
                        backgroundColor={theme.colors.secondary}
                        onPress={onRefresh}
                    />
                    <CircularIcon
                        image={"close"}
                        backgroundColor={theme.colors.secondary}
                        onPress={onDismiss}
                    />
                </View>
            </View>

            <View style={styles.forecastContainer} >
                <FlatList
                    horizontal={true}
                    data={initialForecasts}
                    keyExtractor={item => item.day}
                    renderItem={({ item }) => 
                        <WeatherListItem forecast={item} />
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    actions: {
        flexDirection: "row",
        gap: 10,
    },
    container: {
        width: "100%",
        borderRadius: 20,
        overflow: "hidden",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    forecastContainer: {
        paddingVertical: 20,
    },
    title: {
        flexDirection: "row",
    },
    weather: {
        
    },
});

export default WeatherForecast;