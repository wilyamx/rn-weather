import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import CircularIcon from '../components/CircularIcon';
import colors from '../config/colors';
import Screen from '../components/Screen';
import TemperatureUnit from '../components/TemperatureUnit';
import YourLocation from '../components/YourLocation';

function HomeScreen(props) {
    const theme = useTheme();

    return (
        <Screen style={styles.container}>
            <View style={styles.headerContainer}>
                <CircularIcon image={"map-marker"} backgroundColor={theme.colors.primary}/>
                <View>
                    <Text style={styles.title} variant='titleLarge'>Forecast Report</Text>
                    <Text style={styles.date} variant='titleSmall'>
                        Mon, January 1, 2024
                    </Text>
                </View>
                <CircularIcon image={"magnify"} backgroundColor={theme.colors.primary} />
            </View>

            <View style={styles.weatherContainer}>
                <YourLocation />
                <Text style={styles.location}>Lapulapu City</Text>
                <TemperatureUnit temperature={"32"} fontSize={100}/>
                <Text style={styles.weatherCondition}>Cloudy</Text>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    date: {
        textAlign: "center",
    },
    container: {
        padding: 20,
    },
    headerContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    iconContainer: {
        alignItems: "center",
        borderRadius: 25,
        justifyContent: "center",
        width: 50,
        height: 50,
        backgroundColor: "orange"
    },
    location: {
        textAlign: "center",
        fontSize: 30,
    },
    title: {
        textAlign: "center",
    },
    weatherCondition: {
        textAlign: "center",
        fontSize: 20,
    },
    weatherContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: "80%"
    },
});

export default HomeScreen;