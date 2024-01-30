import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import { Snackbar, Text, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment/moment";
import RBSheet from "react-native-raw-bottom-sheet";
import * as Network from 'expo-network';
import { useNetInfo } from '@react-native-community/netinfo';

import constants from '../config/constants';
import forecastApi from '../api/forecast';
import useLocation from '../hooks/useLocation';
import {
    addToForecasts,
    updateFromForecasts,
    displayedToHome,
} from '../redux/weather/weatherActions';
import { setCurrentLocation } from '../redux/location/locationActions';

import AppActivityIndicator from '../components/AppActivityIndicator';
import AppAlert from '../components/AppAlert';
import CircularIcon from '../components/CircularIcon';
import Screen from '../components/Screen';
import TemperatureUnit from '../components/TemperatureUnit';
import YourLocation from '../components/YourLocation';
import WeatherForecast from '../components/WeatherForecast';
import LOG from '../utility/logger';

// to show the actual temperature unit saved locally
const DEBUG = constants.debug;
const OFFLINE = constants.offlineMode;

const getTemperatureUnitSign = (
    forecastUnit,
    unitTemperature,
    debug = false) => {
        
    // forecastUnit - unit of the weather forecast from api response
    // unitTemperature - unit to display from the settings view

    var unit = unitTemperature;
    if (debug) {
        unit = forecastUnit
    }
    
    if (unit == constants.temperatureUnit.celsiusUnit) {
        return constants.temperatureUnitSign.celsiusUnit;
    }
    else if (unit == constants.temperatureUnit.fahrenheitUnit) {
        return constants.temperatureUnitSign.fahrenheitUnit;
    }
    else {
        return constants.temperatureUnitSign.kelvinUnit;
    }
};

const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9 / 5) + 32;
};

const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * 5 / 9;
};

const getTemperatureDisplay = (
    reading,
    fromDisplayUnit,
    temperatureUnit,
    withDecimal = false,
    debug = false) => {
    
    // LOG.info("[HomeScreen]/getTemperatureDisplay", reading);
    if (debug) return reading;

    var result = reading;

    // from: metric (celsius), to: metric (celsius)
    if (fromDisplayUnit == constants.temperatureUnit.celsiusUnit &&
        temperatureUnit == constants.temperatureUnit.celsiusUnit) {
            result = reading;
        }
    // from: imperial (fahrenheit), to: imperial (fahrenheit)
    else if (fromDisplayUnit == constants.temperatureUnit.fahrenheitUnit &&
        temperatureUnit == constants.temperatureUnit.fahrenheitUnit) {
            result = reading;
        }
    // from metric (celsius), to: imperial (fahrenheit)
    else if (fromDisplayUnit == constants.temperatureUnit.celsiusUnit &&
        temperatureUnit == constants.temperatureUnit.fahrenheitUnit) {
            result = celsiusToFahrenheit(reading);
        }
    // from imperial (fahrenheit), to: metric (celsius)
    else if (fromDisplayUnit == constants.temperatureUnit.fahrenheitUnit &&
        temperatureUnit == constants.temperatureUnit.celsiusUnit) {
            result = fahrenheitToCelsius(reading);
        }
    return withDecimal ? result.toFixed(2) : Math.round(result);
};

const showAlert = (title, message) => {
    Alert.alert(
        title,
        message,
        [
            { text: "OK" },
        ]
    );
};

function HomeScreen({ route, navigation }) {
    LOG.info("[HomeScreen]/Function-Component");

    // redux

    const temperatureUnitSaved = useSelector(state => state.theme.temperatureUnit);
    const savedLocations = useSelector(state => state.weather.forecasts);
    const homeDisplayedForecast = useSelector(state => state.weather.homeDisplayForecast);
    const currentLocation = useSelector(state => state.location.currentLocation);
    const dispatch = useDispatch();

    // hardware status

    const netInfo = useNetInfo();
    const [isInternetReachable, setIsInternetReachable] = useState(false);

    // api

    const [weatherDetails, setWeatherDetails] = useState(constants.defaultForecast);
    
    const {
        data: weatherDetailData,
        error,
        loading,
        request: weatherRequestByCoordinate,
        responseStatus: responseRequestByCoordinate
    } = useApi(forecastApi.getForecastByCoordinate);

    const {
        data: weatherDetailData2,
        error: error2,
        loading: loading2,
        request: weatherRequestByLocationName,
        responseStatus: responseRequestByLocationName
    } = useApi(forecastApi.getForecastByLocationName);

    // ui

    const theme = useTheme();
    const refRBSheet = useRef();
    // detect device location
    const { location, getLocation: getDeviceLocation } = useLocation();
    // your location indicator
    // use the current location button
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    // re-detect device location button display
    const [detectLocation, setDetectLocation] = useState(false);
    // search button display
    const [searchButton, setSearchButton] = useState(true);
    // snackbar visibility (no internet connection)
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const hasInterNetConnection = () => {
        return isInternetReachable
    };
    const cityName = () => {
        var datasource = constants.defaultForecast;
        if(weatherDetails && weatherDetails.city) {
            datasource = weatherDetails;
        }
        return datasource.city.name;
    };
    const temperature = () => {
        var datasource = constants.defaultForecast
        if (weatherDetails && weatherDetails.list) {
            datasource = weatherDetails;
        }
        return Math.round(datasource.list[0].main.temp);
    };
    const weather = () => {
        var datasource = constants.defaultForecast
        if (weatherDetails && weatherDetails.list) {
            datasource = weatherDetails;
        }
        return datasource.list[0].weather[0].description;
    }
    const forecastDate = () => {
        var datasource = constants.defaultForecast
        if (weatherDetails && weatherDetails.list) {
            datasource = weatherDetails;
        }
        // default forecast data
        if (datasource.list[0].dt == 0) {
            return "Unknown";
        }
        const momentDate = moment(datasource.list[0].dt * 1000);
        const forecastDate = momentDate.format('DD MMMM YYYY | hh:mm a');
        return forecastDate
    };
    const temperatureUnit = () => {
        var datasource = constants.defaultForecast
        if (weatherDetails && weatherDetails.list) {
            datasource = weatherDetails;
        }
        return datasource.temperatureUnit;
    };
    const getForecastByIdentifier = (uuid) => {
        const validForecasts = savedLocations.filter((forecast) => {
            return forecast.uuid == uuid;
        });
        //LOG.info("[HomeScreen]/getForecastByIdentifier", uuid, savedLocations.length, validForecasts.length);
        return validForecasts[0];
    };
    
    // actions

    const refreshHandler = () => {
        LOG.info("[HomeScreen]/refreshHandler");

        if (!isInternetReachable) {
            showAlert(
                "You are Offline",
                "Please check your internet connection."
            );
            return;
        }

        if (weatherDetails.uuid && weatherDetails.city.name) {
            LOG.info("[HomeScreen]/refreshHandler/weatherDetails", weatherDetails.city.name);
            weatherRequestByLocationName(weatherDetails.city.name);
        }
    };
    const detectDeviceLocationHandler = () => {
        LOG.info("[HomeScreen]", "detectDeviceLocationHandler", hasInterNetConnection());

        //showAlert("hasInternetConnection?", hasInterNetConnection() ? 'YES' : 'NO');
        
        if (hasInterNetConnection()) {
            setUseCurrentLocation(true);
            //
            getDeviceLocation();
        }
        else {
            showAlert(
                "You are Offline",
                "Please check your internet connection."
            );
        }
    };
    const searchLocationsHandler = () => {
        LOG.info("[HomeScreen]", "searchLocationsHandler");
        navigation.navigate("Locations");
    };

    // hooks

    // this will trigger once only when reload
    useEffect(() => {
        LOG.info("#1.0 [HomeScreen]/initialize");
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
            if (network.isConnected) {
                LOG.info("#1.2 [HomeScreen]/internetConnect", network);
                if (OFFLINE) {
                    setIsInternetReachable(false);
                }
                else {
                    setIsInternetReachable(true);
                }
                LOG.info("#1.2 [HomeScreen]/isInternetReachable", isInternetReachable);
            }
            else {
                setIsInternetReachable(false);
                LOG.info("#1.3 [HomeScreen]/internetNotConnected");
                LOG.info("#1.3 [HomeScreen]/homeDisplayedForecast", homeDisplayedForecast.city.name);
                LOG.info("#1.3 [HomeScreen]/currentLocation", currentLocation.place);

                // your location indicator
                const selectedForecast = getForecastByIdentifier(currentLocation.uuid);
                setUseCurrentLocation(selectedForecast.city.name == homeDisplayedForecast.city.name);

                // show home displayed forecast
                setWeatherDetails(homeDisplayedForecast)
            }
        })();
    }, []);

    useEffect(() => {
        LOG.info("#2.0 [HomeScreen]/isInternetReachable", isInternetReachable);
    }, [isInternetReachable]);

    useEffect(() => {
        LOG.info("#3.0 [HomeScreen]/useEffect/weatherDetailData", weatherDetailData);
        //
        //setWeatherDetails(weatherDetailData);
        //setUseCurrentLocation(true);
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

        dispatch(updateFromForecasts(weatherDetailData));
        // indicator that this location displayed from home tab
        dispatch(displayedToHome(weatherDetailData));
    }, [weatherDetailData]);

    useEffect(() => {
        LOG.info("[HomeScreen]/useEffect/Device-Location", location);
        //
        if (location) {
            if (hasInterNetConnection()) {
                LOG.info("[HomeScreen]/useEffect/weatherRequestByCooridnate");
                // request forecast using device location
                weatherRequestByCoordinate(
                    location.latitude,
                    location.longitude
                );
            }
            else {
                LOG.info("[HomeScreen]/useEffect/loadLocationHomeDisplay");
                let forecastHomeDisplayed = getForecastByIdentifier(homeDisplayedForecast.uuid)
                setWeatherDetails(forecastHomeDisplayed);
            }
        }
        setDetectLocation(location != null);
    }, [location]);

    // this will update every time change in internet connection status
    // user turn off/on the device wifi
    useEffect(() => {

        (async () => {
            let network = await Network.getNetworkStateAsync();
            if (network.isConnected) {
                if (OFFLINE) {
                    setIsInternetReachable(false);
                }
                else {
                    setIsInternetReachable(true);
                }
            }
            else {
                setIsInternetReachable(false);
            }
        })();
    }), [netInfo.isInternetReachable];

    useEffect(() => {
        if (!weatherDetailData2.city) return;

        LOG.info("[HomeScreen]/useEffect/weatherDetailData2", weatherDetailData2.city.name);
        //
        // Update the home display status from locations tab
        let data = weatherDetailData2;
        data.homeDisplayed = true;
        //
        setWeatherDetails(data);
        // indicator that this location displayed from home tab
        dispatch(displayedToHome(data));
        //
        if (!data) return;
        if (!data.list) return;
        if (data.list.length == 0) return;
        if (!data.city) return;

        LOG.info("[HomeScreen]/useEffect/weatherDetailData2", data);
        dispatch(updateFromForecasts(data));
    }, [weatherDetailData2]);

    useEffect(() => {
        LOG.info("[HomeScreen]/useEffect/weatherDetails");
        //
        let savedLocationNames = savedLocations.map((forecast) => forecast.city.name);
        //LOG.info("[HomeScreen]/Saved-Locations", savedLocationNames);

        if (!hasInterNetConnection()) {
            //setWeatherDetails(homeDisplayedForecast);
            dispatch(displayedToHome(weatherDetails));
            return;
        }
        
        if (!weatherDetails) return;

        if (!weatherDetails.list) return;
        if (weatherDetails.list.length == 0) return;

        if (!weatherDetails.city) return;

        let uuid = weatherDetails.uuid;
        let cityDetails = weatherDetails.city;
        let forecasts = weatherDetails.list;
        
        if (savedLocations.length == 0 && uuid.length > 0) {
            dispatch(addToForecasts(weatherDetails));
        }
        else {
            if (!savedLocationNames.includes(cityDetails.name) && uuid.length > 0) {
                LOG.info("[HomeScreen]/useEffect/Added-Location", cityDetails.name);
                dispatch(addToForecasts(weatherDetails));
            }
            else {
                LOG.info("[HomeScreen]/useEffect/Existing-Location", cityDetails.name);
                dispatch(updateFromForecasts(weatherDetails));
            }
        }

        if (location && useCurrentLocation) {
            dispatch(setCurrentLocation({
                latitude: location.latitude,
                longitude: location.longitude,
                place: weatherDetails.city.name,
                uuid: weatherDetails.uuid,
            }))
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
                    
                    const selectedForecast = getForecastByIdentifier(route.params.locationId);
                    setUseCurrentLocation(route.params.isCurrentLocation);

                    //showAlert("hasInternetConnection?" + selectedForecast.city.name, hasInterNetConnection() ? 'YES' : 'NO');

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
                    // home displayed
                    const selectedForecast = getForecastByIdentifier(homeDisplayedForecast.uuid);
                    setUseCurrentLocation(selectedForecast.city.name == currentLocation.place);
                
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
                        <Text style={styles.title} variant='titleLarge'>Forecast Report</Text>
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
    yourLocation: {
        marginBottom: 20,
    },
});

export default HomeScreen;