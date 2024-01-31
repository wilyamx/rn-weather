import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Snackbar, Text, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useNetInfo } from '@react-native-community/netinfo';
import moment from "moment/moment";
import RBSheet from "react-native-raw-bottom-sheet";
import * as Network from 'expo-network';

import constants from '../config/constants';
import forecastApi from '../api/forecast';
import useLocation from '../hooks/useLocation';
import {
    addToForecasts,
    updateFromForecasts,
    displayedToHome,
} from '../redux/weather/weatherActions';
import { setCurrentLocation } from '../redux/location/locationActions';
import { showAlert } from '../utility/views';

import { getWeatherImage } from '../config/WeatherImages';
import AppActivityIndicator from '../components/AppActivityIndicator';
import AppAlert from '../components/AppAlert';
import CircularIcon from '../components/CircularIcon';
import Screen from '../components/Screen';
import TemperatureUnit from '../components/TemperatureUnit';
import YourLocation from '../components/YourLocation';
import WeatherForecast from '../components/WeatherForecast';
import LOG from '../utility/logger';
import {
    getTemperatureUnitSign,
    getTemperatureDisplay
} from '../utility/forecast';

// to show the actual temperature unit saved locally
const DEBUG = constants.debug;
const OFFLINE = constants.offlineMode;

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

    // detect device location (long, lat)
    const { location, getLocation: getDeviceLocation } = useLocation();
    // your location indicator
    // use the current location button
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    // re-detect device location button display
    const [detectLocation, setDetectLocation] = useState(false);
    // search button display
    const [searchButton, setSearchButton] = useState(true);
    // snackbar visibility (no internet connection)
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    // calculated

    const [triggerFromLocationButton, setTriggerFromLocationButton] = useState(false);
    
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
    const weatherImage = () => {
        var datasource = constants.defaultForecast
        if (weatherDetails && weatherDetails.list) {
            datasource = weatherDetails;
        }
        return datasource.list[0].weather[0].main;
    };
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
        return forecastDate;
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
    const getForecastByCityName = (name) => {
        const validForecasts = savedLocations.filter((forecast) => {
            return forecast.city.name == name;
        });
        //LOG.info("[HomeScreen]/getForecastByIdentifier", uuid, savedLocations.length, validForecasts.length);
        return validForecasts[0];
    };
    const savedLocationsEnums = () => {
        let maps = savedLocations.map((forecast) => ({
            uuid: forecast.uuid,
            cityName: forecast.city.name
        }));
        return maps;
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
        setTriggerFromLocationButton(true);

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
    
    // convenience methods

    const hasCurrentLocation = () => {
        return (currentLocation && currentLocation.place);
    };
    const hasHomeDisplayedForecast = () => {
        return (homeDisplayedForecast &&
            homeDisplayedForecast.uuid &&
            homeDisplayedForecast.city)
    };

    // hooks

    // trigger when reload
    // this will trigger once only
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

                // your location indicator
                if (hasCurrentLocation()) {
                    LOG.info("#1.2 [HomeScreen]/currentLocation", currentLocation.place);
                    const forecast = getForecastByIdentifier(currentLocation.uuid);

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

        dispatch(updateFromForecasts(weatherDetailData));
        // indicator that this location displayed from home tab
        if (weatherDetailData.city.name) {
            dispatch(displayedToHome(weatherDetailData));
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
                let forecastHomeDisplayed = getForecastByIdentifier(homeDisplayedForecast.uuid)
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
        LOG.info("[HomeScreen]/useEffect/weatherDetailData2/city", weatherDetailData2.city.name);
        //
        // Update the home display status from locations tab
        let data = weatherDetailData2;
        data.homeDisplayed = true;
        //
        setWeatherDetails(data);
        // indicator that this location displayed from home tab
        if (data.city.name) {
            dispatch(displayedToHome(data));
        }
        //
        if (!data) return;
        if (!data.list) return;
        if (data.list.length == 0) return;
        if (!data.city) return;

        LOG.info("[HomeScreen]/useEffect/weatherDetailData2/data", data);
        dispatch(updateFromForecasts(data));
    }, [weatherDetailData2]);

    useEffect(() => {
        LOG.info("[HomeScreen]/useEffect/weatherDetails");
        //
        let savedLocationNames = savedLocations.map((forecast) => forecast.city.name);
        //LOG.info("[HomeScreen]/Saved-Locations", savedLocationNames);

        if (!hasInterNetConnection()) {
            //setWeatherDetails(homeDisplayedForecast);
            if (weatherDetails.city.name) {
                dispatch(displayedToHome(weatherDetails));
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

        if (!hasCurrentLocation()) {
            setUseCurrentLocation(false);
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
                    
                    const selectedForecast = getForecastByCityName(route.params.name);
                    if (!selectedForecast) {
                        LOG.info("[HomeScreen]/useFocusEffect/selectedForecast/none");
                        return;
                    }

                    LOG.info("[HomeScreen]/useFocusEffect/selectedForecast", selectedForecast.city.name);
                    dispatch(displayedToHome(selectedForecast));
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

                    if (hasCurrentLocation() && !hasHomeDisplayedForecast()) {
                        //return;
                    }

                    // home displayed
                    const selectedForecast = getForecastByIdentifier(homeDisplayedForecast.uuid);
                    if (!selectedForecast) return;

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