import React, { useCallback, useEffect, useRef } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Snackbar, Text, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
import * as Network from 'expo-network';

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
const OFFLINE = constants.offlineMode;

function HomeScreen({ route, navigation }) {
    LOG.info("[HomeScreen]/Function-Component");

    const {
        addToForecastsVm,
        cityName,
        currentLocation,
        detectDeviceLocationHandler,
        detectLocation,
        displayedToHomeVm,
        error,
        error2,
        forecastDate,
        getForecastByCityName,
        hasHomeDisplayedForecast,
        hasCurrentLocation,
        hasInterNetConnection,
        homeDisplayedForecast,
        i18n,
        isInternetReachable,
        location,
        loading,
        loading2,
        netInfo,
        refreshHandler,
        savedLocations,
        searchButton,
        searchLocationsHandler,
        setCurrentLocationVm,
        setIsInternetReachable,
        setDetectLocation,
        setSnackbarVisible,
        setTriggerFromLocationButton,
        setUseCurrentLocation,
        setWeatherDetails,
        snackbarVisible,
        temperature,
        temperatureUnit,
        temperatureUnitSaved,
        triggerFromLocationButton,
        updateFromForecastsVm,
        useCurrentLocation,
        weather,
        weatherDetailData,
        weatherDetailData2,
        weatherDetails,
        weatherImage,
        weatherRequestByCoordinate,
        weatherRequestByLocationName,
    } = useHomeViewController();

    const theme = useTheme();
    const refRBSheet = useRef();

    // hooks

    // trigger when reload
    // this will trigger once only
    useEffect(() => {
        LOG.info("#1.0 [HomeScreen]/useEffect/initialize");
        LOG.info("#1.1 [HomeScreen]/useEffect/initialize/weatherDetailData", weatherDetailData);

        setDetectLocation(false);

        (async () => {
            var network = await Network.getNetworkStateAsync();
            if (OFFLINE) {
                network = {
                    isInternetReachable: false,
                    type: "None",
                    isConnected: false
                }
            }
            setIsInternetReachable(network.isConnected);
            if (network.isConnected) {
                LOG.info("#1.2 [HomeScreen]/internetConnect", network);
                LOG.info("#1.2 [HomeScreen]/isInternetReachable", isInternetReachable);

                // your location indicator
                if (hasCurrentLocation()) {
                    LOG.info("#1.2 [HomeScreen]/currentLocation", currentLocation.place);
                    const forecast = getForecastByCityName(currentLocation.place);

                    if (hasHomeDisplayedForecast()) {
                        setUseCurrentLocation(forecast.city.name == homeDisplayedForecast.city.name);
                    }
                    else {
                        setUseCurrentLocation(false);
                    }
                }
                
                if (hasHomeDisplayedForecast()) {
                    LOG.info("#1.2 [HomeScreen]/homeDisplayedForecast", homeDisplayedForecast.city.name);
                    // show home displayed forecast
                    setWeatherDetails(homeDisplayedForecast)
                }

                if (!hasCurrentLocation() && !hasHomeDisplayedForecast()) {
                    LOG.info("#1.2 [HomeScreen]/noData");
                    setUseCurrentLocation(false);
                }
            }
            else {
                LOG.info("#1.3 [HomeScreen]/internetNotConnected");
                LOG.info("#1.3 [HomeScreen]/homeDisplayedForecast", homeDisplayedForecast.city.name);
                LOG.info("#1.3 [HomeScreen]/currentLocation", currentLocation.place);

                // your location indicator
                const selectedForecast = getForecastByCityName(currentLocation.place);
                setUseCurrentLocation(selectedForecast.city.name == homeDisplayedForecast.city.name);

                // show home displayed forecast
                setWeatherDetails(homeDisplayedForecast)
            }
        })();
    }, []);

    useEffect(() => {
        LOG.info("#2.0 [HomeScreen]/isInternetReachable", isInternetReachable);
        setSnackbarVisible(!isInternetReachable);
    }, [isInternetReachable]);

    useEffect(() => {
        LOG.info("#3.0 [HomeScreen]/useEffect/weatherDetailData");
        //
        // Update the home display status from locations tab
        let data = weatherDetailData;
        
        if (!data) return;
        if (!data.list) return;
        if (data.list.length == 0) return;
        if (!data.city) return;

        data.homeDisplayed = true;

        LOG.info("#3.1 [HomeScreen]/useEffect/weatherDetailData/validated");

        setWeatherDetails(weatherDetailData);

        updateFromForecastsVm(weatherDetailData);
        // indicator that this location displayed from home tab
        if (weatherDetailData.city.name) {
            displayedToHomeVm(weatherDetailData);
        }
    }, [weatherDetailData]);

    useEffect(() => {
        if (!location) return;

        LOG.info("[HomeScreen]/useEffect/Device-Location", location, triggerFromLocationButton);

        setDetectLocation(location != null);

        // we will show the home displayed forecast if available
        if (!triggerFromLocationButton && hasHomeDisplayedForecast()) {
            setWeatherDetails(homeDisplayedForecast);
            return;
        };

        if (location) {
            if (hasInterNetConnection()) {
                LOG.info("[HomeScreen]/useEffect/weatherRequestByCoordinate");
                // request forecast using device location
                weatherRequestByCoordinate(
                    location.latitude,
                    location.longitude
                );
            }
            else {
                LOG.info("[HomeScreen]/useEffect/loadLocationHomeDisplay");
                let forecastHomeDisplayed = getForecastByCityName(homeDisplayedForecast.city.name)
                setWeatherDetails(forecastHomeDisplayed);
            }
        }
        setUseCurrentLocation(location != null)
        setDetectLocation(location != null);
        //
        setTriggerFromLocationButton(false);
    }, [location]);

    // this will update every time change in internet connection status
    // user turn off/on the device wifi
    useEffect(() => {
        (async () => {
            let network = await Network.getNetworkStateAsync();
            if (OFFLINE) {
                network = {
                    isInternetReachable: false,
                    type: "None",
                    isConnected: false
                }
            }
            setIsInternetReachable(network.isConnected);
        })();
    }), [netInfo.isInternetReachable];

    useEffect(() => {
        if (!weatherDetailData2.city) return;
        LOG.info("[HomeScreen]/useEffect/weatherDetailData2/city", weatherDetailData2.city.name);
        //
        // Update the home display status from locations tab
        let data = weatherDetailData2;
        data.homeDisplayed = true;
        //
        setWeatherDetails(data);
        // indicator that this location displayed from home tab
        if (data.city.name) {
            displayedToHomeVm(data);
        }
        //
        if (!data) return;
        if (!data.list) return;
        if (data.list.length == 0) return;
        if (!data.city) return;

        LOG.info("[HomeScreen]/useEffect/weatherDetailData2/data", data);
        updateFromForecastsVm(data);
    }, [weatherDetailData2]);

    useEffect(() => {
        LOG.info("[HomeScreen]/useEffect/weatherDetails");
        //
        let savedLocationNames = savedLocations.map((forecast) => forecast.city.name);
        //LOG.info("[HomeScreen]/Saved-Locations", savedLocationNames);

        if (!hasInterNetConnection()) {
            //setWeatherDetails(homeDisplayedForecast);
            if (weatherDetails.city.name) {
                displayedToHomeVm(weatherDetails);
            }
            return;
        }
        
        if (!weatherDetails) return;
        if (!weatherDetails.list) return;
        if (weatherDetails.list.length == 0) return;
        if (!weatherDetails.city) return;

        LOG.info("[HomeScreen]/useEffect/weatherDetails/validated");

        let uuid = weatherDetails.uuid;
        let cityDetails = weatherDetails.city;
        let forecasts = weatherDetails.list;
        
        if (savedLocations.length == 0 && uuid.length > 0) {
            addToForecastsVm(weatherDetails);
            LOG.info("[HomeScreen]/useEffect/Added-First-Location", cityDetails.name);
        }
        else {
            if (!savedLocationNames.includes(cityDetails.name) && uuid.length > 0) {
                LOG.info("[HomeScreen]/useEffect/Added-Location", cityDetails.name);
                addToForecastsVm(weatherDetails)
            }
            else {
                LOG.info("[HomeScreen]/useEffect/Existing-Location", cityDetails.name);
                updateFromForecastsVm(weatherDetails);
            }
        }

        if (!hasCurrentLocation()) {
            setUseCurrentLocation(false);
        }

        if (location && useCurrentLocation) {
            setUseCurrentLocation(true);
            setCurrentLocationVm({
                latitude: location.latitude,
                longitude: location.longitude,
                place: weatherDetails.city.name,
                uuid: weatherDetails.uuid,
            })
            LOG.info("[HomeScreen]/useEffect/weatherDetails/Updated-User-Location");
        }
        
    }, [weatherDetails]);

    // works every time the page is navigated even with same route params
    useFocusEffect(
        // routes
        useCallback(() => {
            if (route.params) {
                // from locations
                LOG.info("[HomeScreen]/useFocusEffect/route.params", route.params);
                LOG.info("[HomeScreen]/useFocusEffect/homeDisplayedForecast", homeDisplayedForecast.city);
                
                // user selected a location from locations tab and navigate to home tab
                if (route.params.locationId &&
                    route.params.cityId &&
                    route.params.name) {
                    
                    const selectedForecast = getForecastByCityName(route.params.name);
                    if (!selectedForecast) {
                        LOG.info("[HomeScreen]/useFocusEffect/selectedForecast/none");
                        return;
                    }

                    LOG.info("[HomeScreen]/useFocusEffect/selectedForecast", selectedForecast.city.name);
                    displayedToHomeVm(selectedForecast)
                    setUseCurrentLocation(route.params.isCurrentLocation);

                    if (hasInterNetConnection()) {
                        LOG.info("[HomeScreen]/useFocusEffect/online");
                        LOG.info("[HomeScreen]/useFocusEffect/weatherRequest", selectedForecast.city.name);
                        // request for updated weather forecast
                        weatherRequestByLocationName(selectedForecast.city.name)
                    }
                    else {
                        // just display the saved data
                        LOG.info("[HomeScreen]/useFocusEffect/offline");
                        setWeatherDetails(selectedForecast);
                    }
                }
                // user just switch from location tab to home tab only
                else {
                    LOG.info("[HomeScreen]/useFocusEffect/no.route.params");

                    if (!hasCurrentLocation() && !hasHomeDisplayedForecast()) {
                        LOG.info("[HomeScreen]/noData");
                        setUseCurrentLocation(false);
                        return;
                    }

                    var selectedForecast = null;

                    // home displayed
                    if (hasHomeDisplayedForecast()) {
                        selectedForecast = getForecastByCityName(homeDisplayedForecast.city.name);
                        if (!selectedForecast) return;  
                    }
                    
                    if (selectedForecast && selectedForecast.city) {
                        setUseCurrentLocation(selectedForecast.city.name == currentLocation.place);
                    }

                    if (hasInterNetConnection()) {
                        LOG.info("[HomeScreen]/useFocusEffect/online");
                        LOG.info("[HomeScreen]/useFocusEffect/weatherRequest", selectedForecast.city.name);
                        // request for updated weather forecast
                        // only if current displayed is not the home displayed location
                        if (weatherDetails.uuid != selectedForecast.uuid) {
                            weatherRequestByLocationName(selectedForecast.city.name)
                        }
                    }
                    else {
                        // just display the saved data
                        LOG.info("[HomeScreen]/useFocusEffect/offline");
                        setWeatherDetails(selectedForecast);
                    }
                }
               
            }
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
                        { detectLocation &&
                            <CircularIcon
                                image={"map-marker"}
                                backgroundColor={theme.colors.primary}
                                onPress={detectDeviceLocationHandler}
                            />
                        }
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