import React, { useRef, useState } from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector } from 'react-redux';

import CircularIcon from '../components/CircularIcon';
import colors from '../config/colors';
import Screen from '../components/Screen';
import TemperatureUnit from '../components/TemperatureUnit';
import YourLocation from '../components/YourLocation';
import WeatherForecast from '../components/WeatherForecast';

function HomeScreen(props) {
    const theme = useTheme();
    const [forecast, setForecast] = useState(true)

    const refRBSheet = useRef();

    const colorScheme = useSelector(state => state.theme.colorScheme);

    return (
        <Screen>
            <View style={[styles.container, { backgroundColor: theme.colors.primaryContainer }]}>
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
                    <Text style={styles.weatherCondition}>colorScheme? {colorScheme}</Text>
                </View>

                <CircularIcon
                    image={"plus-circle"}
                    backgroundColor={theme.colors.primary}
                    size={40}
                    onPress={() => refRBSheet.current.open()}
                />
            </View>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={false}
                closeOnPressMask={false}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                    draggableIcon: {
                        backgroundColor: theme.colors.primary
                    },
                    container: {
                        backgroundColor: colors.light
                    },
                }}
                height={350}
            >
                <WeatherForecast
                    onRefresh={() => console.log("Refresh")}
                    onDismiss={() => refRBSheet.current.close()}
                />
            </RBSheet>

        </Screen>
    );
}

const styles = StyleSheet.create({
    date: {
        textAlign: "center",
    },
    container: {
        padding: 20,
        alignItems: "center",
    },
    headerContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        width: "100%"
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
        height: "82%"
    },
});

export default HomeScreen;