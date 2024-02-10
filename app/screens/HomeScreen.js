import React, { useCallback } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Snackbar, Text, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";

import AppActivityIndicator from '../components/AppActivityIndicator';
import AppAlert from '../components/AppAlert';
import CircularIcon from '../components/CircularIcon';
import Screen from '../components/Screen';
import TemperatureUnit from '../components/TemperatureUnit';
import YourLocation from '../components/YourLocation';
import WeatherForecast from '../components/WeatherForecast';

import constants from '../config/constants';
import { getWeatherImage } from '../config/WeatherImages';
import {
    getTemperatureUnitSign,
    getTemperatureDisplay
} from '../utility/forecast';
import LOG from '../utility/logger';

import useHomeViewController from '../view_controllers/useHomeViewController';

// to show the actual temperature unit saved locally
const DEBUG = constants.debug;

function HomeScreen({ route, navigation }) {
    LOG.info("[HomeScreen]/Function-Component");

    const {
        cityName,
        detectDeviceLocationHandler,
        error,
        error2,
        forecastDate,
        i18n,
        loading,
        loading2,
        navigateWithRouteParamsHandler,
        refRBSheet,
        refreshHandler,
        searchButton,
        searchLocationsHandler,
        setSnackbarVisible,
        snackbarVisible,
        temperature,
        temperatureUnit,
        temperatureUnitSaved,
        useCurrentLocation,
        weather,
        weatherDetails,
        weatherImage,
    } = useHomeViewController();

    const theme = useTheme();
    
    // hooks

    // works every time the page is navigated even with same route params
    useFocusEffect(
        // routes
        useCallback(() => {
            navigateWithRouteParamsHandler(route);
        }, [route])
    );

    return (
        <>
        <AppActivityIndicator visible={loading || loading2} />
        <Screen>
            { (error || error2) &&
                <>
                    <AppAlert
                        message={"No weather forecast available from your location."}
                    />
                </>
            }

            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerSideButtonContainer}>
                        <CircularIcon
                            image={"map-marker"}
                            backgroundColor={theme.colors.primary}
                            onPress={detectDeviceLocationHandler}
                        />
                    </View>

                    <View style={styles.headerCenterContainer}>
                        <Text style={styles.title} variant='titleLarge'>{i18n.t('forecastReport', { ns: 'home'})}</Text>
                        <Text style={[styles.date, { color: theme.colors.tertiary }]} variant='titleSmall'>
                            {forecastDate()}
                        </Text>
                    </View>
                    
                    <View style={styles.headerSideButtonContainer}>
                        { searchButton &&
                            <CircularIcon
                                image={"magnify"}
                                backgroundColor={theme.colors.primary}
                                onPress={searchLocationsHandler}
                            />
                        }
                    </View>
                </View>

                <Image
                    source={getWeatherImage(weatherImage())}
                    style={styles.weatherImage}
                    resizeMode="contain"
                />

                <View style={styles.weatherContainer}>
                    { useCurrentLocation && <YourLocation style={styles.yourLocation} marginBottom={20} /> }
                    <Text style={styles.location}>{cityName()}</Text>
                    <TemperatureUnit
                        temperature={
                            getTemperatureDisplay(
                                temperature(),
                                temperatureUnit(),
                                temperatureUnitSaved,
                                false,
                                DEBUG
                            )
                        }
                        fontSize={100}
                        color={theme.colors.tertiary}
                        unit={getTemperatureUnitSign(temperatureUnit, temperatureUnitSaved, DEBUG)}
                    />
                    <Text style={[styles.weatherCondition, { color: theme.colors.tertiary }]}>{weather()}</Text>
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
                        backgroundColor: theme.colors.onSecondary,
                        borderRadius: 40,
                        overflow: "hidden",
                    },
                }}
                height={360}
            >
                { weatherDetails && weatherDetails.list && <WeatherForecast
                    forecast={weatherDetails.list}
                    temperatureUnit={weatherDetails.temperatureUnit}
                    onRefresh={refreshHandler}
                    onDismiss={() => refRBSheet.current.close()}
                />}
            </RBSheet>
            
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
            >
                No internet connection
            </Snackbar>
        </Screen>
        </>
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
    headerSideButtonContainer: {
        minWidth: "20%",
        alignItems:'center',
        justifyContent: "center",
    },
    headerCenterContainer: {
        minWidth: "60%",
    },
    headerContainer: {
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
        fontSize: 30,
        fontWeight: "600",
        textAlign: "center",
        textTransform: "uppercase",
    },
    title: {
        textAlign: "center",
        fontWeight: "bold",
    },
    weatherCondition: {
        textAlign: "center",
        fontSize: 25,
        textTransform: "capitalize",
    },
    weatherContainer: {
        alignItems: "center",
        justifyContent: "center",
        height: "82%"
    },
    weatherImage: {
        width: 300,
        height: 450,
        position: "absolute",
        bottom: -100,
    },
    yourLocation: {
        marginBottom: 20,
    },
});

export default HomeScreen;